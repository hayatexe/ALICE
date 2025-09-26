const WORDLISTS = {
    insult: [/\b(stupid|idiot|moron|dumbass)\b/i],
    harassment: [/\b(kill\s+yourself|kys)\b/i],
    hate: [/\b(\w+\s+should\s+die)\b/i],
    violence: [/\b(i'?m\s+going\s+to\s+(kill|hurt))\b/i],
    swearing: [/(fuck|shit|bitch|asshole)/i],
    spam: [/(buy\s+now|free\s+crypto|http:\/\/|https:\/\/)/i],
};
export function evaluateMessageContent(content) {
    const hits = [];
    for (const [cat, patterns] of Object.entries(WORDLISTS)) {
        for (const re of patterns) {
            if (re.test(content)) {
                const severity = cat === "hate" || cat === "violence" ? 0.9 : cat === "harassment" ? 0.8 : cat === "spam" ? 0.6 : cat === "insult" ? 0.5 : 0.4;
                hits.push({ category: cat, severity, reason: `Matched pattern: ${re.source}` });
                break;
            }
        }
    }
    return hits;
}
//# sourceMappingURL=rules.js.map