import { z } from "zod";

/**
 * Environment Variable Schema
 * This is the single source of truth for all environment variables.
 * If a required variable is missing, the app will fail-fast with a clear error.
 */
const envSchema = z.object({
  // Backend API Configuration
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("https://connect-full-backend-production.onrender.com/api/v1"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("SIMAME Owner"),
  
  // Sentry Configuration (Optional/Placeholder for now)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  
  // Environment context
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

// 1. Validate the environment
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(_env.error.format(), null, 2)
  );
  // In production, we throw to explicitly fail the build or start
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables");
  }
}

export const env = _env.success ? _env.data : {};
