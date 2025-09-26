export type ModerationCategory = "insult" | "harassment" | "hate" | "violence" | "swearing" | "spam";
export type RuleHit = {
    category: ModerationCategory;
    severity: number;
    reason: string;
};
export declare function evaluateMessageContent(content: string): RuleHit[];
//# sourceMappingURL=rules.d.ts.map