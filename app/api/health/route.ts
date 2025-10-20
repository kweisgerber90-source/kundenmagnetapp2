// app/api/health/route.ts
import { getSystemHealth } from '@/lib/health'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function GET() {
  try {
    const health = await getSystemHealth()

    const status = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503

    return NextResponse.json(health, { status })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
