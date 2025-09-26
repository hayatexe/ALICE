import process from "node:process";
const levelOrder = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};
const envLevel = process.env.LOG_LEVEL || "info";
function shouldLog(level) {
    return levelOrder[level] >= levelOrder[envLevel];
}
export const logger = {
    debug: (...args) => {
        if (shouldLog("debug"))
            console.debug("[DEBUG]", ...args);
    },
    info: (...args) => {
        if (shouldLog("info"))
            console.info("[INFO]", ...args);
    },
    warn: (...args) => {
        if (shouldLog("warn"))
            console.warn("[WARN]", ...args);
    },
    error: (...args) => {
        if (shouldLog("error"))
            console.error("[ERROR]", ...args);
    },
};
//# sourceMappingURL=logger.js.map