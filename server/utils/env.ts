import { z } from "zod";

/**
 * Server-side environment variable schema.
 * Validates required variables exist and warns about optional ones.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(8080),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().optional(),
  OPENWEATHER_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  PING_MESSAGE: z.string().default("ping"),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function validateEnv(): Env {
  if (_env) return _env;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      result.error.flatten().fieldErrors,
    );
    throw new Error("Missing required environment variables. See .env.example");
  }

  _env = result.data;

  // Warn about missing optional keys in development
  if (_env.NODE_ENV === "development") {
    if (!_env.JWT_SECRET)
      console.warn("⚠️  JWT_SECRET not set — using insecure default");
    if (!_env.OPENWEATHER_API_KEY)
      console.warn("⚠️  OPENWEATHER_API_KEY not set — weather uses fallback data");
    if (!_env.OPENAI_API_KEY)
      console.warn("⚠️  OPENAI_API_KEY not set — AI features use built-in templates");
  }

  // In production, enforce critical secrets
  if (_env.NODE_ENV === "production" && !_env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in production");
  }

  return _env;
}

export function env(): Env {
  if (!_env) return validateEnv();
  return _env;
}
