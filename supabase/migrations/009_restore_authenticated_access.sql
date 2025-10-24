-- /supabase/migrations/008_restore_authenticated_access.sql
-- Hotfix: Restore SELECT permissions for authenticated users
-- Problem: Dashboard kann keine Testimonials mehr laden

BEGIN;

-- =============================================================================
-- GRANT SELECT zurück für authenticated (aber NICHT für anon)
-- =============================================================================

-- Authenticated users können wieder ihre eigenen Testimonials sehen
-- (RLS-Policies stellen sicher, dass sie nur ihre eigenen sehen)
GRANT SELECT ON TABLE public.testimonials TO authenticated;
GRANT SELECT ON TABLE public.campaigns TO authenticated;

-- Anon bleibt blockiert (muss Views verwenden)
-- KEINE Änderung für anon

-- =============================================================================
-- Zusammenfassung der Berechtigungen nach diesem Fix:
-- =============================================================================
-- 
-- ✅ authenticated: SELECT auf testimonials (via RLS - nur eigene)
-- ✅ authenticated: SELECT auf campaigns (via RLS - nur eigene)
-- ❌ anon: KEIN SELECT auf testimonials (muss public_testimonials View nutzen)
-- ❌ anon: KEIN SELECT auf campaigns (muss public_campaigns View nutzen)
-- ✅ service_role: Voller Zugriff (für API-Route)

COMMIT;

-- =============================================================================
-- HINWEISE
-- =============================================================================
-- 
-- Dieser Fix behebt das Problem, dass das Dashboard keine Testimonials
-- mehr laden konnte, weil authenticated users keinen SELECT-Zugriff hatten.
-- 
-- Die RLS-Policies stellen weiterhin sicher, dass:
-- - Users nur ihre eigenen Testimonials sehen
-- - Users nur ihre eigenen Kampagnen sehen
-- 
-- Nur anon bleibt blockiert und muss die Views verwenden.
-- 
-- 🔒 SICHERHEIT bleibt erhalten:
-- - Widget API nutzt Service-Role (kein RLS)
-- - Widget iFrame nutzt Views (ohne E-Mail)
-- - Anon hat KEINEN direkten Zugriff auf Tabellen
-- - E-Mail-Adressen bleiben geschützt im öffentlichen Zugriff