// types/database.ts
/**
 * Supabase Database Types
 * Generiert aus den Datenbank-Schemas
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          campaign_id: string
          author_name: string
          author_email: string | null
          rating: number
          content: string
          status: 'pending' | 'approved' | 'hidden' | 'deleted'
          consent_text: string
          consent_timestamp: string
          ip_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          author_name: string
          author_email?: string | null
          rating: number
          content: string
          status?: 'pending' | 'approved' | 'hidden' | 'deleted'
          consent_text: string
          consent_timestamp: string
          ip_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          author_name?: string
          author_email?: string | null
          rating?: number
          content?: string
          status?: 'pending' | 'approved' | 'hidden' | 'deleted'
          consent_text?: string
          consent_timestamp?: string
          ip_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_sends: {
        Row: {
          id: string
          user_id: string | null
          recipient: string
          subject: string
          status: string
          tags: Json | null
          sent_at: string
          delivered_at: string | null
          opened_at: string | null
          clicked_at: string | null
          bounced_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          recipient: string
          subject: string
          status?: string
          tags?: Json | null
          sent_at?: string
          delivered_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          bounced_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          recipient?: string
          subject?: string
          status?: string
          tags?: Json | null
          sent_at?: string
          delivered_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          bounced_at?: string | null
        }
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          ip_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          ip_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          ip_hash?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hash_ip: {
        Args: {
          ip_address: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
