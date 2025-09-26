import { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder } from "discord.js";
import { OpenAI } from "openai";
export const data = new SlashCommandBuilder()
    .setName("image")
    .setDescription("Generate an image from a prompt")
    .addStringOption((opt) => opt.setName("prompt").setDescription("Image prompt").setRequired(true))
    .addIntegerOption((opt) => opt.setName("size").setDescription("Size (pixels, square). One of 256, 512, 1024").addChoices({ name: "256", value: 256 }, { name: "512", value: 512 }, { name: "1024", value: 1024 }))
    .addStringOption((opt) => opt.setName("model").setDescription("Image model (default: dall-e-3)"));
export async function execute(interaction) {
    const prompt = interaction.options.getString("prompt", true);
    const size = interaction.options.getInteger("size") ?? 1024;
    const model = interaction.options.getString("model") ?? process.env.OPENAI_IMAGE_MODEL ?? "dall-e-3";
    await interaction.deferReply();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const sizeStr = size === 256 ? "256x256" : size === 512 ? "512x512" : "1024x1024";
    const result = await openai.images.generate({ model, prompt, size: sizeStr });
    const data = result.data ?? [];
    const b64 = data[0]?.b64_json ?? null;
    if (!b64) {
        await interaction.editReply("Failed to generate image.");
        return;
    }
    const buffer = Buffer.from(b64, "base64");
    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
    await interaction.editReply({ files: [attachment] });
}
//# sourceMappingURL=image.js.map