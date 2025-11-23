// lib/types/qr.ts
// Zentrale Typen für QR-Codes (Server/Client gemeinsam nutzbar)

/**
 * QR Code Design Configuration
 */
export interface QRCodeDesign {
  size: number // default: 1024
  color: string // default: #000000
  margin: number // default: 4
  background: string // default: #FFFFFF
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' // default: H
}

/**
 * QR Code Type (basiert auf supabase.sql Schema)
 */
export interface QRCode {
  id: string
  user_id: string
  campaign_id: string
  public_id: string // Eindeutige kurze ID für Public-URL
  title: string
  design: QRCodeDesign
  file_url_svg: string | null
  file_url_png: string | null
  file_url_pdf: string | null
  scan_count: number
  last_scanned_at: string | null
  utm_source: string // default: 'qr'
  utm_medium: string // default: 'offline'
  utm_campaign: string | null
  created_at: string
}

/**
 * QR Code Create Payload (für API POST)
 */
export interface QRCodeCreatePayload {
  campaign_id: string
  title: string
  design?: Partial<QRCodeDesign>
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

/**
 * QR Code Update Payload (für API PATCH)
 */
export interface QRCodeUpdatePayload {
  title?: string
  design?: Partial<QRCodeDesign>
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

/**
 * QR Scan Type
 */
export interface QRScan {
  id: number
  qr_id: string
  referer: string | null
  user_agent: string | null
  ip_hash: string | null
  utm: Record<string, string> // JSON object with UTM parameters
  created_at: string
}

/**
 * QR Code Statistics
 */
export interface QRCodeStats {
  total: number // Total number of QR codes
  totalScans: number // Total scans across all QR codes
  averageScansPerCode: number
  mostScannedCode?: {
    id: string
    title: string
    scanCount: number
  }
}
