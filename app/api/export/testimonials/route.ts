// app/api/export/testimonials/route.ts
/**
 * API Route: CSV-Export für Testimonials
 * GET /api/export/testimonials?campaign_id=xxx&status=approved
 *
 * Query-Parameter:
 * - campaign_id (optional): Filter nach Kampagne
 * - status (optional): Filter nach Status (pending, approved, hidden)
 * - date_from (optional): Von-Datum (ISO)
 * - date_to (optional): Bis-Datum (ISO)
 * - format (optional): Datumsformat (iso, de) - Standard: de
 */

import { createCSVResponse, createTimestampedFilename, exportTestimonialsToCSV } from '@/lib/csv'
import type { TestimonialCSVRow } from '@/lib/csv/types'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function GET(request: NextRequest) {
  try {
    // Authentifizierung prüfen
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Nicht authentifiziert' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Query-Parameter extrahieren
    const searchParams = request.nextUrl.searchParams
    const campaignId = searchParams.get('campaign_id')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const dateFormat = (searchParams.get('format') || 'de') as 'iso' | 'de'

    // Query aufbauen
    let query = supabase
      .from('testimonials')
      .select(
        `
        id,
        campaign_id,
        campaigns!inner(name),
        author_name,
        author_email,
        author_company,
        rating,
        title,
        content,
        status,
        created_at,
        approved_at,
        ip_hash
      `,
      )
      .eq('user_id', user.id)

    // Filter anwenden
    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    // Sortierung
    query = query.order('created_at', { ascending: false })

    // Daten abrufen
    const { data: testimonials, error: fetchError } = await query

    if (fetchError) {
      console.error('Testimonials fetch error:', fetchError)
      return new Response(JSON.stringify({ error: 'Fehler beim Laden der Daten' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!testimonials || testimonials.length === 0) {
      return new Response(JSON.stringify({ error: 'Keine Daten gefunden' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Daten für CSV transformieren
    const csvRows: TestimonialCSVRow[] = testimonials.map((t) => {
      // Type-safe: campaigns kann Array oder Objekt sein
      const campaignsData = t.campaigns as unknown
      let campaignName = ''

      if (Array.isArray(campaignsData) && campaignsData.length > 0) {
        campaignName = campaignsData[0]?.name || ''
      } else if (campaignsData && typeof campaignsData === 'object' && 'name' in campaignsData) {
        campaignName = (campaignsData as { name: string }).name || ''
      }

      return {
        id: t.id,
        campaign_id: t.campaign_id,
        campaign_name: campaignName,
        author_name: t.author_name || '',
        author_email: t.author_email || '',
        author_company: t.author_company || '',
        rating: t.rating,
        title: t.title || '',
        content: t.content,
        status: t.status,
        created_at: t.created_at,
        approved_at: t.approved_at,
        ip_hash: t.ip_hash || '',
      }
    })

    // CSV generieren
    const filename = createTimestampedFilename('bewertungen_export')
    const csv = exportTestimonialsToCSV(csvRows, {
      filename,
      dateFormat,
    })

    // CSV-Response zurückgeben
    return createCSVResponse(csv, filename)
  } catch (error) {
    console.error('Export error:', error)
    return new Response(JSON.stringify({ error: 'Interner Serverfehler' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
