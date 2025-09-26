import { type AiProvider, type ChatMessage } from "../index.js";
export declare class AnthropicProvider implements AiProvider {
    readonly name = "anthropic";
    private client;
    constructor(apiKey?: string);
    complete(messages: ChatMessage[], options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    }): Promise<string>;
}
//# sourceMappingURL=anthropic.d.ts.map