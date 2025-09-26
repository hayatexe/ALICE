import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { GuildConfigSchema, ChannelModerationSchema } from "./schema.js";
import { logger } from "../utils/logger.js";
const DATA_DIR = path.join(process.cwd(), "data", "guilds");
async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}
async function readJson(filePath, schema) {
    try {
        const buf = await fs.readFile(filePath, "utf8");
        const json = JSON.parse(buf);
        const parsed = schema.safeParse(json);
        if (!parsed.success) {
            logger.warn("Config validation failed; using defaults", parsed.error.toString());
            return null;
        }
        return parsed.data;
    }
    catch (err) {
        return null;
    }
}
async function writeJson(filePath, data) {
    const tmp = `${filePath}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmp, filePath);
}
export class ConfigStore {
    static instance = null;
    static getInstance() {
        if (!this.instance)
            this.instance = new ConfigStore();
        return this.instance;
    }
    constructor() { }
    fileForGuild(guildId) {
        return path.join(DATA_DIR, `${guildId}.json`);
    }
    async getGuildConfig(guildId) {
        await ensureDir(DATA_DIR);
        const file = this.fileForGuild(guildId);
        const existing = await readJson(file, GuildConfigSchema);
        if (existing)
            return existing;
        const defaults = GuildConfigSchema.parse({ guildId });
        await writeJson(file, defaults);
        return defaults;
    }
    async saveGuildConfig(config) {
        await ensureDir(DATA_DIR);
        const file = this.fileForGuild(config.guildId);
        await writeJson(file, config);
    }
    async setAiChatChannel(guildId, channelId) {
        const cfg = await this.getGuildConfig(guildId);
        cfg.ai.chatChannelId = channelId ?? undefined;
        await this.saveGuildConfig(cfg);
        return cfg;
    }
    async setAiModel(guildId, model) {
        const cfg = await this.getGuildConfig(guildId);
        cfg.ai.chat = model;
        await this.saveGuildConfig(cfg);
        return cfg;
    }
    async authorizeChannel(guildId, channelId, opts) {
        const cfg = await this.getGuildConfig(guildId);
        const existing = cfg.channels[channelId] ?? { read: false, moderate: false, moderation: ChannelModerationSchema.parse({}) };
        cfg.channels[channelId] = {
            ...existing,
            read: opts.read ?? existing.read,
            moderate: opts.moderate ?? existing.moderate,
        };
        await this.saveGuildConfig(cfg);
        return cfg;
    }
    async deauthorizeChannel(guildId, channelId) {
        const cfg = await this.getGuildConfig(guildId);
        delete cfg.channels[channelId];
        await this.saveGuildConfig(cfg);
        return cfg;
    }
    async setModeration(guildId, channelId, moderation) {
        const cfg = await this.getGuildConfig(guildId);
        const existing = cfg.channels[channelId] ?? { read: false, moderate: false, moderation: ChannelModerationSchema.parse({}) };
        cfg.channels[channelId] = {
            ...existing,
            moderate: moderation.enabled ?? existing.moderate,
            moderation: {
                ...existing.moderation,
                ...moderation,
                thresholds: {
                    ...existing.moderation.thresholds,
                    ...(moderation.thresholds ?? {}),
                },
            },
        };
        await this.saveGuildConfig(cfg);
        return cfg;
    }
    async listAuthorizedChannels(guildId) {
        const cfg = await this.getGuildConfig(guildId);
        return Object.entries(cfg.channels).map(([channelId, settings]) => ({ channelId, settings }));
    }
}
//# sourceMappingURL=store.js.map