// lib/validations/qr.ts
// ✅ Zod-Validierungen für QR-Code-Formulare
// 🔐 DSGVO: Validierung ohne personenbezogene Daten

import { z } from 'zod'

export const qrDesignSchema = z.object({
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Ungültiges Farbformat (z.B. #000000)')
    .default('#000000'),
  background: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Ungültiges Hintergrundformat (z.B. #FFFFFF)')
    .default('#FFFFFF'),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('H'),
  margin: z.number().int().min(0).max(10).default(4),
  size: z.number().int().min(128).max(2048).default(1024),
})

export const createQRCodeSchema = z.object({
  campaign_id: z.string().uuid('Ungültige Kampagnen-ID'),
  title: z.string().min(1, 'Titel erforderlich').max(100, 'Titel zu lang (max. 100 Zeichen)'),
  design: qrDesignSchema.partial().optional(),
  utm_source: z.string().max(50).optional(),
  utm_medium: z.string().max(50).optional(),
  utm_campaign: z.string().max(50).optional(),
})

export const quickQRSchema = z.object({
  campaign_id: z.string().uuid('Ungültige Kampagnen-ID'),
  title: z.string().min(1, 'Titel erforderlich').max(100, 'Titel zu lang (max. 100 Zeichen)'),
})

export type CreateQRCodeInput = z.infer<typeof createQRCodeSchema>
export type QuickQRInput = z.infer<typeof quickQRSchema>
export type QRDesignInput = z.infer<typeof qrDesignSchema>
