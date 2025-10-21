// lib/supabase/client.ts
// Client-seitiger Supabase-Client (SSR-kompatibel)
// Kommentare auf Deutsch wie gewünscht.

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // HINWEIS: URL und ANON KEY kommen aus der .env / Vercel-Umgebung.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
