import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 4000;

function parsePort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid PORT value "${value}". It must be a positive integer.`
    );
  }

  return parsed;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parsePort(process.env.PORT),
  DATABASE_URL: requireEnv('DATABASE_URL'),
} as const;
