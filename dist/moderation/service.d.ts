import type { Message } from "discord.js";
export declare class ModerationService {
    private static instance;
    static getInstance(): ModerationService;
    private constructor();
    handleMessage(message: Message): Promise<void>;
    private warnUser;
    private muteUser;
    private banUser;
}
//# sourceMappingURL=service.d.ts.map