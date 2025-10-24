// /app/api/widget/route.ts
// 🔒 Sichere Widget-API mit CORS-Allowlist, Node-Runtime und E-Mail-Maskierung
// Basierend auf ChatGPT Security Review

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// =============================================================================
// RUNTIME & REGION
// =============================================================================
// ⚠️ KRITISCH: Node-Runtime verwenden, nicht Edge!
// Service-Role Key darf niemals an Edge-Runtime geleakt werden
export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

// =============================================================================
// CORS-ALLOWLIST (keine Origin-Reflexion!)
// =============================================================================
const DEFAULT_ALLOWED_ORIGINS = [
  'https://kundenmagnet-app.de',
  'https://www.kundenmagnet-app.de',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]

function getAllowedOrigins(): string[] {
  const fromEnv =
    process.env.WIDGET_CORS_ALLOW_ORIGINS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) || []

  return Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...fromEnv]))
}

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false

  const allowed = getAllowedOrigins()
  try {
    const originUrl = new URL(origin)
    return allowed.some((allowedOrigin) => {
      const allowedUrl = new URL(allowedOrigin)
      return allowedUrl.origin === originUrl.origin
    })
  } catch {
    return false
  }
}

function buildCorsHeaders(origin: string | null) {
  const varyHeader = { Vary: 'Origin' }

  if (isAllowedOrigin(origin)) {
    return {
      ...varyHeader,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  }

  // Für Same-Site Requests ohne Origin-Header keine CORS-Header nötig
  return varyHeader
}

// =============================================================================
// QUERY-PARAMETER VALIDATION
// =============================================================================
const widgetQuerySchema = z.object({
  campaign: z.string().min(1, 'Kampagnen-Slug erforderlich'),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
  sort: z.enum(['newest', 'oldest', 'rating']).optional().default('newest'),
})

// =============================================================================
// OPTIONS HANDLER (CORS Preflight)
// =============================================================================
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  const corsHeaders = buildCorsHeaders(origin)

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// =============================================================================
// GET HANDLER (Widget-Daten)
// =============================================================================
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')
  const corsHeaders = buildCorsHeaders(origin)

  // 1) Origin-Check: Wenn Origin vorhanden ist, muss er erlaubt sein
  if (origin && !isAllowedOrigin(origin)) {
    return NextResponse.json(
      { error: 'Origin not allowed' },
      {
        status: 403,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }

  try {
    // 2) Query-Parameter validieren
    const searchParams = request.nextUrl.searchParams
    const parsed = widgetQuerySchema.safeParse({
      campaign: searchParams.get('campaign'),
      limit: searchParams.get('limit'),
      sort: searchParams.get('sort'),
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid parameters',
          details: parsed.error.flatten(),
        },
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const { campaign, limit, sort } = parsed.data

    // 3) Supabase-Client mit Service-Role (Server-only!)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      console.error('[widget-api] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json(
        { error: 'Service misconfigured' },
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    // 4) Kampagne prüfen (via View - sicherer)
    const { data: campaignData, error: campaignError } = await supabase
      .from('public_campaigns')
      .select('id, name, status')
      .eq('slug', campaign)
      .single()

    if (campaignError || !campaignData) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        },
      )
    }

    if (campaignData.status !== 'active') {
      return NextResponse.json(
        {
          error: 'Campaign is not active',
          campaign: {
            name: campaignData.name,
            status: campaignData.status,
          },
        },
        {
          status: 403,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // 5) Testimonials laden (mit Service-Role, daher direkte Tabelle)
    //    ⚠️ WICHTIG: E-Mail-Maskierung beim Output!
    let query = supabase
      .from('testimonials')
      .select('id, name, email, text, rating, created_at')
      .eq('campaign_id', campaignData.id)
      .eq('status', 'approved')
      .is('deleted_at', null)
      .limit(limit)

    // Sortierung
    switch (sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'rating':
        query = query
          .order('rating', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
        break
      default: // newest
        query = query.order('created_at', { ascending: false })
    }

    const { data: testimonials, error: testimonialsError } = await query

    if (testimonialsError) {
      console.error('[widget-api] Database error:', testimonialsError)
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // 6) E-Mail-Maskierung (PII-Minimierung)
    const sanitized = (testimonials || []).map((t) => ({
      id: t.id,
      name: t.name,
      // 🔒 KRITISCH: E-Mail nie vollständig herausgeben
      // Beispiel: test@example.com → te***@example.com
      email: t.email ? t.email.replace(/^(.{2}).*(@.*)$/, '$1***$2') : null,
      text: t.text,
      rating: t.rating,
      created_at: t.created_at,
    }))

    // 7) Response mit Cache-Headers
    return NextResponse.json(
      {
        campaign: {
          id: campaignData.id,
          name: campaignData.name,
        },
        testimonials: sanitized,
        meta: {
          count: sanitized.length,
          limit,
          sort,
        },
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          // Edge/Proxy-Caching (stale-while-revalidate)
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    )
  } catch (error) {
    console.error('[widget-api] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
