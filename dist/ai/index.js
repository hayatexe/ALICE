export class AiRegistry {
    providers = new Map();
    register(provider) {
        this.providers.set(provider.name, provider);
    }
    get(name) {
        return this.providers.get(name);
    }
    list() {
        return Array.from(this.providers.keys());
    }
}
//# sourceMappingURL=index.js.map