-- /supabase/migrations/00x_step_3c_testimonials.sql
-- 🔧 Korrektur/Absicherung des Schemas für Step 3C
-- Fügt fehlende Spalten & Indizes hinzu, falls noch nicht vorhanden.

-- Rating (optional, 1..5)
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS rating integer CHECK (rating BETWEEN 1 AND 5);

-- Consent-Text-Snapshot (erforderlich, Default leere Zeichenkette)
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS consent_text_snapshot text NOT NULL DEFAULT '';

-- DSGVO: IP-Hash & User-Agent
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS submitted_ip_hash text,
  ADD COLUMN IF NOT EXISTS submitted_user_agent text;

-- Moderationsstatus
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'status'
  ) THEN
    ALTER TABLE testimonials
      ADD COLUMN status text NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending','approved','rejected'));
  END IF;
END $$;

-- Indizes für Abfragen & Rate-Limit
CREATE INDEX IF NOT EXISTS idx_testimonials_campaign_created ON testimonials (campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_ip_recent ON testimonials (submitted_ip_hash, created_at DESC);
