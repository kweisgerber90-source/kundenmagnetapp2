#!/usr/bin/env tsx
// scripts/clean.ts
/* eslint-disable no-console */

import chalk from 'chalk'
import { rm } from 'fs/promises'
import { resolve } from 'path'

async function clean() {
  console.log(chalk.blue('🧹 Cleaning project...\n'))

  const dirsToClean = ['.next', 'node_modules/.cache', 'coverage', 'dist', '.turbo']

  const filesToClean = ['tsconfig.tsbuildinfo']

  // Clean directories
  for (const dir of dirsToClean) {
    try {
      await rm(resolve(process.cwd(), dir), { recursive: true, force: true })
      console.log(chalk.green(`   ✅ Cleaned ${dir}`))
    } catch (error) {
      console.log(chalk.gray(`   ⏭️  Skipped ${dir} (not found)`))
    }
  }

  // Clean files
  for (const file of filesToClean) {
    try {
      await rm(resolve(process.cwd(), file), { force: true })
      console.log(chalk.green(`   ✅ Cleaned ${file}`))
    } catch (error) {
      console.log(chalk.gray(`   ⏭️  Skipped ${file} (not found)`))
    }
  }

  console.log()
  console.log(chalk.green('✅ Project cleaned!'))
  console.log(chalk.blue('💡 Run "pnpm install" to reinstall dependencies'))
}

clean().catch((error) => {
  console.error(chalk.red('❌ Clean failed:'))
  console.error(error)
  process.exit(1)
})
