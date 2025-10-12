-- Functions & triggers (Step 2C)
-- Safe defaults
SET statement_timeout = 0;
SET lock_timeout = 0;

----------------------------------------------------------------
-- Utility: consistent search_path in SECURITY DEFINER functions
----------------------------------------------------------------
-- (we set it per function using "SET search_path = public")

----------------------------------------------------------------
-- Generate unique slug from name
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_unique_slug(p_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_slug TEXT;
  v_counter INT := 0;
  v_exists BOOLEAN;
BEGIN
  v_slug := LOWER(p_name);
  v_slug := REGEXP_REPLACE(v_slug, '[^a-z0-9]+', '-', 'g');
  v_slug := TRIM(BOTH '-' FROM v_slug);
  IF v_slug = '' THEN
    v_slug := 'campaign';
  END IF;

  SELECT EXISTS(SELECT 1 FROM campaigns WHERE slug = v_slug) INTO v_exists;

  WHILE v_exists LOOP
    v_counter := v_counter + 1;
    SELECT EXISTS(SELECT 1 FROM campaigns WHERE slug = v_slug || '-' || v_counter) INTO v_exists;
  END LOOP;

  IF v_counter > 0 THEN
    v_slug := v_slug || '-' || v_counter;
  END IF;

  RETURN v_slug;
END;
$$;

----------------------------------------------------------------
-- BEFORE INSERT on campaigns: auto slug if NULL/blank
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_campaign_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR btrim(NEW.slug) = '' THEN
    NEW.slug := generate_unique_slug(COALESCE(NEW.name, 'Campaign'));
  ELSE
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.slug, '[^a-z0-9]+', '-', 'g'));
    NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
    IF NEW.slug = '' THEN
      NEW.slug := generate_unique_slug(COALESCE(NEW.name, 'Campaign'));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_campaigns_set_slug ON campaigns;
CREATE TRIGGER trg_campaigns_set_slug
  BEFORE INSERT ON campaigns
  FOR EACH ROW EXECUTE FUNCTION set_campaign_slug();

----------------------------------------------------------------
-- Force testimonials to be pending on INSERT (defense-in-depth)
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION enforce_testimonial_insert_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.status := 'pending';
  NEW.approved_at := NULL;
  NEW.deleted_at := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_testimonials_enforce_insert ON testimonials;
CREATE TRIGGER trg_testimonials_enforce_insert
  BEFORE INSERT ON testimonials
  FOR EACH ROW EXECUTE FUNCTION enforce_testimonial_insert_defaults();

----------------------------------------------------------------
-- Public RPC: submit testimonial by campaign slug
--   Designed for anon/public calls via PostgREST
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_testimonial_by_slug(
  p_slug TEXT,
  p_name TEXT,
  p_email TEXT,
  p_text TEXT,
  p_rating INT,
  p_consent_text TEXT,
  p_ip_hash TEXT,
  p_user_agent TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_campaign_id UUID;
  v_testimonial_id UUID;
BEGIN
  -- find active campaign
  SELECT id INTO v_campaign_id
  FROM campaigns
  WHERE slug = p_slug
    AND status = 'active'
  LIMIT 1;

  IF v_campaign_id IS NULL THEN
    RAISE EXCEPTION 'Campaign not found or not active';
  END IF;

  INSERT INTO testimonials (
    id, campaign_id, name, email, text, rating,
    consent_text_snapshot, submitted_ip_hash, submitted_user_agent, status
  ) VALUES (
    gen_random_uuid(), v_campaign_id, p_name, p_email, p_text, p_rating,
    NULLIF(p_consent_text, ''), NULLIF(p_ip_hash, ''), NULLIF(p_user_agent, ''), 'pending'
  )
  RETURNING id INTO v_testimonial_id;

  RETURN v_testimonial_id;
END;
$$;

COMMENT ON FUNCTION submit_testimonial_by_slug IS
'Public endpoint: insert pending testimonial by campaign slug. Enforced by RLS and BEFORE INSERT trigger.';

----------------------------------------------------------------
-- Approve testimonial (owner only)
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION approve_testimonial(p_testimonial_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_success BOOLEAN := FALSE;
BEGIN
  SELECT c.user_id INTO v_user_id
  FROM testimonials t
  JOIN campaigns c ON c.id = t.campaign_id
  WHERE t.id = p_testimonial_id;

  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Only owner (current auth.uid) can approve
  IF v_user_id = auth.uid() THEN
    UPDATE testimonials
    SET status = 'approved',
        approved_at = NOW(),
        deleted_at = NULL
    WHERE id = p_testimonial_id;

    INSERT INTO audit_log (actor, action, target, meta)
    VALUES (auth.uid(), 'approve_testimonial', p_testimonial_id::TEXT, jsonb_build_object('timestamp', NOW()));

    v_success := TRUE;
  END IF;

  RETURN v_success;
END;
$$;

----------------------------------------------------------------
-- Soft delete testimonial (owner only)
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION soft_delete_testimonial(p_testimonial_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_success BOOLEAN := FALSE;
BEGIN
  SELECT c.user_id INTO v_user_id
  FROM testimonials t
  JOIN campaigns c ON c.id = t.campaign_id
  WHERE t.id = p_testimonial_id;

  IF v_user_id = auth.uid() THEN
    UPDATE testimonials
    SET deleted_at = NOW(),
        approved_at = NULL,
        status = CASE WHEN status='approved' THEN 'hidden' ELSE status END
    WHERE id = p_testimonial_id;

    INSERT INTO audit_log (actor, action, target, meta)
    VALUES (auth.uid(), 'soft_delete_testimonial', p_testimonial_id::TEXT, jsonb_build_object('timestamp', NOW()));

    v_success := TRUE;
  END IF;

  RETURN v_success;
END;
$$;

----------------------------------------------------------------
-- Anonymize testimonial (owner only)
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION anonymize_testimonial(p_testimonial_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_success BOOLEAN := FALSE;
BEGIN
  SELECT c.user_id INTO v_user_id
  FROM testimonials t
  JOIN campaigns c ON c.id = t.campaign_id
  WHERE t.id = p_testimonial_id;

  IF v_user_id = auth.uid() THEN
    UPDATE testimonials
    SET name = 'Anonymisiert',
        email = NULL,
        submitted_ip_hash = NULL,
        submitted_user_agent = NULL,
        anonymized_at = NOW()
    WHERE id = p_testimonial_id;

    INSERT INTO audit_log (actor, action, target, meta)
    VALUES (auth.uid(), 'anonymize_testimonial', p_testimonial_id::TEXT, jsonb_build_object('timestamp', NOW()));

    v_success := TRUE;
  END IF;

  RETURN v_success;
END;
$$;

----------------------------------------------------------------
-- Widget endpoint: get approved testimonials (paginated)
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_approved_testimonials(
  p_campaign_id UUID,
  p_limit INT DEFAULT 10,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  campaign_id UUID,
  name TEXT,
  text TEXT,
  rating INT,
  photo_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id, t.campaign_id, t.name, t.text, t.rating,
    t.photo_url, t.tags, t.created_at, t.approved_at
  FROM testimonials t
  WHERE t.campaign_id = p_campaign_id
    AND t.status = 'approved'
    AND t.deleted_at IS NULL
  ORDER BY t.approved_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

----------------------------------------------------------------
-- QR scans: insert + increment counter
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_qr_scan_count(
  p_qr_id UUID,
  p_ip_hash TEXT,
  p_user_agent TEXT,
  p_referer TEXT,
  p_utm JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO qr_scans (qr_id, ip_hash, user_agent, referer, utm)
  VALUES (p_qr_id, NULLIF(p_ip_hash, ''), NULLIF(p_user_agent, ''), NULLIF(p_referer, ''), COALESCE(p_utm, '{}'::jsonb));

  UPDATE qr_codes
  SET scan_count = scan_count + 1,
      last_scanned_at = NOW()
  WHERE id = p_qr_id;

  RETURN TRUE;
END;
$$;

----------------------------------------------------------------
-- Plan limit check
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_plan_limit(
  p_user_id UUID,
  p_limit_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_name TEXT;
  v_limit INT;
  v_current_count INT;
BEGIN
  SELECT COALESCE(s.plan_name, 'starter') INTO v_plan_name
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('trialing','active');

  IF v_plan_name IS NULL THEN
    v_plan_name := 'starter';
  END IF;

  CASE p_limit_type
    WHEN 'campaigns' THEN
      SELECT max_campaigns INTO v_limit FROM plan_limits WHERE plan_name = v_plan_name;
      SELECT COUNT(*) INTO v_current_count FROM campaigns WHERE user_id = p_user_id;
    WHEN 'qr_codes' THEN
      SELECT max_qr_codes INTO v_limit FROM plan_limits WHERE plan_name = v_plan_name;
      SELECT COUNT(*) INTO v_current_count FROM qr_codes WHERE user_id = p_user_id;
    ELSE
      RETURN FALSE;
  END CASE;

  RETURN v_current_count < v_limit;
END;
$$;

----------------------------------------------------------------
-- Usage tracking: increment monthly bucket
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION track_usage(
  p_user_id UUID,
  p_metric_type TEXT,
  p_count INT DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
BEGIN
  v_period_start := DATE_TRUNC('month', NOW())::DATE;
  v_period_end   := (DATE_TRUNC('month', NOW()) + INTERVAL '1 month - 1 day')::DATE;

  INSERT INTO usage_tracking (user_id, metric_type, count, period_start, period_end)
  VALUES (p_user_id, p_metric_type, p_count, v_period_start, v_period_end)
  ON CONFLICT (user_id, metric_type, period_start)
  DO UPDATE SET
    count = usage_tracking.count + EXCLUDED.count,
    updated_at = NOW();
END;
$$;

----------------------------------------------------------------
-- Current usage snapshot for UI
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_current_usage(p_user_id UUID)
RETURNS TABLE (
  metric_type TEXT,
  count INT,
  limit_value INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_name TEXT;
  v_period_start DATE;
BEGIN
  SELECT COALESCE(s.plan_name, 'starter') INTO v_plan_name
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('trialing','active');

  IF v_plan_name IS NULL THEN
    v_plan_name := 'starter';
  END IF;

  v_period_start := DATE_TRUNC('month', NOW())::DATE;

  RETURN QUERY
  SELECT
    ut.metric_type,
    ut.count,
    CASE ut.metric_type
      WHEN 'widget_requests' THEN pl.max_widget_requests_per_day * 30
      WHEN 'qr_scans'        THEN pl.max_qr_scans_per_month
      WHEN 'testimonials_collected' THEN pl.max_testimonials_per_campaign * GREATEST(1, (SELECT COUNT(*) FROM campaigns c WHERE c.user_id = p_user_id))
      ELSE 0
    END AS limit_value
  FROM usage_tracking ut
  JOIN plan_limits pl ON pl.plan_name = v_plan_name
  WHERE ut.user_id = p_user_id
    AND ut.period_start = v_period_start;
END;
$$;

----------------------------------------------------------------
-- Service-only: grant free months
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION grant_free_months(
  p_user_id UUID,
  p_months INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_success BOOLEAN := FALSE;
BEGIN
  -- Allow only server key (service_role)
  IF (auth.jwt() ->> 'role') = 'service_role' THEN
    UPDATE subscriptions
    SET plan_override = jsonb_build_object(
      'free_months', p_months,
      'granted_at', NOW(),
      'granted_by', auth.uid()
    ),
    updated_at = NOW()
    WHERE user_id = p_user_id;

    INSERT INTO audit_log (actor, action, target, meta)
    VALUES (auth.uid(), 'grant_free_months', p_user_id::TEXT, jsonb_build_object('months', p_months, 'timestamp', NOW()));

    v_success := TRUE;
  END IF;

  RETURN v_success;
END;
$$;

----------------------------------------------------------------
-- Optional: server-side IP hashing helper (if needed)
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION hash_ip(ip_text TEXT, pepper TEXT)
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT encode(digest(coalesce(ip_text,'') || ':' || coalesce(pepper,''), 'sha256'), 'hex');
$$;
