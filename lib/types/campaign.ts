// /lib/types/campaign.ts
// Zentrale Typen für Kampagnen (Server/Client gemeinsam nutzbar)

import type { QRCodeStats } from './qr'
import type { TestimonialStats } from './testimonial'

export type CampaignStatus = 'active' | 'paused' | 'archived'

/**
 * Campaign Type (basiert auf supabase.sql Schema)
 */
export interface Campaign {
  id: string
  user_id: string
  name: string
  slug: string
  status: CampaignStatus
  created_at: string
}

/**
 * Campaign with calculated statistics
 */
export interface CampaignWithStats extends Campaign {
  testimonials?: TestimonialStats
  qrCodes?: QRCodeStats
}

/**
 * Campaign Create Payload (für API POST)
 */
export interface CampaignCreatePayload {
  name: string
  slug: string
  status?: CampaignStatus
}

/**
 * Campaign Update Payload (für API PATCH)
 */
export interface CampaignUpdatePayload {
  name?: string
  slug?: string
  status?: CampaignStatus
}
