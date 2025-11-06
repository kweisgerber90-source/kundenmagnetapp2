-- /supabase/migrations/011_normalize_plan_limits.sql
-- ============================================================================
-- 💳 Plan-Limits normalisieren (idempotent)
-- Ziel:
--  - Bestehende Tabelle public.plan_limits auf die Soll-Struktur bringen
--  - Fehlende Spalten ergänzen / alte Spalten migrieren
--  - Konsistente Werte (lowercase) für plan_id/plan_name
--  - Eindeutigkeit auf plan_id für UPSERT
--  - Sinnvolle Defaults/NOT NULL
--  - Seed/Upsert der drei Pläne: starter, pro, business
-- Hinweis: Skript ist idempotent und kann gefahrlos erneut ausgeführt werden.
-- ============================================================================

BEGIN;

-- 1) Tabelle sicherstellen (nur falls sie nicht existiert)
CREATE TABLE IF NOT EXISTS public.plan_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT,
  max_campaigns INT,
  max_testimonials_per_campaign INT,
  max_widget_requests_per_day INT,
  max_qr_codes INT,
  max_qr_scans_per_month INT,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Neuere Zielspalten (werden unten ergänzt, falls noch nicht vorhanden)
  plan_id TEXT,
  max_qr_scans_per_day INT,
  can_export_csv BOOLEAN DEFAULT false,
  can_customize_widget BOOLEAN DEFAULT false,
  can_use_api BOOLEAN DEFAULT false,
  can_white_label BOOLEAN DEFAULT false,
  has_priority_support BOOLEAN DEFAULT false
);

-- 2) Alte Spalten migrieren/umbenennen (z.B. max_qr_scans -> max_qr_scans_per_day)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='plan_limits' AND column_name='max_qr_scans'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='plan_limits' AND column_name='max_qr_scans_per_day'
  ) THEN
    ALTER TABLE public.plan_limits
      RENAME COLUMN max_qr_scans TO max_qr_scans_per_day; -- 🔧 Korrektur: Spalte vereinheitlicht
  END IF;
END$$;

-- 3) Alle Soll-Spalten anlegen (falls fehlen) inkl. Defaults
ALTER TABLE public.plan_limits
  ADD COLUMN IF NOT EXISTS plan_id TEXT,
  ADD COLUMN IF NOT EXISTS plan_name TEXT,
  ADD COLUMN IF NOT EXISTS max_campaigns INT,
  ADD COLUMN IF NOT EXISTS max_testimonials_per_campaign INT,
  ADD COLUMN IF NOT EXISTS max_widget_requests_per_day INT,
  ADD COLUMN IF NOT EXISTS max_qr_codes INT,
  ADD COLUMN IF NOT EXISTS max_qr_scans_per_day INT,
  ADD COLUMN IF NOT EXISTS max_qr_scans_per_month INT,
  ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS can_export_csv BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_customize_widget BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_use_api BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_white_label BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_priority_support BOOLEAN DEFAULT false;

-- 4) NULL-Werte in features vermeiden
UPDATE public.plan_limits
SET features = COALESCE(features, '{}'::jsonb)
WHERE features IS NULL;

-- 5) plan_name/plan_id in lowercase bringen (Kompatibilität mit CHECK/Enum)
UPDATE public.plan_limits
SET plan_name = LOWER(plan_name)
WHERE plan_name IS NOT NULL AND plan_name <> LOWER(plan_name);

UPDATE public.plan_limits
SET plan_id = LOWER(plan_id)
WHERE plan_id IS NOT NULL AND plan_id <> LOWER(plan_id);

-- 6) plan_id aus plan_name ableiten, falls noch NULL
UPDATE public.plan_limits
SET plan_id = plan_name
WHERE plan_id IS NULL AND plan_name IS NOT NULL;

-- 7) Dailylimits setzen, wenn noch unbekannt (per plan_id)
UPDATE public.plan_limits
SET max_qr_scans_per_day = CASE plan_id
  WHEN 'starter'  THEN 100
  WHEN 'pro'      THEN 500
  WHEN 'business' THEN 5000
  ELSE max_qr_scans_per_day
END
WHERE max_qr_scans_per_day IS NULL;

-- 8) Monatslimits setzen, wenn noch NULL (30x Tageslimit)
UPDATE public.plan_limits
SET max_qr_scans_per_month = max_qr_scans_per_day * 30
WHERE max_qr_scans_per_month IS NULL
  AND max_qr_scans_per_day IS NOT NULL;

-- 9) CHECK-Constraint für plan_name (nur einmalig anlegen)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.plan_limits'::regclass
      AND conname = 'plan_limits_plan_name_check'
  ) THEN
    ALTER TABLE public.plan_limits
      ADD CONSTRAINT plan_limits_plan_name_check
      CHECK (plan_name IN ('starter','pro','business')); -- 🔒 erlaubte Werte
  END IF;
END$$;

-- 10) Eindeutigkeit auf plan_id (für ON CONFLICT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_indexes
    WHERE  schemaname = 'public'
       AND indexname  = 'plan_limits_plan_id_key'
  ) THEN
    ALTER TABLE public.plan_limits
      ADD CONSTRAINT plan_limits_plan_id_key UNIQUE (plan_id);
  END IF;
END$$;

-- 11) NOT NULL erst NACH Befüllung erzwingen
ALTER TABLE public.plan_limits
  ALTER COLUMN plan_id SET NOT NULL,
  ALTER COLUMN plan_name SET NOT NULL,
  ALTER COLUMN max_campaigns SET NOT NULL,
  ALTER COLUMN max_testimonials_per_campaign SET NOT NULL,
  ALTER COLUMN max_widget_requests_per_day SET NOT NULL,
  ALTER COLUMN max_qr_codes SET NOT NULL,
  ALTER COLUMN max_qr_scans_per_day SET NOT NULL,
  ALTER COLUMN max_qr_scans_per_month SET NOT NULL,
  ALTER COLUMN features SET NOT NULL,
  ALTER COLUMN can_export_csv SET NOT NULL,
  ALTER COLUMN can_customize_widget SET NOT NULL,
  ALTER COLUMN can_use_api SET NOT NULL,
  ALTER COLUMN can_white_label SET NOT NULL,
  ALTER COLUMN has_priority_support SET NOT NULL;

-- 12) Seed/Upsert der drei Pläne (idempotent)
INSERT INTO public.plan_limits (
  plan_id, plan_name,
  max_campaigns, max_testimonials_per_campaign, max_qr_codes,
  max_widget_requests_per_day, max_qr_scans_per_day, max_qr_scans_per_month,
  can_export_csv, can_customize_widget, can_use_api, can_white_label, has_priority_support
) VALUES
  ('starter',  'starter',   2,    50,   5,   1000,   100,   3000,   false, false, false, false, false),
  ('pro',      'pro',       10,   200,  20,  5000,   500,   15000,  true,  true,  false, false, false),
  ('business', 'business',  9999, 9999, 100, 50000,  5000,  150000, true,  true,  true,  true,  true)
ON CONFLICT (plan_id) DO UPDATE SET
  plan_name                     = EXCLUDED.plan_name,
  max_campaigns                 = EXCLUDED.max_campaigns,
  max_testimonials_per_campaign = EXCLUDED.max_testimonials_per_campaign,
  max_qr_codes                  = EXCLUDED.max_qr_codes,
  max_widget_requests_per_day   = EXCLUDED.max_widget_requests_per_day,
  max_qr_scans_per_day          = EXCLUDED.max_qr_scans_per_day,
  max_qr_scans_per_month        = EXCLUDED.max_qr_scans_per_month,
  can_export_csv                = EXCLUDED.can_export_csv,
  can_customize_widget          = EXCLUDED.can_customize_widget,
  can_use_api                   = EXCLUDED.can_use_api,
  can_white_label               = EXCLUDED.can_white_label,
  has_priority_support          = EXCLUDED.has_priority_support;

COMMIT;
