import { Client, Collection, GatewayIntentBits, Partials, REST, Routes, type ChatInputCommandInteraction, type Message } from "discord.js";
import { config as loadEnv } from "dotenv";
import { logger } from "../utils/logger.js";
import * as ChannelsCommand from "../commands/channels.js";
import * as ModelCommand from "../commands/model.js";
import * as ImageCommand from "../commands/image.js";
import * as ModerationCommand from "../commands/moderation.js";
import { ConfigStore } from "../config/store.js";
import { aiRegistry } from "./registry.js";
import { ModerationService } from "../moderation/index.js";

loadEnv();

type CommandModule = {
	data: { toJSON: () => unknown; name: string };
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export class DiscordBot {
	public readonly client: Client;
	private readonly commands = new Collection<string, CommandModule>();

	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			],
			partials: [Partials.Channel],
		});

		this.registerCommand(ChannelsCommand as unknown as CommandModule);
		this.registerCommand(ModelCommand as unknown as CommandModule);
		this.registerCommand(ImageCommand as unknown as CommandModule);
		this.registerCommand(ModerationCommand as unknown as CommandModule);

		this.client.once("ready", () => {
			logger.info(`Logged in as ${this.client.user?.tag}`);
		});

		this.client.on("interactionCreate", async (interaction) => {
			if (!interaction.isChatInputCommand()) return;
			const cmd = this.commands.get(interaction.commandName);
			if (!cmd) return;
			try {
				await cmd.execute(interaction);
			} catch (err: unknown) {
				logger.error("Command failed", err);
				if (!interaction.replied) await interaction.reply({ ephemeral: true, content: "Command failed." });
			}
		});

		this.client.on("messageCreate", (message) => this.onMessage(message));
	}

	private registerCommand(module: CommandModule): void {
		this.commands.set(module.data.name, module);
	}

	async registerSlashCommands(): Promise<void> {
		const token = process.env.DISCORD_TOKEN;
		const clientId = process.env.DISCORD_CLIENT_ID;
		if (!token || !clientId) throw new Error("DISCORD_TOKEN or DISCORD_CLIENT_ID missing");
		const rest = new REST({ version: "10" }).setToken(token);
		const body = Array.from(this.commands.values()).map((c) => c.data.toJSON());
		await rest.put(Routes.applicationCommands(clientId), { body });
		logger.info("Registered slash commands");
	}

	private async onMessage(message: Message): Promise<void> {
		if (!message.guildId || message.author.bot) return;
		// Always run moderation first
		await ModerationService.getInstance().handleMessage(message);

		// AI chat only in configured channel and only when read is enabled
		const store = ConfigStore.getInstance();
		const cfg = await store.getGuildConfig(message.guildId);
		const aiChannelId = cfg.ai.chatChannelId;
		if (!aiChannelId || message.channelId !== aiChannelId) return;
		const channelCfg = cfg.channels[message.channelId];
		if (!channelCfg || !channelCfg.read) return;

		const provider = aiRegistry.get(cfg.ai.chat.provider);
		if (!provider) return;
		const reply = await provider.complete([
			{ role: "system", content: "You are a helpful assistant for this Discord server." },
			{ role: "user", content: message.content },
		], { model: cfg.ai.chat.model });
		if (reply.trim().length > 0) {
			await message.reply(reply.slice(0, 1900));
		}
	}

	async start(): Promise<void> {
		const token = process.env.DISCORD_TOKEN;
		if (!token) throw new Error("DISCORD_TOKEN missing");
		await this.client.login(token);
	}
}

