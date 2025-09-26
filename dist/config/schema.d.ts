import { z } from "zod";
export declare const ModerationThresholdsSchema: z.ZodObject<{
    warn: z.ZodDefault<z.ZodNumber>;
    mute: z.ZodDefault<z.ZodNumber>;
    ban: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    warn: number;
    mute: number;
    ban: number;
}, {
    warn?: number | undefined;
    mute?: number | undefined;
    ban?: number | undefined;
}>;
export declare const ChannelModerationSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    thresholds: z.ZodDefault<z.ZodObject<{
        warn: z.ZodDefault<z.ZodNumber>;
        mute: z.ZodDefault<z.ZodNumber>;
        ban: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        warn: number;
        mute: number;
        ban: number;
    }, {
        warn?: number | undefined;
        mute?: number | undefined;
        ban?: number | undefined;
    }>>;
    muteDurationMinutes: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    thresholds: {
        warn: number;
        mute: number;
        ban: number;
    };
    muteDurationMinutes: number;
}, {
    enabled?: boolean | undefined;
    thresholds?: {
        warn?: number | undefined;
        mute?: number | undefined;
        ban?: number | undefined;
    } | undefined;
    muteDurationMinutes?: number | undefined;
}>;
export declare const ChannelSettingsSchema: z.ZodObject<{
    read: z.ZodDefault<z.ZodBoolean>;
    moderate: z.ZodDefault<z.ZodBoolean>;
    moderation: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        thresholds: z.ZodDefault<z.ZodObject<{
            warn: z.ZodDefault<z.ZodNumber>;
            mute: z.ZodDefault<z.ZodNumber>;
            ban: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            warn: number;
            mute: number;
            ban: number;
        }, {
            warn?: number | undefined;
            mute?: number | undefined;
            ban?: number | undefined;
        }>>;
        muteDurationMinutes: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        thresholds: {
            warn: number;
            mute: number;
            ban: number;
        };
        muteDurationMinutes: number;
    }, {
        enabled?: boolean | undefined;
        thresholds?: {
            warn?: number | undefined;
            mute?: number | undefined;
            ban?: number | undefined;
        } | undefined;
        muteDurationMinutes?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    read: boolean;
    moderate: boolean;
    moderation: {
        enabled: boolean;
        thresholds: {
            warn: number;
            mute: number;
            ban: number;
        };
        muteDurationMinutes: number;
    };
}, {
    read?: boolean | undefined;
    moderate?: boolean | undefined;
    moderation?: {
        enabled?: boolean | undefined;
        thresholds?: {
            warn?: number | undefined;
            mute?: number | undefined;
            ban?: number | undefined;
        } | undefined;
        muteDurationMinutes?: number | undefined;
    } | undefined;
}>;
export declare const ChannelsMapSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    read: z.ZodDefault<z.ZodBoolean>;
    moderate: z.ZodDefault<z.ZodBoolean>;
    moderation: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        thresholds: z.ZodDefault<z.ZodObject<{
            warn: z.ZodDefault<z.ZodNumber>;
            mute: z.ZodDefault<z.ZodNumber>;
            ban: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            warn: number;
            mute: number;
            ban: number;
        }, {
            warn?: number | undefined;
            mute?: number | undefined;
            ban?: number | undefined;
        }>>;
        muteDurationMinutes: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        thresholds: {
            warn: number;
            mute: number;
            ban: number;
        };
        muteDurationMinutes: number;
    }, {
        enabled?: boolean | undefined;
        thresholds?: {
            warn?: number | undefined;
            mute?: number | undefined;
            ban?: number | undefined;
        } | undefined;
        muteDurationMinutes?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    read: boolean;
    moderate: boolean;
    moderation: {
        enabled: boolean;
        thresholds: {
            warn: number;
            mute: number;
            ban: number;
        };
        muteDurationMinutes: number;
    };
}, {
    read?: boolean | undefined;
    moderate?: boolean | undefined;
    moderation?: {
        enabled?: boolean | undefined;
        thresholds?: {
            warn?: number | undefined;
            mute?: number | undefined;
            ban?: number | undefined;
        } | undefined;
        muteDurationMinutes?: number | undefined;
    } | undefined;
}>>;
export declare const AiModelSchema: z.ZodObject<{
    provider: z.ZodDefault<z.ZodEnum<["openai", "anthropic", "mock"]>>;
    model: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    provider: "openai" | "anthropic" | "mock";
    model: string;
}, {
    provider?: "openai" | "anthropic" | "mock" | undefined;
    model?: string | undefined;
}>;
export declare const GuildConfigSchema: z.ZodObject<{
    guildId: z.ZodString;
    ai: z.ZodDefault<z.ZodObject<{
        chat: z.ZodDefault<z.ZodObject<{
            provider: z.ZodDefault<z.ZodEnum<["openai", "anthropic", "mock"]>>;
            model: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            provider: "openai" | "anthropic" | "mock";
            model: string;
        }, {
            provider?: "openai" | "anthropic" | "mock" | undefined;
            model?: string | undefined;
        }>>;
        chatChannelId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        chat: {
            provider: "openai" | "anthropic" | "mock";
            model: string;
        };
        chatChannelId?: string | undefined;
    }, {
        chat?: {
            provider?: "openai" | "anthropic" | "mock" | undefined;
            model?: string | undefined;
        } | undefined;
        chatChannelId?: string | undefined;
    }>>;
    channels: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        read: z.ZodDefault<z.ZodBoolean>;
        moderate: z.ZodDefault<z.ZodBoolean>;
        moderation: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            thresholds: z.ZodDefault<z.ZodObject<{
                warn: z.ZodDefault<z.ZodNumber>;
                mute: z.ZodDefault<z.ZodNumber>;
                ban: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                warn: number;
                mute: number;
                ban: number;
            }, {
                warn?: number | undefined;
                mute?: number | undefined;
                ban?: number | undefined;
            }>>;
            muteDurationMinutes: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            thresholds: {
                warn: number;
                mute: number;
                ban: number;
            };
            muteDurationMinutes: number;
        }, {
            enabled?: boolean | undefined;
            thresholds?: {
                warn?: number | undefined;
                mute?: number | undefined;
                ban?: number | undefined;
            } | undefined;
            muteDurationMinutes?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        read: boolean;
        moderate: boolean;
        moderation: {
            enabled: boolean;
            thresholds: {
                warn: number;
                mute: number;
                ban: number;
            };
            muteDurationMinutes: number;
        };
    }, {
        read?: boolean | undefined;
        moderate?: boolean | undefined;
        moderation?: {
            enabled?: boolean | undefined;
            thresholds?: {
                warn?: number | undefined;
                mute?: number | undefined;
                ban?: number | undefined;
            } | undefined;
            muteDurationMinutes?: number | undefined;
        } | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    guildId: string;
    ai: {
        chat: {
            provider: "openai" | "anthropic" | "mock";
            model: string;
        };
        chatChannelId?: string | undefined;
    };
    channels: Record<string, {
        read: boolean;
        moderate: boolean;
        moderation: {
            enabled: boolean;
            thresholds: {
                warn: number;
                mute: number;
                ban: number;
            };
            muteDurationMinutes: number;
        };
    }>;
}, {
    guildId: string;
    ai?: {
        chat?: {
            provider?: "openai" | "anthropic" | "mock" | undefined;
            model?: string | undefined;
        } | undefined;
        chatChannelId?: string | undefined;
    } | undefined;
    channels?: Record<string, {
        read?: boolean | undefined;
        moderate?: boolean | undefined;
        moderation?: {
            enabled?: boolean | undefined;
            thresholds?: {
                warn?: number | undefined;
                mute?: number | undefined;
                ban?: number | undefined;
            } | undefined;
            muteDurationMinutes?: number | undefined;
        } | undefined;
    }> | undefined;
}>;
export type ModerationThresholds = z.infer<typeof ModerationThresholdsSchema>;
export type ChannelModeration = z.infer<typeof ChannelModerationSchema>;
export type ChannelSettings = z.infer<typeof ChannelSettingsSchema>;
export type AiModel = z.infer<typeof AiModelSchema>;
export type GuildConfig = z.infer<typeof GuildConfigSchema>;
//# sourceMappingURL=schema.d.ts.map