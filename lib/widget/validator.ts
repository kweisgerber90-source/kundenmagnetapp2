// /lib/widget/validator.ts
import { z } from 'zod'

export const widgetParamsSchema = z.object({
  campaign: z.string().min(1, 'Kampagne ist erforderlich'),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
  sort: z.enum(['newest', 'oldest', 'rating']).optional().default('newest'),
  theme: z.enum(['light', 'dark', 'auto']).optional().default('light'),
  title: z.string().optional().default('Kundenbewertungen'),
  showRating: z.coerce.boolean().optional().default(true),
  animation: z.coerce.boolean().optional().default(true),
})

export type WidgetParams = z.infer<typeof widgetParamsSchema>

export function validateWidgetParams(params: unknown) {
  return widgetParamsSchema.safeParse(params)
}
