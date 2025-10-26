// lib/qr/actions.ts
// ⚙️ Server Actions für QR-Code-Operationen
// 🔐 DSGVO: Nutzer können nur eigene QR-Codes verwalten

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { QRCode, QRStats } from './types'

/**
 * Holt alle QR-Codes des aktuellen Nutzers
 */
export async function getUserQRCodes(): Promise<{
  data: QRCode[] | null
  error: string | null
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Nicht authentifiziert' }
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .select(
      `
      *,
      campaigns:campaign_id (
        name,
        slug
      )
    `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[qr-actions] Fehler beim Abrufen der QR-Codes:', error)
    return { data: null, error: 'Fehler beim Laden der QR-Codes' }
  }

  return { data: data as QRCode[], error: null }
}

/**
 * Holt einen einzelnen QR-Code
 */
export async function getQRCode(id: string): Promise<{
  data: QRCode | null
  error: string | null
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Nicht authentifiziert' }
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .select(
      `
      *,
      campaigns:campaign_id (
        name,
        slug
      )
    `,
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('[qr-actions] Fehler beim Abrufen des QR-Codes:', error)
    return { data: null, error: 'QR-Code nicht gefunden' }
  }

  return { data: data as QRCode, error: null }
}

/**
 * Löscht einen QR-Code (inkl. Dateien)
 */
export async function deleteQRCode(id: string): Promise<{
  success: boolean
  error: string | null
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Nicht authentifiziert' }
  }

  // 1. Hole QR-Code, um Dateien zu löschen
  const { data: qrCode } = await supabase
    .from('qr_codes')
    .select('file_url_svg, file_url_png, file_url_pdf, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!qrCode) {
    return { success: false, error: 'QR-Code nicht gefunden' }
  }

  // 2. Lösche Dateien aus Storage
  const filesToDelete = [qrCode.file_url_svg, qrCode.file_url_png, qrCode.file_url_pdf].filter(
    Boolean,
  ) as string[]

  if (filesToDelete.length > 0) {
    const { error: storageError } = await supabase.storage.from('qr-codes').remove(filesToDelete)

    if (storageError) {
      console.error('[qr-actions] Fehler beim Löschen von Dateien:', storageError)
    }
  }

  // 3. Lösche DB-Eintrag (Cascade löscht auch Scans)
  const { error } = await supabase.from('qr_codes').delete().eq('id', id).eq('user_id', user.id)

  if (error) {
    console.error('[qr-actions] Fehler beim Löschen des QR-Codes:', error)
    return { success: false, error: 'Fehler beim Löschen' }
  }

  revalidatePath('/app/qr')
  return { success: true, error: null }
}

/**
 * Holt Statistiken für einen QR-Code
 */
export async function getQRCodeStats(qrId: string): Promise<{
  data: QRStats | null
  error: string | null
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Nicht authentifiziert' }
  }

  // Verifiziere Besitz
  const { data: qrCode } = await supabase
    .from('qr_codes')
    .select('id')
    .eq('id', qrId)
    .eq('user_id', user.id)
    .single()

  if (!qrCode) {
    return { data: null, error: 'QR-Code nicht gefunden' }
  }

  // Hole Scans
  const { data: scans, error } = await supabase
    .from('qr_scans')
    .select('*')
    .eq('qr_id', qrId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[qr-actions] Fehler beim Abrufen der Scans:', error)
    return { data: null, error: 'Fehler beim Laden der Statistiken' }
  }

  // Berechne Statistiken
  const now = new Date()
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const scansLast7Days = scans.filter((scan) => new Date(scan.created_at) >= last7Days).length

  const scansLast30Days = scans.filter((scan) => new Date(scan.created_at) >= last30Days).length

  // Scans nach Tag gruppieren (letzte 30 Tage)
  const scansByDay = new Map<string, number>()
  scans.forEach((scan) => {
    const date = new Date(scan.created_at).toISOString().split('T')[0]
    if (new Date(date) >= last30Days) {
      scansByDay.set(date, (scansByDay.get(date) || 0) + 1)
    }
  })

  // Top Referrer
  const referrerMap = new Map<string, number>()
  scans.forEach((scan) => {
    if (scan.referer) {
      referrerMap.set(scan.referer, (referrerMap.get(scan.referer) || 0) + 1)
    }
  })

  const stats: QRStats = {
    total_scans: scans.length,
    scans_last_7_days: scansLast7Days,
    scans_last_30_days: scansLast30Days,
    scans_by_day: Array.from(scansByDay.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    top_referrers: Array.from(referrerMap.entries())
      .map(([referer, count]) => ({ referer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  }

  return { data: stats, error: null }
}
