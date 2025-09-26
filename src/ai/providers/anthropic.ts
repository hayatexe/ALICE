import Anthropic from "@anthropic-ai/sdk";
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
		const body: Parameters<Anthropic["messages"]["create"]>[0] = {
			model,
			max_tokens: options?.maxTokens ?? 512,
			temperature: options?.temperature ?? 0.7,
			stream: false,
			messages: nonSystem.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
		};
		if (systemParts.length > 0) {
			(body as any).system = systemParts;
		}
		const result = await this.client.messages.create(body);
		const text = Array.isArray((result as any).content)
			? ((result as any).content as any[]).map((c) => (c.type === "text" ? c.text : "")).join("")
			: "";
		return text;
	}
}

