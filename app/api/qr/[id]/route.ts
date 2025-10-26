// app/api/qr/[id]/route.ts
// 📡 API: QR-Code Details (GET) und Löschen (DELETE)
// 🔐 DSGVO: Nur eigene QR-Codes abrufbar

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const preferredRegion = ['fra1']
export const runtime = 'nodejs'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
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

    if (error || !data) {
      return NextResponse.json({ error: 'QR-Code nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('[qr-details] Unerwarteter Fehler:', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Hole QR-Code, um Dateien zu löschen
    const { data: qrCode } = await supabase
      .from('qr_codes')
      .select('file_url_svg, file_url_png, file_url_pdf, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!qrCode) {
      return NextResponse.json({ error: 'QR-Code nicht gefunden' }, { status: 404 })
    }

    // Lösche Dateien aus Storage
    const filesToDelete = [qrCode.file_url_svg, qrCode.file_url_png, qrCode.file_url_pdf].filter(
      Boolean,
    ) as string[]

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage.from('qr-codes').remove(filesToDelete)

      if (storageError) {
        console.error('[qr-delete] Fehler beim Löschen von Dateien:', storageError)
      }
    }

    // Lösche DB-Eintrag (Cascade löscht auch Scans)
    const { error } = await supabase.from('qr_codes').delete().eq('id', id).eq('user_id', user.id)

    if (error) {
      console.error('[qr-delete] DB-Fehler:', error)
      return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'QR-Code gelöscht' }, { status: 200 })
  } catch (err) {
    console.error('[qr-delete] Unerwarteter Fehler:', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
