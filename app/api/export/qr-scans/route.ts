// app/api/export/qr-scans/route.ts
/**
 * API Route: CSV-Export für QR-Code-Scans
 * GET /api/export/qr-scans?qr_code_id=xxx&campaign_id=xxx
 *
 * Query-Parameter:
 * - qr_code_id (optional): Filter nach QR-Code
 * - campaign_id (optional): Filter nach Kampagne
 * - date_from (optional): Von-Datum (ISO)
 * - date_to (optional): Bis-Datum (ISO)
 * - format (optional): Datumsformat (iso, de) - Standard: de
 */

import { createCSVResponse, createTimestampedFilename, exportQRScansToCSV } from '@/lib/csv'
import type { QRScanCSVRow } from '@/lib/csv/types'
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
    const qrCodeId = searchParams.get('qr_code_id')
    const campaignId = searchParams.get('campaign_id')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const dateFormat = (searchParams.get('format') || 'de') as 'iso' | 'de'

    // Query aufbauen
    let query = supabase.from('qr_scans').select(`
        id,
        qr_code_id,
        qr_codes!inner(
          label,
          campaign_id,
          campaigns(name)
        ),
        scanned_at,
        user_agent,
        referrer,
        country,
        city
      `)

    // Filter: Nur QR-Codes des Benutzers
    query = query.eq('qr_codes.user_id', user.id)

    // Weitere Filter anwenden
    if (qrCodeId) {
      query = query.eq('qr_code_id', qrCodeId)
    }
    if (campaignId) {
      query = query.eq('qr_codes.campaign_id', campaignId)
    }
    if (dateFrom) {
      query = query.gte('scanned_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('scanned_at', dateTo)
    }

    // Sortierung
    query = query.order('scanned_at', { ascending: false })

    // Daten abrufen
    const { data: scans, error: fetchError } = await query

    if (fetchError) {
      console.error('QR scans fetch error:', fetchError)
      return new Response(JSON.stringify({ error: 'Fehler beim Laden der Daten' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!scans || scans.length === 0) {
      return new Response(JSON.stringify({ error: 'Keine Daten gefunden' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Daten für CSV transformieren
    const csvRows: QRScanCSVRow[] = scans.map((scan) => {
      // Type-safe: nested relations können Arrays oder Objekte sein
      const qrCodesData = scan.qr_codes as unknown
      let qrCodeLabel = ''
      let campaignId = ''
      let campaignName = ''

      if (Array.isArray(qrCodesData) && qrCodesData.length > 0) {
        const qrCode = qrCodesData[0]
        qrCodeLabel = qrCode?.label || ''
        campaignId = qrCode?.campaign_id || ''

        const campaignsData = qrCode?.campaigns
        if (Array.isArray(campaignsData) && campaignsData.length > 0) {
          campaignName = campaignsData[0]?.name || ''
        } else if (campaignsData && typeof campaignsData === 'object' && 'name' in campaignsData) {
          campaignName = (campaignsData as { name: string }).name || ''
        }
      } else if (qrCodesData && typeof qrCodesData === 'object') {
        const qrCode = qrCodesData as { label?: string; campaign_id?: string; campaigns?: unknown }
        qrCodeLabel = qrCode.label || ''
        campaignId = qrCode.campaign_id || ''

        const campaignsData = qrCode.campaigns
        if (Array.isArray(campaignsData) && campaignsData.length > 0) {
          campaignName = campaignsData[0]?.name || ''
        } else if (campaignsData && typeof campaignsData === 'object' && 'name' in campaignsData) {
          campaignName = (campaignsData as { name: string }).name || ''
        }
      }

      return {
        id: scan.id,
        qr_code_id: scan.qr_code_id,
        qr_code_label: qrCodeLabel,
        campaign_id: campaignId,
        campaign_name: campaignName,
        scanned_at: scan.scanned_at,
        user_agent: scan.user_agent || '',
        referrer: scan.referrer || null,
        country: scan.country || null,
        city: scan.city || null,
      }
    })

    // CSV generieren
    const filename = createTimestampedFilename('qr_scans_export')
    const csv = exportQRScansToCSV(csvRows, {
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
