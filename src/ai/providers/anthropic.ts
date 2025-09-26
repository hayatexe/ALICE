import Anthropic from "anthropic";
import { type AiProvider, type ChatMessage } from "../index.js";

export class AnthropicProvider implements AiProvider {
	public readonly name = "anthropic";
	private client: Anthropic;

	constructor(apiKey?: string) {
		this.client = new Anthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY });
	}

	async complete(messages: ChatMessage[], options?: { model?: string; temperature?: number; maxTokens?: number }): Promise<string> {
		const model = options?.model || process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
		// Convert to Anthropic Messages API format
		const systemParts = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
		const nonSystem = messages.filter((m) => m.role !== "system");
		const result = await this.client.messages.create({
			model,
			max_tokens: options?.maxTokens ?? 512,
			temperature: options?.temperature ?? 0.7,
			system: systemParts || undefined,
			messages: nonSystem.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
		});
		const text = result.content?.map((c) => (c.type === "text" ? c.text : "")).join("") ?? "";
		return text;
	}
}

