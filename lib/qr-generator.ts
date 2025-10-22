// lib/qr-generator.ts
// 🧩 Verantwortlich: QR-Erzeugung (SVG/PNG) ohne 'canvas' – stabil auf Vercel/Windows.
// 🔐 DSGVO: Keine personenbezogenen Daten in QR-Inhalten speichern, nur Redirect-URL.

import QRCode from 'qrcode'

export interface QRDesign {
  color?: string
  background?: string
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  margin?: number
  size?: number
}

const DEFAULTS: Required<QRDesign> = {
  color: '#000000',
  background: '#FFFFFF',
  errorCorrectionLevel: 'H',
  margin: 4,
  size: 1024,
}

// 🔍 Validierung der Design-Parameter
export function validateQRDesign(design: QRDesign): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const hex = /^#[0-9A-Fa-f]{6}$/

  if (design.color && !hex.test(design.color)) errors.push('Ungültiges Farbformat (z. B. #000000).')
  if (design.background && !hex.test(design.background))
    errors.push('Ungültiges Hintergrundformat (z. B. #FFFFFF).')
  if (design.size && (design.size < 128 || design.size > 2048))
    errors.push('Größe muss 128–2048 sein.')
  if (design.margin && (design.margin < 0 || design.margin > 10))
    errors.push('Rand muss 0–10 sein.')

  return { valid: errors.length === 0, errors }
}

// 🖨️ SVG als String
export async function generateQRCodeSVG(url: string, design: QRDesign = {}): Promise<string> {
  const opts = { ...DEFAULTS, ...design }
  try {
    return await QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: opts.errorCorrectionLevel,
      margin: opts.margin,
      width: opts.size,
      color: { dark: opts.color, light: opts.background },
    })
  } catch (err) {
    console.error('[qr] SVG-Generierung fehlgeschlagen:', err)
    throw new Error('QR SVG konnte nicht erzeugt werden')
  }
}

// 🖼️ PNG als Buffer
export async function generateQRCodePNG(url: string, design: QRDesign = {}): Promise<Buffer> {
  const opts = { ...DEFAULTS, ...design }
  try {
    return await QRCode.toBuffer(url, {
      type: 'png',
      errorCorrectionLevel: opts.errorCorrectionLevel,
      margin: opts.margin,
      width: opts.size,
      color: { dark: opts.color, light: opts.background },
    })
  } catch (err) {
    console.error('[qr] PNG-Generierung fehlgeschlagen:', err)
    throw new Error('QR PNG konnte nicht erzeugt werden')
  }
}

// 📄 Platzhalter: PDF optional später via PDFKit
export async function generateQRCodePDF(url: string, design: QRDesign = {}): Promise<Buffer> {
  // ⚠️ Vereinfachung: vorerst PNG zurückgeben; echtes PDF ist späterer Schritt.
  return generateQRCodePNG(url, design)
}
