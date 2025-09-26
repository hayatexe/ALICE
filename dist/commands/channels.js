import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from "discord.js";
import { ConfigStore } from "../config/store.js";
export const data = new SlashCommandBuilder()
    .setName("channels")
    .setDescription("Manage authorized channels and AI chat channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) => sub
    .setName("authorize")
    .setDescription("Authorize a channel for reading and optional moderation")
    .addChannelOption((opt) => opt.setName("channel").setDescription("Channel to authorize").addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addBooleanOption((opt) => opt.setName("read").setDescription("Allow bot to read/respond in this channel").setRequired(true))
    .addBooleanOption((opt) => opt.setName("moderate").setDescription("Enable moderation in this channel").setRequired(false)))
    .addSubcommand((sub) => sub
    .setName("deauthorize")
    .setDescription("Remove a channel from authorization list")
    .addChannelOption((opt) => opt.setName("channel").setDescription("Channel to deauthorize").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((sub) => sub.setName("list").setDescription("List authorized channels"))
    .addSubcommand((sub) => sub
    .setName("set-ai")
    .setDescription("Set the dedicated AI chat channel")
    .addChannelOption((opt) => opt.setName("channel").setDescription("Channel for AI chat").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((sub) => sub.setName("clear-ai").setDescription("Clear the AI chat channel"));
export async function execute(interaction) {
    if (!interaction.guildId) {
        await interaction.reply({ ephemeral: true, content: "This command can only be used in a guild." });
        return;
    }
    const store = ConfigStore.getInstance();
    const sub = interaction.options.getSubcommand();
    switch (sub) {
        case "authorize": {
            const channel = interaction.options.getChannel("channel", true);
            const read = interaction.options.getBoolean("read", true);
            const moderate = interaction.options.getBoolean("moderate") ?? false;
            await store.authorizeChannel(interaction.guildId, channel.id, { read, moderate });
            await interaction.reply({ ephemeral: true, content: `Authorized <#${channel.id}> (read=${read}, moderate=${moderate})` });
            break;
        }
        case "deauthorize": {
            const channel = interaction.options.getChannel("channel", true);
            await store.deauthorizeChannel(interaction.guildId, channel.id);
            await interaction.reply({ ephemeral: true, content: `Deauthorized <#${channel.id}>` });
            break;
        }
        case "list": {
            const list = await store.listAuthorizedChannels(interaction.guildId);
            if (list.length === 0) {
                await interaction.reply({ ephemeral: true, content: "No authorized channels." });
                break;
            }
            const lines = list.map((x) => `- <#${x.channelId}> read=${x.settings.read} moderate=${x.settings.moderate}`);
            await interaction.reply({ ephemeral: true, content: `Authorized channels:\n${lines.join("\n")}` });
            break;
        }
        case "set-ai": {
            const channel = interaction.options.getChannel("channel", true);
            await store.setAiChatChannel(interaction.guildId, channel.id);
            await interaction.reply({ ephemeral: true, content: `AI chat channel set to <#${channel.id}>` });
            break;
        }
        case "clear-ai": {
            await store.setAiChatChannel(interaction.guildId, null);
            await interaction.reply({ ephemeral: true, content: "AI chat channel cleared." });
            break;
        }
        default:
            await interaction.reply({ ephemeral: true, content: "Unknown subcommand." });
    }
}
//# sourceMappingURL=channels.js.map