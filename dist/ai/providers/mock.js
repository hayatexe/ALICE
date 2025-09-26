import {} from "../index.js";
export class MockProvider {
    name = "mock";
    async complete(messages, options) {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        return `Echo (${options?.model ?? "mock-model"}): ${lastUser?.content ?? ""}`;
    }
}
//# sourceMappingURL=mock.js.map