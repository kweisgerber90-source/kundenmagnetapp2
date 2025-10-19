#!/usr/bin/env tsx
// scripts/check-env.ts
/* eslint-disable no-console */

import chalk from 'chalk'
import { config as dotenv } from 'dotenv'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { checkRequiredEnv, getEnv } from '../lib/env'

// Load .env.local if it exists
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  dotenv({ path: envPath })
}

console.log(chalk.blue('🔍 Checking environment variables...\n'))

try {
  const env = getEnv()

  // Basic environment info
  console.log(chalk.cyan('📋 Environment:'))
  console.log(`   NODE_ENV: ${chalk.yellow(env.NODE_ENV)}`)
  console.log(`   APP_URL: ${chalk.yellow(env.NEXT_PUBLIC_APP_URL)}`)
  console.log()

  // Service checks
  const services = [
    {
      name: 'Supabase',
      key: 'supabase' as const,
      required: [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
      ],
    },
    {
      name: 'Brevo Email',
      key: 'brevo' as const,
      required: ['BREVO_API_KEY', 'BREVO_SENDER'],
    },
    {
      name: 'Stripe',
      key: 'stripe' as const,
      required: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
    },
    {
      name: 'Security',
      key: 'security' as const,
      required: ['IP_HASH_PEPPER', 'JWT_SECRET'],
    },
  ]

  console.log(chalk.cyan('🔧 Service Configuration:'))
  services.forEach((service) => {
    const isConfigured = checkRequiredEnv([service.key])
    const icon = isConfigured ? '✅' : '⚠️'
    const color = isConfigured ? chalk.green : chalk.yellow
    console.log(
      `   ${icon} ${service.name}: ${color(isConfigured ? 'Configured' : 'Not configured')}`,
    )

    if (!isConfigured && env.NODE_ENV === 'production') {
      console.log(chalk.red(`      Required: ${service.required.join(', ')}`))
    }
  })

  console.log()

  // Warnings for production
  if (env.NODE_ENV === 'production') {
    console.log(chalk.cyan('⚠️  Production Checks:'))

    const warnings = []
    if (!env.NEXT_PUBLIC_APP_URL.includes('kundenmagnet-app.de')) {
      warnings.push('APP_URL should be set to production domain')
    }
    if (!checkRequiredEnv(['supabase', 'brevo', 'stripe', 'security'])) {
      warnings.push('Not all services are configured')
    }

    if (warnings.length > 0) {
      warnings.forEach((w) => console.log(chalk.yellow(`   - ${w}`)))
    } else {
      console.log(chalk.green('   ✅ All production checks passed'))
    }
  }

  console.log()
  console.log(chalk.green('✅ Environment variables are valid!'))

  // Development tips
  if (env.NODE_ENV === 'development') {
    console.log()
    console.log(chalk.blue('💡 Development Tips:'))
    console.log('   - Services will be configured in upcoming steps')
    console.log('   - Step 2: Database, Auth, Email')
    console.log('   - Step 4: Payment processing')
    console.log('   - For now, the app will run with limited functionality')
  }
} catch (error) {
  console.error(chalk.red('❌ Environment validation failed!'))
  if (error instanceof Error) {
    console.error(chalk.red(error.message))
  }
  process.exit(1)
}
