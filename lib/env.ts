// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Node
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  APP_BASE_URL: z.string().url().default('http://localhost:3000'),

  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_DB_URL: z.string().optional(),

  // ============================================================================
  // Brevo Transactional Email (EU-Server: Deutschland/Frankreich)
  // Ersetzt AWS SES
  // ============================================================================
  BREVO_API_KEY: z.string().default(''), // Optional für Development Builds
  BREVO_BASE_URL: z.string().url().default('https://api.brevo.com/v3'),
  BREVO_SENDER: z
    .string()
    .regex(
      /^.+\s*<[^@]+@[^@]+\.[^@]+>$|^[^@]+@[^@]+\.[^@]+$/,
      'BREVO_SENDER muss Format "Name <email@domain.com>" oder "email@domain.com" haben',
    )
    .default('Kundenmagnetapp <no-reply@kundenmagnet-app.de>'),
  BREVO_REPLY_TO: z.string().email().default('support@kundenmagnet-app.de'),
  // Optional shared secret/token used to secure incoming Brevo webhook requests
  BREVO_WEBHOOK_TOKEN: z.string().min(8).optional(),

  // Security
  IP_HASH_PEPPER: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // QR Code defaults
  QR_DEFAULT_COLOR: z.string().default('#000000'),
  QR_DEFAULT_SIZE: z.coerce.number().default(1024),

  // Rate limiting
  RATE_LIMIT_ENABLED: z.coerce.boolean().default(true),
  RATE_LIMIT_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
})

export type Env = z.infer<typeof envSchema>

let env: Env | undefined

export function getEnv(): Env {
  if (env) return env

  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment variables:')
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('\n📝 Copy .env.example to .env.local and fill in the required values:')
      // eslint-disable-next-line no-console
      console.error('cp .env.example .env.local')
      // eslint-disable-next-line no-console
      console.error('\nThen edit .env.local with your configuration.')
    }

    throw new Error('Invalid environment variables')
  }

  env = parsed.data
  return env
}

// Validate required environment variables (for production)
export function validateEnv(): void {
  const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
  const missing: string[] = []

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\nPlease check your .env.local file.`,
    )
  }
}

// Helper to check if all required services are configured
export function checkRequiredEnv(
  services: Array<'supabase' | 'brevo' | 'stripe' | 'security'>,
): boolean {
  const env = getEnv()

  const checks = {
    supabase: Boolean(
      env.NEXT_PUBLIC_SUPABASE_URL &&
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    brevo: Boolean(env.BREVO_API_KEY && env.BREVO_SENDER),
    stripe: Boolean(
      env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    ),
    security: Boolean(env.IP_HASH_PEPPER && env.JWT_SECRET),
  }

  return services.every((service) => checks[service])
}

// Export validated env for use in the app
export const config = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
}
