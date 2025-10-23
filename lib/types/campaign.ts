// /lib/types/campaign.ts
// Zentrale Typen für Kampagnen (Server/Client gemeinsam nutzbar)

export type CampaignStatus = 'active' | 'paused' | 'archived'

// ⚠️ Supabase gibt Zeitstempel/UUIDs im Client-Kontext in der Regel als string zurück
export interface Campaign {
  id: string
  user_id: string
  name: string
  slug: string | null
  status: CampaignStatus
  created_at: string
  updated_at?: string | null
}

export interface CampaignWithStats extends Campaign {
  // 🔧 Optional, bis echte Aggregation/Counts vorhanden sind
  testimonial_count?: number
}
