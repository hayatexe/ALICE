import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from "discord.js";
import { ConfigStore } from "../config/store.js";
export const data = new SlashCommandBuilder()
    .setName("moderation")
    .setDescription("Configure moderation per channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) => sub
    .setName("enable")
    .setDescription("Enable moderation in a channel")
    .addChannelOption((opt) => opt.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((sub) => sub
    .setName("disable")
    .setDescription("Disable moderation in a channel")
    .addChannelOption((opt) => opt.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((sub) => sub
    .setName("thresholds")
    .setDescription("Set warn/mute/ban thresholds (0..1)")
    .addChannelOption((opt) => opt.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addNumberOption((opt) => opt.setName("warn").setDescription("Warn threshold (0..1)").setMinValue(0).setMaxValue(1))
    .addNumberOption((opt) => opt.setName("mute").setDescription("Mute threshold (0..1)").setMinValue(0).setMaxValue(1))
    .addNumberOption((opt) => opt.setName("ban").setDescription("Ban threshold (0..1)").setMinValue(0).setMaxValue(1))
    .addIntegerOption((opt) => opt.setName("mute_minutes").setDescription("Mute duration in minutes").setMinValue(1).setMaxValue(10080)))
    .addSubcommand((sub) => sub
    .setName("show")
    .setDescription("Show moderation settings for a channel")
    .addChannelOption((opt) => opt.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText).setRequired(true)));
export async function execute(interaction) {
    if (!interaction.guildId) {
        await interaction.reply({ ephemeral: true, content: "Use this in a guild." });
        return;
    }
    const store = ConfigStore.getInstance();
    const sub = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("channel", true);
    if (sub === "enable") {
        await store.setModeration(interaction.guildId, channel.id, { enabled: true });
        await interaction.reply({ ephemeral: true, content: `Moderation enabled in <#${channel.id}>.` });
        return;
    }
    if (sub === "disable") {
        await store.setModeration(interaction.guildId, channel.id, { enabled: false });
        await interaction.reply({ ephemeral: true, content: `Moderation disabled in <#${channel.id}>.` });
        return;
    }
    if (sub === "thresholds") {
        const warn = interaction.options.getNumber("warn") ?? undefined;
        const mute = interaction.options.getNumber("mute") ?? undefined;
        const ban = interaction.options.getNumber("ban") ?? undefined;
        const muteMinutes = interaction.options.getInteger("mute_minutes") ?? undefined;
        await store.setModeration(interaction.guildId, channel.id, {
            thresholds: { warn: warn ?? 0.5, mute: mute ?? 0.75, ban: ban ?? 0.95 },
            muteDurationMinutes: muteMinutes,
        });
        await interaction.reply({ ephemeral: true, content: `Updated thresholds for <#${channel.id}>.` });
        return;
    }
    if (sub === "show") {
        const cfg = await store.getGuildConfig(interaction.guildId);
        const ch = cfg.channels[channel.id];
        if (!ch) {
            await interaction.reply({ ephemeral: true, content: "Channel has no settings." });
            return;
        }
        await interaction.reply({ ephemeral: true, content: `enabled=${ch.moderation.enabled}, thresholds=${JSON.stringify(ch.moderation.thresholds)}, mute_minutes=${ch.moderation.muteDurationMinutes}` });
        return;
    }
}
//# sourceMappingURL=moderation.js.map