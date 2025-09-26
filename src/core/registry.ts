import { AiRegistry } from "../ai/index.js";
import { OpenAiProvider } from "../ai/providers/openai.js";
import { AnthropicProvider } from "../ai/providers/anthropic.js";
import { MockProvider } from "../ai/providers/mock.js";

export const aiRegistry = new AiRegistry();

// Register available providers at startup
aiRegistry.register(new OpenAiProvider());
aiRegistry.register(new AnthropicProvider());
aiRegistry.register(new MockProvider());

