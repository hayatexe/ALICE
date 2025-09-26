import { z } from "zod";
export const ModerationThresholdsSchema = z.object({
    warn: z.number().min(0).max(1).default(0.5),
    mute: z.number().min(0).max(1).default(0.75),
    ban: z.number().min(0).max(1).default(0.95),
});
export const ChannelModerationSchema = z.object({
    enabled: z.boolean().default(false),
    thresholds: ModerationThresholdsSchema.default({ warn: 0.5, mute: 0.75, ban: 0.95 }),
    muteDurationMinutes: z.number().int().min(1).max(10080).default(60), // up to 7 days
});
export const ChannelSettingsSchema = z.object({
    read: z.boolean().default(false),
    moderate: z.boolean().default(false),
    moderation: ChannelModerationSchema.default({ enabled: false, thresholds: { warn: 0.5, mute: 0.75, ban: 0.95 }, muteDurationMinutes: 60 }),
});
export const ChannelsMapSchema = z.record(z.string(), ChannelSettingsSchema);
export const AiModelSchema = z.object({
    provider: z.enum(["openai", "anthropic", "mock"]).default("openai"),
    model: z.string().default("gpt-4o-mini"),
});
export const GuildConfigSchema = z.object({
    guildId: z.string(),
    ai: z.object({
        chat: AiModelSchema.default({ provider: "openai", model: "gpt-4o-mini" }),
        chatChannelId: z.string().optional(),
    }).default({ chat: { provider: "openai", model: "gpt-4o-mini" } }),
    channels: ChannelsMapSchema.default({}),
});
//# sourceMappingURL=schema.js.map