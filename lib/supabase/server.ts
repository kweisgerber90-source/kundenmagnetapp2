// lib/supabase/server.ts
// -----------------------------------------------------------------------------
// 🧩 Server-seitiger Supabase-Client
// - Verwaltet Auth-Cookies automatisch (Lesen, Setzen, Entfernen)
// - Stellt Hilfsfunktionen für getUser() und getSession() bereit
// - Setzt im Production-Modus das Cookie-Domain-Feld auf ".kundenmagnet-app.de"
// -----------------------------------------------------------------------------

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Gibt die Cookie-Domain zurück.
 * - Lokal: undefined
 * - Produktion: ".kundenmagnet-app.de" (aus APP_BASE_URL oder NEXT_PUBLIC_APP_URL)
 */
function getCookieDomain(): string | undefined {
  try {
    const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || ''
    const host = new URL(baseUrl).hostname // z. B. "www.kundenmagnet-app.de"
    const parts = host.split('.')
    if (parts.length >= 2) {
      return `.${parts.slice(-2).join('.')}` // → ".kundenmagnet-app.de"
    }
  } catch {
    // Kein valider URL → ignorieren
  }
  return undefined
}

/**
 * Erstellt den serverseitigen Supabase-Client
 * mit Cookie-Unterstützung (SSR-kompatibel)
 */
export function createClient() {
  const cookieStore = cookies()
  const cookieDomain = process.env.NODE_ENV === 'production' ? getCookieDomain() : undefined

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Liest ein Cookie (nur den Wert)
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Setzt oder aktualisiert ein Cookie (z. B. in Route Handlers)
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              domain: cookieDomain,
            })
          } catch {
            // Ignorieren, falls im RSC-Kontext (read-only)
          }
        },
        // Entfernt ein Cookie (setzt leeren Wert + maxAge = 0)
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              domain: cookieDomain,
              maxAge: 0,
            })
          } catch {
            // Ignorieren, falls im RSC-Kontext
          }
        },
      },
    },
  )
}

/**
 * Gibt den aktuell eingeloggten Benutzer zurück (oder null)
 */
export async function getUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Gibt die aktuelle Session zurück (oder null)
 */
export async function getSession() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
