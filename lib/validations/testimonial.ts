// /lib/validations/testimonial.ts
// Validierungsschemas für Testimonials (Zod)
// 🔧 Korrektur: Preprocessing für optionales Rating/E-Mail, damit "leer" nicht als Fehler gilt.

import { z } from 'zod'

// Leere Strings/Null/0 → undefined, damit optionale Felder wirklich optional sind
const preprocessEmptyToUndefined = (v: unknown) => {
  if (v === '' || v === null) return undefined
  return v
}

// Rating: 0/''/null gelten als "nicht gesetzt"
const optionalRatingSchema = z.preprocess(
  (v) => (v === 0 || v === '0' ? undefined : preprocessEmptyToUndefined(v)),
  z.number().int().min(1, 'Bewertung muss zwischen 1 und 5 Sternen liegen').max(5).optional(),
)

// E-Mail: '' → undefined, damit .optional() greift
const optionalEmailSchema = z.preprocess(
  preprocessEmptyToUndefined,
  z.string().email('Ungültige E-Mail-Adresse').optional(),
)

export const submitTestimonialSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein').max(100),
  email: optionalEmailSchema,
  text: z.string().min(10, 'Bewertung muss mindestens 10 Zeichen lang sein').max(2000),
  rating: optionalRatingSchema,
  consent: z.boolean().refine((val) => val === true, {
    message: 'Sie müssen der Datenschutzerklärung zustimmen',
  }),
})

export type SubmitTestimonialInput = z.infer<typeof submitTestimonialSchema>
