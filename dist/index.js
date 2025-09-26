import { config as loadEnv } from "dotenv";
import { DiscordBot } from "./core/client.js";
import { logger } from "./utils/logger.js";
loadEnv();
async function main() {
    const bot = new DiscordBot();
    if (process.env.REGISTER_COMMANDS === "1") {
        await bot.registerSlashCommands();
    }
    await bot.start();
}
main().catch((err) => {
    logger.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map