export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export interface AiProvider {
	name: string;
	complete(messages: ChatMessage[], options?: { model?: string; temperature?: number; maxTokens?: number }): Promise<string>;
}

export class AiRegistry {
	private providers: Map<string, AiProvider> = new Map();

	register(provider: AiProvider): void {
		this.providers.set(provider.name, provider);
	}

	get(name: string): AiProvider | undefined {
		return this.providers.get(name);
	}

	list(): string[] {
		return Array.from(this.providers.keys());
	}
}

