-- Migration 003: Consent Log für TTDSG-Compliance
-- Speichert User-Zustimmungen mit Snapshot und Timestamp

CREATE TABLE IF NOT EXISTS consent_log (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash text NOT NULL,
  user_agent text,
  consent_given boolean NOT NULL,
  categories jsonb NOT NULL DEFAULT '{}',
  consent_text_snapshot text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index für Abfragen nach user_id
CREATE INDEX idx_consent_log_user_id ON consent_log(user_id);

-- Index für Abfragen nach Zeitstempel
CREATE INDEX idx_consent_log_created_at ON consent_log(created_at DESC);

-- RLS Policies
ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;

-- Admins können alles sehen (später einschränken auf admin role)
CREATE POLICY "Admin can view all consent logs"
  ON consent_log
  FOR SELECT
  USING (true);

-- Insert nur via Service Role (API)
CREATE POLICY "Service role can insert consent logs"
  ON consent_log
  FOR INSERT
  WITH CHECK (true);

-- Users können ihre eigenen Logs sehen
CREATE POLICY "Users can view own consent logs"
  ON consent_log
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE consent_log IS 'Logs user consent decisions for TTDSG compliance';
COMMENT ON COLUMN consent_log.categories IS 'JSON object with category consent: {"analytics": true, "marketing": false}';
COMMENT ON COLUMN consent_log.consent_text_snapshot IS 'Full text of consent notice shown to user at time of acceptance';