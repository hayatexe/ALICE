import type { GuildMember, Message } from "discord.js";
import { evaluateMessageContent, type RuleHit } from "./rules.js";
import { ConfigStore } from "../config/store.js";
import { logger } from "../utils/logger.js";

export class ModerationService {
	private static instance: ModerationService | null = null;

	static getInstance(): ModerationService {
		if (!this.instance) this.instance = new ModerationService();
		return this.instance;
	}

	private constructor() {}

	async handleMessage(message: Message): Promise<void> {
		if (!message.guildId || message.author.bot) return;
		const store = ConfigStore.getInstance();
		const cfg = await store.getGuildConfig(message.guildId);
		const channelCfg = cfg.channels[message.channelId];
		if (!channelCfg || !channelCfg.moderate || !channelCfg.moderation.enabled) return;

		const hits: RuleHit[] = evaluateMessageContent(message.content ?? "");
		if (hits.length === 0) return;

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

	private async warnUser(message: Message, hit: RuleHit): Promise<void> {
		try {
			await message.reply({ content: `⚠️ Please follow the rules. Reason: ${hit.category}.` });
		} catch (err: unknown) {
			logger.warn("Failed to warn user", err);
		}
	}

	private async muteUser(message: Message, hit: RuleHit, minutes: number): Promise<void> {
		try {
			const member = await message.guild?.members.fetch(message.author.id);
			if (member) {
				const ms = minutes * 60 * 1000;
				await member.timeout(ms, `Auto-mute: ${hit.category}`);
				await message.reply({ content: `🔇 User muted for ${minutes} minutes.` });
			}
		} catch (err: unknown) {
			logger.warn("Failed to mute user", err);
		}
	}

	private async banUser(message: Message, hit: RuleHit): Promise<void> {
		try {
			await message.guild?.members.ban(message.author.id, { reason: `Auto-ban: ${hit.category}` });
			await message.reply({ content: `⛔ User banned.` });
		} catch (err: unknown) {
			logger.warn("Failed to ban user", err);
		}
	}
}

