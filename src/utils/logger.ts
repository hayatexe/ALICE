import process from "node:process";

type LogLevel = "debug" | "info" | "warn" | "error";

const levelOrder: Record<LogLevel, number> = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
};

const envLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
	return levelOrder[level] >= levelOrder[envLevel];
}

export const logger = {
	debug: (...args: unknown[]): void => {
		if (shouldLog("debug")) console.debug("[DEBUG]", ...args);
	},
	info: (...args: unknown[]): void => {
		if (shouldLog("info")) console.info("[INFO]", ...args);
	},
	warn: (...args: unknown[]): void => {
		if (shouldLog("warn")) console.warn("[WARN]", ...args);
	},
	error: (...args: unknown[]): void => {
		if (shouldLog("error")) console.error("[ERROR]", ...args);
	},
};

