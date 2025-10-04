#!/usr/bin/env tsx
// scripts/health-check.ts
/* eslint-disable no-console */

import chalk from 'chalk'
import { getSystemHealth } from '../lib/health'

async function runHealthCheck() {
  console.log(chalk.blue('🏥 Running system health check...\n'))

  try {
    const health = await getSystemHealth()

    // Overall status
    const statusColor =
      health.status === 'healthy'
        ? chalk.green
        : health.status === 'degraded'
          ? chalk.yellow
          : chalk.red

    console.log(chalk.cyan('📊 System Status:'))
    console.log(`   Status: ${statusColor(health.status.toUpperCase())}`)
    console.log(`   Version: ${chalk.yellow(health.version)}`)
    console.log(`   Environment: ${chalk.yellow(health.environment)}`)
    console.log(`   Response Time: ${chalk.yellow(health.uptime.toFixed(2))}ms`)
    console.log()

    // Individual service checks
    console.log(chalk.cyan('🔍 Service Checks:'))
    health.checks.forEach((check) => {
      const icon = check.status === 'healthy' ? '✅' : check.status === 'degraded' ? '⚠️' : '❌'

      const color =
        check.status === 'healthy'
          ? chalk.green
          : check.status === 'degraded'
            ? chalk.yellow
            : chalk.red

      console.log(`   ${icon} ${check.service}: ${color(check.status)}`)
      if (check.message) {
        console.log(`      ${chalk.gray(check.message)}`)
      }
    })

    console.log()

    if (health.status === 'healthy') {
      console.log(chalk.green('✅ All systems operational!'))
    } else if (health.status === 'degraded') {
      console.log(chalk.yellow('⚠️ System is degraded but operational'))
    } else {
      console.log(chalk.red('❌ System health check failed'))
      process.exit(1)
    }
  } catch (error) {
    console.error(chalk.red('❌ Health check failed:'))
    console.error(error)
    process.exit(1)
  }
}

runHealthCheck()
