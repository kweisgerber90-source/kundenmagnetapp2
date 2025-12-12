// /lib/supabase/admin.ts
/**
 * 🔐 Supabase Admin Client (Service-Role)
 * NUR für serverseitige Operationen (API Routes, Webhooks)
 * NIEMALS im Client-Code verwenden!
 */

import type { Database } from '@/types/database'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL ist nicht konfiguriert')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY ist nicht konfiguriert')
}

/**
 * Admin-Client mit Service-Role-Key erstellen
 * Hat vollständige Zugriffsrechte, umgeht RLS
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  )
}

/**
 * Alias für bessere Lesbarkeit
 */
export const createClient = createAdminClient
export const createServiceClient = createAdminClient
