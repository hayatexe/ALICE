import { type GuildConfig, type ChannelSettings, type AiModel, type ChannelModeration } from "./schema.js";
export declare class ConfigStore {
    private static instance;
    static getInstance(): ConfigStore;
    private constructor();
    private fileForGuild;
    getGuildConfig(guildId: string): Promise<GuildConfig>;
    saveGuildConfig(config: GuildConfig): Promise<void>;
    setAiChatChannel(guildId: string, channelId: string | null): Promise<GuildConfig>;
    setAiModel(guildId: string, model: AiModel): Promise<GuildConfig>;
    authorizeChannel(guildId: string, channelId: string, opts: {
        read?: boolean;
        moderate?: boolean;
    }): Promise<GuildConfig>;
    deauthorizeChannel(guildId: string, channelId: string): Promise<GuildConfig>;
    setModeration(guildId: string, channelId: string, moderation: Partial<ChannelModeration>): Promise<GuildConfig>;
    listAuthorizedChannels(guildId: string): Promise<Array<{
        channelId: string;
        settings: ChannelSettings;
    }>>;
}
//# sourceMappingURL=store.d.ts.map