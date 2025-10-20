// lib/supabase/client.ts
import { Database } from '@/types/database'
import { createBrowserClient } from '@supabase/ssr'

/**
 * Client-seitiger Supabase Client für Browser/Client Components
 * Verwendet automatisches Cookie-Management via @supabase/ssr
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
