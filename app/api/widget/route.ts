// /app/api/widget/route.ts
// Public API für Widget-Testimonials (CORS enabled)

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const campaign = searchParams.get('campaign')
  const limit = searchParams.get('limit') || '10'
  const sort = searchParams.get('sort') || 'newest'

  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  }

  // Validierung: campaign erforderlich
  if (!campaign) {
    return NextResponse.json(
      { error: 'Parameter "campaign" ist erforderlich' },
      { status: 400, headers },
    )
  }

  // Limit: 1-50, Default 10
  const numLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50)

  // Sort: newest | oldest | highest | lowest
  const validSorts = ['newest', 'oldest', 'highest', 'lowest']
  const validSort = validSorts.includes(sort) ? sort : 'newest'

  try {
    const supabase = await createClient()

    // Kampagne abrufen (RLS-Policies erlauben public read für status='active')
    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, user_id, name, slug')
      .eq('slug', campaign)
      .eq('status', 'active')
      .single()

    if (campaignError || !campaignData) {
      console.error('[Widget API] Campaign lookup error:', campaignError)
      return NextResponse.json(
        { error: 'Kampagne nicht gefunden oder deaktiviert' },
        { status: 404, headers },
      )
    }

    // Testimonials abrufen (nur approved, RLS-Policy erlaubt public read)
    let query = supabase
      .from('testimonials')
      .select('id, rating, name, text, created_at')
      .eq('campaign_id', campaignData.id)
      .eq('status', 'approved')
      .limit(numLimit)

    // Sortierung anwenden
    switch (validSort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'highest':
        query = query
          .order('rating', { ascending: false })
          .order('created_at', { ascending: false })
        break
      case 'lowest':
        query = query.order('rating', { ascending: true }).order('created_at', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data: testimonials, error: testimonialsError } = await query

    if (testimonialsError) {
      console.error('[Widget API] Testimonials Error:', testimonialsError)
      return NextResponse.json(
        { error: 'Fehler beim Laden der Bewertungen' },
        { status: 500, headers },
      )
    }

    // Erfolgreiche Response
    return NextResponse.json(
      {
        campaign: {
          id: campaignData.id,
          name: campaignData.name,
          slug: campaignData.slug,
        },
        testimonials: testimonials || [],
        meta: {
          count: testimonials?.length || 0,
          limit: numLimit,
          sort: validSort,
        },
      },
      { status: 200, headers },
    )
  } catch (error) {
    console.error('[Widget API] Error:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500, headers })
  }
}

// OPTIONS für CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
