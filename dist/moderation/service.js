import { evaluateMessageContent } from "./rules.js";
import { ConfigStore } from "../config/store.js";
import { logger } from "../utils/logger.js";
export class ModerationService {
    static instance = null;
    static getInstance() {
        if (!this.instance)
            this.instance = new ModerationService();
        return this.instance;
    }
    constructor() { }
    async handleMessage(message) {
        if (!message.guildId || message.author.bot)
            return;
        const store = ConfigStore.getInstance();
        const cfg = await store.getGuildConfig(message.guildId);
        const channelCfg = cfg.channels[message.channelId];
        if (!channelCfg || !channelCfg.moderate || !channelCfg.moderation.enabled)
            return;
        const hits = evaluateMessageContent(message.content ?? "");
        if (hits.length === 0)
            return;
        const worst = hits.reduce((a, b) => (a.severity > b.severity ? a : b));
        const th = channelCfg.moderation.thresholds;
        if (worst.severity >= th.ban) {
            await this.banUser(message, worst);
            return;
        }
        if (worst.severity >= th.mute) {
            await this.muteUser(message, worst, channelCfg.moderation.muteDurationMinutes);
            return;
        }
        if (worst.severity >= th.warn) {
            await this.warnUser(message, worst);
            return;
        }
    }
    async warnUser(message, hit) {
        try {
            await message.reply({ content: `⚠️ Please follow the rules. Reason: ${hit.category}.` });
        }
        catch (err) {
            logger.warn("Failed to warn user", err);
        }
    }
    async muteUser(message, hit, minutes) {
        try {
            const member = await message.guild?.members.fetch(message.author.id);
            if (member) {
                const ms = minutes * 60 * 1000;
                await member.timeout(ms, `Auto-mute: ${hit.category}`);
                await message.reply({ content: `🔇 User muted for ${minutes} minutes.` });
            }
        }
        catch (err) {
            logger.warn("Failed to mute user", err);
        }
    }
    async banUser(message, hit) {
        try {
            await message.guild?.members.ban(message.author.id, { reason: `Auto-ban: ${hit.category}` });
            await message.reply({ content: `⛔ User banned.` });
        }
        catch (err) {
            logger.warn("Failed to ban user", err);
        }
    }
}
//# sourceMappingURL=service.js.map