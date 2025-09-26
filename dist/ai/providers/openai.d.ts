import { type AiProvider, type ChatMessage } from "../index.js";
export declare class OpenAiProvider implements AiProvider {
    readonly name = "openai";
    private client;
    constructor(apiKey?: string);
    complete(messages: ChatMessage[], options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    }): Promise<string>;
}
//# sourceMappingURL=openai.d.ts.map