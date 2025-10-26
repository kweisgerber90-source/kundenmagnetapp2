// lib/qr/types.ts
// 📦 TypeScript-Typen für QR-Code-Modul
// 🔐 DSGVO: Keine personenbezogenen Daten in diesen Typen

export interface QRCode {
  id: string
  user_id: string
  campaign_id: string
  public_id: string
  title: string
  design: QRDesign
  file_url_svg: string | null
  file_url_png: string | null
  file_url_pdf: string | null
  scan_count: number
  last_scanned_at: string | null
  utm_source: string
  utm_medium: string
  utm_campaign: string | null
  created_at: string
}

export interface QRDesign {
  color: string
  background: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  margin: number
  size: number
}

export interface QRScan {
  id: number
  qr_id: string
  referer: string | null
  user_agent: string | null
  ip_hash: string | null
  utm: Record<string, string>
  created_at: string
}

export interface QRStats {
  total_scans: number
  scans_last_7_days: number
  scans_last_30_days: number
  scans_by_day: Array<{
    date: string
    count: number
  }>
  top_referrers: Array<{
    referer: string
    count: number
  }>
}

export interface CreateQRCodeInput {
  campaign_id: string
  title: string
  design?: Partial<QRDesign>
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export interface QuickQRInput {
  campaign_id: string
  title: string
}
