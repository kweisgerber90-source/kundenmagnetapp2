/**
 * DEV-only in-memory rate limiter (best-effort on serverless).
 * For production use a shared store (Redis/Upstash/etc.).
 */

type WindowEntry = { count: number; resetAt: number }
type Store = Map<string, WindowEntry>

const stores = new Map<string, Store>()

export interface RateLimitConfig {
  uniqueTokenPerInterval?: number // max requests per window
  interval?: number // window length in ms
  namespace?: string // optional prefix per endpoint
}

type RateLimitSuccess = { success: true }
type RateLimitFailure = {
  success: false
  limit: number
  remaining: number
  reset: number
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {},
): Promise<RateLimitSuccess | RateLimitFailure> {
  const { uniqueTokenPerInterval = 10, interval = 60_000, namespace = 'default' } = config

  const key = `${namespace}:${identifier}`
  const now = Date.now()
  const storeName = `ratelimit:${interval}`
  let store = stores.get(storeName)
  if (!store) {
    store = new Map()
    stores.set(storeName, store)
  }

  // prune expired entries (без for..of → не нужен ES2015 target)
  store.forEach((v, k) => {
    if (v.resetAt <= now) store!.delete(k)
  })

  const token = store.get(key)
  if (!token || token.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + interval })
    return { success: true }
  }

  token.count++
  if (token.count > uniqueTokenPerInterval) {
    return {
      success: false,
      limit: uniqueTokenPerInterval,
      remaining: 0,
      reset: token.resetAt,
    }
  }

  return { success: true }
}

export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number,
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
  }
}
