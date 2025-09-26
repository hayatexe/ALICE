import { OpenAI } from "openai";
import { type AiProvider, type ChatMessage } from "../index.js";

export class OpenAiProvider implements AiProvider {
	public readonly name = "openai";
	private client: OpenAI;

	constructor(apiKey?: string) {
		this.client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
	}

	async complete(messages: ChatMessage[], options?: { model?: string; temperature?: number; maxTokens?: number }): Promise<string> {
		const model = options?.model || process.env.OPENAI_MODEL || "gpt-4o-mini";
		const response = await this.client.chat.completions.create({
			model,
			messages: messages.map((m) => ({ role: m.role, content: m.content })),
			temperature: options?.temperature ?? 0.7,
			max_tokens: options?.maxTokens,
		});
		return response.choices[0]?.message?.content ?? "";
	}
}

