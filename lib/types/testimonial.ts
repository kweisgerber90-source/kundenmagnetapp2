// lib/types/testimonial.ts
// Zentrale Typen für Testimonials (Server/Client gemeinsam nutzbar)

export type TestimonialStatus = 'pending' | 'approved' | 'hidden'

/**
 * Testimonial Type (basiert auf supabase.sql Schema)
 */
export interface Testimonial {
  id: string
  campaign_id: string
  name: string
  email: string | null
  text: string
  rating: number | null // 1-5
  photo_url: string | null
  status: TestimonialStatus
  consent_text_snapshot: string | null
  submitted_ip_hash: string | null
  submitted_user_agent: string | null
  approved_at: string | null
  deleted_at: string | null
  anonymized_at: string | null
  tags: string[] | null
  created_at: string
}

/**
 * Testimonial Create Payload (für API POST)
 */
export interface TestimonialCreatePayload {
  campaign_id: string
  name: string
  email?: string
  text: string
  rating?: number
  photo_url?: string
  consent_text_snapshot?: string
  submitted_ip_hash?: string
  submitted_user_agent?: string
}

/**
 * Testimonial Update Payload (für API PATCH)
 */
export interface TestimonialUpdatePayload {
  status?: TestimonialStatus
  name?: string
  email?: string
  text?: string
  rating?: number
  photo_url?: string
  tags?: string[]
}

/**
 * Testimonial Statistics
 */
export interface TestimonialStats {
  total: number
  pending: number
  approved: number
  hidden: number
  averageRating: number
}
