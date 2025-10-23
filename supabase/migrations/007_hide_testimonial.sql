-- /supabase/migrations/007_hide_testimonial.sql
-- SECURITY DEFINER RPC zum Verstecken eines Testimonials inkl. Audit-Log
-- Kommentare auf Deutsch.

SET statement_timeout = 0;
SET lock_timeout = 0;

CREATE OR REPLACE FUNCTION hide_testimonial(p_testimonial_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_success BOOLEAN := FALSE;
BEGIN
  -- Besitzer der Kampagne ermitteln
  SELECT c.user_id INTO v_user_id
  FROM testimonials t
  JOIN campaigns c ON c.id = t.campaign_id
  WHERE t.id = p_testimonial_id;

  IF v_user_id = auth.uid() THEN
    UPDATE testimonials
    SET status = 'hidden',
        approved_at = NULL,
        deleted_at = NULL
    WHERE id = p_testimonial_id;

    -- Audit-Log wird serverseitig geschrieben (RLS-freundlich)
    INSERT INTO audit_log (actor, action, target, meta)
    VALUES (auth.uid(), 'hide_testimonial', p_testimonial_id::TEXT, jsonb_build_object('timestamp', NOW()));

    v_success := TRUE;
  END IF;

  RETURN v_success;
END;
$$;
