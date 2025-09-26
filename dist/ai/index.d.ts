export type ChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};
export interface AiProvider {
    name: string;
    complete(messages: ChatMessage[], options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    }): Promise<string>;
}
export declare class AiRegistry {
    private providers;
    register(provider: AiProvider): void;
    get(name: string): AiProvider | undefined;
    list(): string[];
}
//# sourceMappingURL=index.d.ts.map