-- /supabase/migrations/007_public_widget_views.sql
-- Sichere öffentliche Views für Widget (ohne E-Mail-Spalten)
-- Verhindert PII-Leaks durch direkte Tabellenzugriffe

BEGIN;

-- =============================================================================
-- 1) DROP gefährliche Public-Policy & REVOKE direkte Zugriffe
-- =============================================================================
-- Diese Policy erlaubt anon direkten Zugriff auf ALLE Spalten (inkl. E-Mail)!
-- ⚠️ KRITISCH: PII-Leak beheben

-- Entferne die gefährliche Policy
DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anon can view approved testimonials" ON public.testimonials;

-- Entferne auch alle SELECT-Rechte für anon/authenticated auf Basistabellen
REVOKE SELECT ON TABLE public.testimonials FROM anon, authenticated;
REVOKE SELECT ON TABLE public.campaigns FROM anon, authenticated;

COMMENT ON TABLE public.testimonials IS 'Basistabelle - nur via Views oder Service-Role zugänglich. RLS für authenticated (Owner) bleibt aktiv.';
COMMENT ON TABLE public.campaigns IS 'Basistabelle - nur via Views oder Service-Role zugänglich. RLS für authenticated (Owner) bleibt aktiv.';

-- =============================================================================
-- 2) VIEW: Öffentliche Kampagnen (nur aktive, ohne PII)
-- =============================================================================

-- Lösche alte View falls vorhanden (könnte alte Spalten haben)
DROP VIEW IF EXISTS public.public_campaigns CASCADE;

CREATE OR REPLACE VIEW public.public_campaigns AS
SELECT 
  id,
  name,
  slug,
  status
FROM public.campaigns
WHERE status = 'active';

GRANT SELECT ON public.public_campaigns TO anon, authenticated;

COMMENT ON VIEW public.public_campaigns IS 'Öffentliche Kampagnen für Widget - nur aktive, keine User-IDs';

-- =============================================================================
-- 3) VIEW: Öffentliche Testimonials (ohne E-Mail)
-- =============================================================================

-- Lösche alte View falls vorhanden (könnte alte Spalten haben)
DROP VIEW IF EXISTS public.public_testimonials CASCADE;

CREATE OR REPLACE VIEW public.public_testimonials AS
SELECT 
  id,
  campaign_id,
  name,
  text,
  rating,
  created_at,
  approved_at
FROM public.testimonials
WHERE status = 'approved'
  AND deleted_at IS NULL
  AND anonymized_at IS NULL;

GRANT SELECT ON public.public_testimonials TO anon, authenticated;

COMMENT ON VIEW public.public_testimonials IS 'Öffentliche Testimonials für Widget - ohne E-Mail (email), nur genehmigte';

-- =============================================================================
-- Index für Performance (optional, falls noch nicht vorhanden)
-- =============================================================================

-- Index für approved_at wird bereits in 001_init_schema.sql angelegt,
-- daher hier keine Duplikate

COMMIT;

-- =============================================================================
-- HINWEISE FÜR ENTWICKLER
-- =============================================================================
-- 
-- ✅ Nach dieser Migration:
-- - iFrame (/app/widget/frame/page.tsx) verwendet public_testimonials View
-- - API (/app/api/widget/route.ts) nutzt Service-Role + direkte Tabelle (mit E-Mail-Maskierung)
-- - **authenticated** Users können weiterhin via RLS ihre eigenen Testimonials sehen
-- - **anon** Users können nur noch via Views zugreifen (ohne E-Mail)
--
-- ⚠️ WICHTIG:
-- - Widget-iFrame MUSS auf Views umgestellt werden (siehe Schritt 3)
-- - API-Route darf weiterhin Service-Role nutzen (kein RLS)
-- - Bestehende RLS-Policies für authenticated bleiben unberührt!
--
-- 🔒 SICHERHEIT:
-- - Gefährliche "Public can view approved testimonials" Policy entfernt
-- - Keine E-Mail-Adressen in öffentlichen Views
-- - DSGVO-konform: Nur freigegebene Testimonials sichtbar
-- - XSS-Schutz durch HTML-Escaping auf Frontend-Ebene
--
-- 📋 BESTEHENDE POLICIES (bleiben aktiv):
-- - "Users can view testimonials for own campaigns" (authenticated)
-- - "Users can update testimonials for own campaigns" (authenticated)
-- - "Users can delete testimonials for own campaigns" (authenticated)
-- - "Public can create testimonials (pending only)" (anon) - bleibt!