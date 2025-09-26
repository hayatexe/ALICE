import { type AiProvider, type ChatMessage } from "../index.js";

export class MockProvider implements AiProvider {
	public readonly name = "mock";

	async complete(messages: ChatMessage[], options?: { model?: string; temperature?: number; maxTokens?: number }): Promise<string> {
		const lastUser = [...messages].reverse().find((m) => m.role === "user");
		return `Echo (${options?.model ?? "mock-model"}): ${lastUser?.content ?? ""}`;
	}
}

