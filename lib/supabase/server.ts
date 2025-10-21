// lib/supabase/server.ts
// Server-seitiger Supabase-Client + kleine Helfer.
// Setzt und liest Auth-Cookies automatisch.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Holt ein Cookie (nur Wert)
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Setzt/aktualisiert ein Cookie (Route Handler / Server Actions)
        set(name: string, value: string, options: CookieOptions) {
          // In Server Components ist "set" ggf. read-only — in Route Handlers ok.
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Ignorieren, falls im Kontext nicht erlaubt (z. B. RSC)
          }
        },
        // Entfernt ein Cookie (setzt leeren Wert)
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Ignorieren, falls im Kontext nicht erlaubt
          }
        },
      },
    },
  )
}

// Gibt den aktuellen Benutzer zurück (oder null)
export async function getUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Gibt die aktuelle Session zurück (oder null)
export async function getSession() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
