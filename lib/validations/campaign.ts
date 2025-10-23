// /lib/validations/campaign.ts
// Zod-Schemas für Kampagnen
// 🔧 Korrektur: Regex für Slug korrigiert (/^[a-z0-9-]+$/)

import { z } from 'zod'

export const createCampaignSchema = z.object({
  name: z
    .string()
    .min(3, 'Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Name darf maximal 100 Zeichen lang sein'),
  slug: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-z0-9-]+$/.test(val),
      'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten',
    ),
})

export const updateCampaignSchema = z.object({
  name: z
    .string()
    .min(3, 'Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Name darf maximal 100 Zeichen lang sein')
    .optional(),
  status: z.enum(['active', 'paused', 'archived']).optional(),
})

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>
