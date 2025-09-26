import { Client } from "discord.js";
export declare class DiscordBot {
    readonly client: Client;
    private readonly commands;
    constructor();
    private registerCommand;
    registerSlashCommands(): Promise<void>;
    private onMessage;
    start(): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map