import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  DATABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  REDIS_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  FACTORY_MASTER_KEY: z.preprocess(emptyToUndefined, z.string().min(32).optional()),
  MAX_SESSION_MINUTES: z.coerce.number().int().positive().default(30),
  MAX_SESSIONS_PER_PROJECT: z.coerce.number().int().positive().default(1),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://127.0.0.1:3000"),
  TELEMETRY_ENABLED: booleanFromString,
});

export type AppConfig = z.infer<typeof envSchema>;

export class ConfigError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid environment configuration: ${issues.join("; ")}`);
    this.name = "ConfigError";
  }
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "env";
      return `${path}: ${issue.message}`;
    });
    throw new ConfigError(issues);
  }
  return result.data;
}
