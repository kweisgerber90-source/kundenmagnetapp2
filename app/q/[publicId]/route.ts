// app/q/[publicId]/route.ts
import { hashIP } from '@/lib/security-utils' // extractIP больше не нужен
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

function getClientIP(headers: Headers): string {
  // берём первый из возможных прокси-заголовков
  const xff = headers.get('x-forwarded-for')
  if (xff && xff.length > 0) return xff.split(',')[0].trim()
  return (
    headers.get('x-real-ip') || headers.get('cf-connecting-ip') || '' // пустая строка допустима для hashIP (он всё равно вернёт хэш)
  )
}

export async function GET(req: NextRequest, { params }: { params: { publicId: string } }) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data: qr, error } = await supabase
      .from('qr_codes')
      .select('id, public_id, campaigns ( slug )')
      .eq('public_id', params.publicId)
      .single()

    if (error || !qr) {
      return NextResponse.redirect(new URL('/app/qr', req.url), { status: 302 })
    }

    // 🔒 анонимный лог скана
    try {
      const ip = getClientIP(req.headers) // ✅ строка, а не Headers
      const ipHash = await hashIP(ip)
      await supabase.from('qr_scans').insert({
        qr_code_id: qr.id,
        ip_hash: ipHash,
        user_agent: req.headers.get('user-agent') || '',
      })
    } catch {
      // логирование не должно ломать редирект
    }

    const slug = (qr as unknown as { campaigns: { slug: string } }).campaigns.slug

    const origin = req.nextUrl.origin
    const target = new URL(`/r/${slug}`, origin)
    target.searchParams.set('utm_source', 'qr')
    target.searchParams.set('utm_medium', 'offline')
    target.searchParams.set('qr', params.publicId)

    return NextResponse.redirect(target, { status: 302 })
  } catch {
    return NextResponse.redirect(new URL('/app/qr', req.url), { status: 302 })
  }
}
