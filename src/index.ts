import { config as loadEnv } from "dotenv";
import { DiscordBot } from "./core/client.js";
import { logger } from "./utils/logger.js";

loadEnv();

async function main(): Promise<void> {
	const bot = new DiscordBot();
	if (process.env.REGISTER_COMMANDS === "1") {
		await bot.registerSlashCommands();
	}
	await bot.start();
}

main().catch((err: unknown) => {
	logger.error(err);
	process.exit(1);
});

