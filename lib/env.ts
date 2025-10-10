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

  // AWS SES
  AWS_SES_REGION: z.string().default('eu-central-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SES_FROM_EMAIL: z.string().email().default('no-reply@kundenmagnet-app.de'),
  SES_REPLY_TO_EMAIL: z.string().email().default('support@kundenmagnet-app.de'),
  SES_CONFIGURATION_SET: z.string().optional(),

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

    // In development, provide helpful error messages
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('\n📝 Copy .env.example to .env.local and fill in the required values:')
      // eslint-disable-next-line no-console
      console.log('cp .env.example .env.local')
      // eslint-disable-next-line no-console
      console.log('\nThen edit .env.local with your configuration.')
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
  services: Array<'supabase' | 'ses' | 'stripe' | 'security'>,
): boolean {
  const env = getEnv()

  const checks = {
    supabase: Boolean(
      env.NEXT_PUBLIC_SUPABASE_URL &&
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    ses: Boolean(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.SES_FROM_EMAIL),
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

// ========== НОВЫЕ HELPER FUNCTIONS (добавляем к твоему существующему файлу) ==========

/**
 * Get widget embed URL for a business
 */
export function getWidgetEmbedUrl(businessId: string): string {
  const env = getEnv()
  const baseUrl = env.APP_BASE_URL || env.NEXT_PUBLIC_APP_URL
  return `${baseUrl}/widget/${businessId}`
}

/**
 * Get widget script URL
 */
export function getWidgetScriptUrl(): string {
  const env = getEnv()
  const baseUrl = env.APP_BASE_URL || env.NEXT_PUBLIC_APP_URL
  return `${baseUrl}/widget.js`
}

/**
 * Get QR code API URL for a business
 */
export function getQRCodeUrl(businessId: string, params?: Record<string, string>): string {
  const env = getEnv()
  const baseUrl = env.APP_BASE_URL || env.NEXT_PUBLIC_APP_URL
  const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
  return `${baseUrl}/api/qr/${businessId}${queryString}`
}

/**
 * Get Supabase client configuration
 */
export function getSupabaseConfig() {
  const env = getEnv()
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY || '',
  }
}
