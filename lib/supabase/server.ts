// lib/supabase/server.ts
import { Database } from '@/types/database'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-seitiger Supabase Client für Server Components, Route Handlers & Middleware
 * Verwaltet Cookies automatisch für Auth-Session
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Cookie-Fehler in Server Components ignorieren (z.B. während Prerendering)
            // Wird in Route Handlers korrekt funktionieren
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Cookie-Fehler ignorieren
          }
        },
      },
    },
  )
}

/**
 * Holt die aktuelle Benutzersession (Server-seitig)
 */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Holt die aktuelle Session (Server-seitig)
 */
export async function getSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
