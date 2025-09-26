import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { GuildConfigSchema, type GuildConfig, type ChannelSettings, type AiModel, type ChannelModeration, ChannelModerationSchema } from "./schema.js";
import { logger } from "../utils/logger.js";

const DATA_DIR = path.join(process.cwd(), "data", "guilds");

async function ensureDir(dir: string): Promise<void> {
	await fs.mkdir(dir, { recursive: true });
}

async function readJson<T>(filePath: string, schema: z.ZodSchema<T>): Promise<T | null> {
	try {
		const buf = await fs.readFile(filePath, "utf8");
		const json = JSON.parse(buf);
		const parsed = schema.safeParse(json);
		if (!parsed.success) {
			logger.warn("Config validation failed; using defaults", parsed.error.toString());
			return null;
		}
		return parsed.data;
	} catch (err: unknown) {
		return null;
	}
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
	const tmp = `${filePath}.tmp`;
	await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
	await fs.rename(tmp, filePath);
}

export class ConfigStore {
	private static instance: ConfigStore | null = null;

	static getInstance(): ConfigStore {
		if (!this.instance) this.instance = new ConfigStore();
		return this.instance;
	}

	private constructor() {}

	private fileForGuild(guildId: string): string {
		return path.join(DATA_DIR, `${guildId}.json`);
	}

	async getGuildConfig(guildId: string): Promise<GuildConfig> {
		await ensureDir(DATA_DIR);
		const file = this.fileForGuild(guildId);
		const existing = await readJson(file, GuildConfigSchema);
		if (existing) return existing;
		const defaults: GuildConfig = GuildConfigSchema.parse({ guildId });
		await writeJson(file, defaults);
		return defaults;
	}

	async saveGuildConfig(config: GuildConfig): Promise<void> {
		await ensureDir(DATA_DIR);
		const file = this.fileForGuild(config.guildId);
		await writeJson(file, config);
	}

	async setAiChatChannel(guildId: string, channelId: string | null): Promise<GuildConfig> {
		const cfg = await this.getGuildConfig(guildId);
		cfg.ai.chatChannelId = channelId ?? undefined;
		await this.saveGuildConfig(cfg);
		return cfg;
	}

	async setAiModel(guildId: string, model: AiModel): Promise<GuildConfig> {
		const cfg = await this.getGuildConfig(guildId);
		cfg.ai.chat = model;
		await this.saveGuildConfig(cfg);
		return cfg;
	}

	async authorizeChannel(guildId: string, channelId: string, opts: { read?: boolean; moderate?: boolean }): Promise<GuildConfig> {
		const cfg = await this.getGuildConfig(guildId);
		const existing: ChannelSettings = cfg.channels[channelId] ?? { read: false, moderate: false, moderation: ChannelModerationSchema.parse({}) };
		cfg.channels[channelId] = {
			...existing,
			read: opts.read ?? existing.read,
			moderate: opts.moderate ?? existing.moderate,
		};
		await this.saveGuildConfig(cfg);
		return cfg;
	}

	async deauthorizeChannel(guildId: string, channelId: string): Promise<GuildConfig> {
		const cfg = await this.getGuildConfig(guildId);
		delete cfg.channels[channelId];
		await this.saveGuildConfig(cfg);
		return cfg;
	}

	async setModeration(guildId: string, channelId: string, moderation: Partial<ChannelModeration>): Promise<GuildConfig> {
		const cfg = await this.getGuildConfig(guildId);
		const existing: ChannelSettings = cfg.channels[channelId] ?? { read: false, moderate: false, moderation: ChannelModerationSchema.parse({}) };
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

	async listAuthorizedChannels(guildId: string): Promise<Array<{ channelId: string; settings: ChannelSettings }>> {
		const cfg = await this.getGuildConfig(guildId);
		return Object.entries(cfg.channels).map(([channelId, settings]) => ({ channelId, settings }));
	}
}

