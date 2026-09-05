import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('https://connect-full-backend-production.onrender.com/api/v1'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://simame.tech'),
  NEXT_PUBLIC_DISABLE_INDEXING: z.enum(['true', 'false']).default('false'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_DISABLE_INDEXING: process.env.NEXT_PUBLIC_DISABLE_INDEXING,
  NODE_ENV: process.env.NODE_ENV,
})

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
