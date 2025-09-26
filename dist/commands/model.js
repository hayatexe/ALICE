import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { ConfigStore } from "../config/store.js";
import { aiRegistry } from "../core/registry.js";
export const data = new SlashCommandBuilder()
    .setName("model")
    .setDescription("Set or show the AI model for this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) => sub.setName("show").setDescription("Show current AI model"))
    .addSubcommand((sub) => sub
    .setName("set")
    .setDescription("Set AI provider and model name")
    .addStringOption((opt) => opt
    .setName("provider")
    .setDescription("AI provider")
    .addChoices({ name: "openai", value: "openai" }, { name: "anthropic", value: "anthropic" }, { name: "mock", value: "mock" })
    .setRequired(true))
    .addStringOption((opt) => opt.setName("model").setDescription("Model identifier").setRequired(true)));
export async function execute(interaction) {
    if (!interaction.guildId) {
        await interaction.reply({ ephemeral: true, content: "This command can only be used in a guild." });
        return;
    }
    const store = ConfigStore.getInstance();
    const sub = interaction.options.getSubcommand();
    if (sub === "show") {
        const cfg = await store.getGuildConfig(interaction.guildId);
        await interaction.reply({ ephemeral: true, content: `Provider: ${cfg.ai.chat.provider}, Model: ${cfg.ai.chat.model}` });
        return;
    }
    if (sub === "set") {
        const provider = interaction.options.getString("provider", true);
        const model = interaction.options.getString("model", true);
        if (!aiRegistry.get(provider)) {
            await interaction.reply({ ephemeral: true, content: `Unknown provider: ${provider}` });
            return;
        }
        await store.setAiModel(interaction.guildId, { provider: provider, model });
        await interaction.reply({ ephemeral: true, content: `AI model set: ${provider}/${model}` });
    }
}
//# sourceMappingURL=model.js.map