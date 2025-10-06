-- Migration 003: Consent Log für TTDSG-Compliance (überarbeitet)
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

CREATE INDEX IF NOT EXISTS idx_consent_log_user_id ON consent_log(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_log_created_at ON consent_log(created_at DESC);

ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;

-- Users see only their own logs
DROP POLICY IF EXISTS "Users can view own consent logs" ON consent_log;
CREATE POLICY "Users can view own consent logs"
  ON consent_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow inserts for everyone (anon & authenticated).
-- RLS remains enabled, but this policy permits inserts without requiring service key.
DROP POLICY IF EXISTS "Anyone can insert consent logs" ON consent_log;
CREATE POLICY "Anyone can insert consent logs"
  ON consent_log
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

COMMENT ON TABLE consent_log IS 'Logs user consent decisions for TTDSG compliance';
COMMENT ON COLUMN consent_log.categories IS 'JSON object with category consent: {"analytics": true, "marketing": false}';
COMMENT ON COLUMN consent_log.consent_text_snapshot IS 'Full text of consent notice shown to user at time of acceptance';