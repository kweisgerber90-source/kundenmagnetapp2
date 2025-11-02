// app/q/[publicId]/route.ts
// -----------------------------------------------------------------------------
// Kurzlink-Handler für QR-Codes (robust gegen Array/Objekt-Form von "campaigns"):
// - Holt Datensatz aus 'qr_codes' inkl. campaigns.slug
// - Loggt anonyme Scans (ip_hash, user_agent) — Fehler blockieren keinen Redirect
// - Redirectet nach /r/<slug>?utm_*
// - Debug-Modus: ?debug=1 gibt Klartext-Fehler zurück
// -----------------------------------------------------------------------------

import { hashIP } from '@/lib/security-utils'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1']

// --- ⚙️ Typen ----------------------------------------------------------------

type Campaign = { slug: string }

type QrCodeWithCampaign =
  | {
      id: string
      public_id: string
      campaigns: Campaign | null
    }
  | {
      id: string
      public_id: string
      campaigns: Campaign[] | null
    }

// Liefert die vermutete Client-IP aus Proxy-Headern
function getClientIP(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff && xff.length > 0) return xff.split(',')[0].trim()
  return headers.get('x-real-ip') || headers.get('cf-connecting-ip') || ''
}

// Extrahiert den Slug aus campaigns (egal ob Objekt oder Array)
function extractSlug(row: QrCodeWithCampaign): string | undefined {
  const c = row.campaigns
  if (!c) return undefined
  if (Array.isArray(c)) {
    const first = c[0]
    return first && typeof first.slug === 'string' && first.slug.length > 0 ? first.slug : undefined
  }
  return typeof c.slug === 'string' && c.slug.length > 0 ? c.slug : undefined
}

export async function GET(req: NextRequest, { params }: { params: { publicId: string } }) {
  const debug = req.nextUrl.searchParams.get('debug') === '1'

  // 1) ENV prüfen
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    const msg = `ENV fehlt: NEXT_PUBLIC_SUPABASE_URL=${!!SUPABASE_URL} NEXT_PUBLIC_SUPABASE_ANON_KEY=${!!SUPABASE_ANON}`
    if (debug) return NextResponse.json({ error: 'config', reason: msg }, { status: 500 })
    return NextResponse.redirect(new URL(`/app/qr?err=config`, req.url), { status: 302 })
  }

  try {
    // 2) Supabase-Client (anon)
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

    // 3) QR-Datensatz inkl. campaigns.slug holen
    //    Hinweis: Supabase kann relationale Felder als Array zurückgeben.
    const { data, error: qrErr } = await supabase
      .from('qr_codes')
      .select('id, public_id, campaigns ( slug )')
      .eq('public_id', params.publicId)
      .maybeSingle()

    if (qrErr || !data) {
      const reason = qrErr?.message || 'not_found'
      if (debug) return NextResponse.json({ error: 'lookup', reason }, { status: 404 })
      return NextResponse.redirect(new URL(`/app/qr?err=not_found`, req.url), { status: 302 })
    }

    const qr = data as unknown as QrCodeWithCampaign

    // 4) Slug sicher extrahieren (Objekt ODER Array)
    const slug = extractSlug(qr)
    if (!slug) {
      if (debug)
        return NextResponse.json({ error: 'data', reason: 'missing slug' }, { status: 500 })
      return NextResponse.redirect(new URL(`/app/qr?err=missing_slug`, req.url), { status: 302 })
    }

    // 5) Anonymen Scan loggen (Fehler ignorieren)
    try {
      const ip = getClientIP(req.headers)
      const ipHash = await hashIP(ip)
      const ua = req.headers.get('user-agent') ?? ''

      await supabase.from('qr_scans').insert({
        qr_code_id: (qr as { id: string }).id,
        ip_hash: ipHash,
        user_agent: ua,
      })
    } catch {
      // Logging-Fehler sind kein Blocker für Redirect
    }

    // 6) Ziel-URL bauen
    const origin = req.nextUrl.origin
    const target = new URL(`/r/${encodeURIComponent(slug)}`, origin)
    target.searchParams.set('utm_source', 'qr')
    target.searchParams.set('utm_medium', 'offline')
    target.searchParams.set('qr', params.publicId)

    // 7) Redirect
    return NextResponse.redirect(target, { status: 302 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (debug) return NextResponse.json({ error: 'exception', reason: msg }, { status: 500 })
    return NextResponse.redirect(new URL(`/app/qr?err=exception`, req.url), { status: 302 })
  }
}
