#!/usr/bin/env tsx
/* eslint-disable no-console */

import chalk from 'chalk'
import { config as dotenv } from 'dotenv'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { sendSimpleEmail } from '../lib/email/brevo'
import { getEnv } from '../lib/env'

// Load .env.local if present
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  dotenv({ path: envPath })
}

async function main() {
  const to = process.argv[2] || process.env.TEST_EMAIL_TO
  if (!to) {
    console.error('Usage: pnpm tsx scripts/test-email.ts <recipient@example.com>')
    process.exit(1)
  }

  // Ensure env parses fine (throws if invalid)
  const env = getEnv()
  console.log(chalk.blue(`Sending test email via Brevo as ${env.BREVO_SENDER} ...`))

  try {
    const res = await sendSimpleEmail({
      to,
      subject: 'Kundenmagnetapp Test Email',
      text: 'Hello from Kundenmagnetapp test script',
      html: '<p>Hello from <b>Kundenmagnetapp</b> test script</p>',
      tags: ['test', 'cli'],
    })

    console.log(chalk.green(`✅ Sent. MessageId: ${res.messageId ?? 'unknown'}`))
  } catch (err) {
    console.error(chalk.red('❌ Failed to send email'))
    if (err instanceof Error) console.error(chalk.red(err.message))
    else console.error(err)
    process.exit(1)
  }
}

void main()
