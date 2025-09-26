import { type AiProvider, type ChatMessage } from "../index.js";
export declare class MockProvider implements AiProvider {
    readonly name = "mock";
    complete(messages: ChatMessage[], options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    }): Promise<string>;
}
//# sourceMappingURL=mock.d.ts.map