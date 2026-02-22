type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[MIN_LEVEL];
}

function formatMessage(
  level: LogLevel,
  scope: string,
  message: string,
  meta?: Record<string, unknown>,
): string {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] [${scope}] ${message}`;
  if (meta && Object.keys(meta).length > 0) {
    return `${base} ${JSON.stringify(meta)}`;
  }
  return base;
}

export const logger = {
  debug(scope: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("debug")) console.debug(formatMessage("debug", scope, message, meta));
  },
  info(scope: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("info")) console.info(formatMessage("info", scope, message, meta));
  },
  warn(scope: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("warn")) console.warn(formatMessage("warn", scope, message, meta));
  },
  error(scope: string, message: string, err?: unknown, meta?: Record<string, unknown>) {
    if (!shouldLog("error")) return;
    const errMsg =
      err instanceof Error ? err.stack || err.message : err ? String(err) : "";
    console.error(
      formatMessage("error", scope, `${message}${errMsg ? " — " + errMsg : ""}`, meta),
    );
  },
};

/** Backwards-compatible helper */
export function logError(scope: string, err: any) {
  logger.error(scope, "Error occurred", err);
}
