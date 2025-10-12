-- Enable RLS on all tables (идемпотентно)
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns           ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials        ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends         ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_unsubscribes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans            ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_limits         ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking      ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_log         ENABLE ROW LEVEL SECURITY;

----------------------------------------------------------------
-- profiles
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile"   ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

----------------------------------------------------------------
-- campaigns
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own campaigns" ON campaigns;
CREATE POLICY "Users can create own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own campaigns" ON campaigns;
CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id);

----------------------------------------------------------------
-- testimonials
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view testimonials for own campaigns" ON testimonials;
CREATE POLICY "Users can view testimonials for own campaigns"
  ON testimonials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = testimonials.campaign_id
        AND campaigns.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Public can view approved testimonials" ON testimonials;
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  USING (status = 'approved' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public can create testimonials (pending only)" ON testimonials;
CREATE POLICY "Public can create testimonials (pending only)"
  ON testimonials FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND approved_at IS NULL
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS "Users can update testimonials for own campaigns" ON testimonials;
CREATE POLICY "Users can update testimonials for own campaigns"
  ON testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = testimonials.campaign_id
        AND campaigns.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete testimonials for own campaigns" ON testimonials;
CREATE POLICY "Users can delete testimonials for own campaigns"
  ON testimonials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = testimonials.campaign_id
        AND campaigns.user_id = auth.uid()
    )
  );

----------------------------------------------------------------
-- widget_settings
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view widget settings for own campaigns" ON widget_settings;
CREATE POLICY "Users can view widget settings for own campaigns"
  ON widget_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = widget_settings.campaign_id
        AND campaigns.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create widget settings for own campaigns" ON widget_settings;
CREATE POLICY "Users can create widget settings for own campaigns"
  ON widget_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = widget_settings.campaign_id
        AND campaigns.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update widget settings for own campaigns" ON widget_settings;
CREATE POLICY "Users can update widget settings for own campaigns"
  ON widget_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = widget_settings.campaign_id
        AND campaigns.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete widget settings for own campaigns" ON widget_settings;
CREATE POLICY "Users can delete widget settings for own campaigns"
  ON widget_settings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = widget_settings.campaign_id
        AND campaigns.user_id = auth.uid()
    )
  );

----------------------------------------------------------------
-- email_sends
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own email sends" ON email_sends;
CREATE POLICY "Users can view own email sends"
  ON email_sends FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can insert email sends" ON email_sends;
CREATE POLICY "Service role can insert email sends"
  ON email_sends FOR INSERT
  WITH CHECK (true);

----------------------------------------------------------------
-- email_unsubscribes
----------------------------------------------------------------
DROP POLICY IF EXISTS "Service role can manage email unsubscribes" ON email_unsubscribes;
CREATE POLICY "Service role can manage email unsubscribes"
  ON email_unsubscribes FOR ALL
  USING (true)
  WITH CHECK (true);

----------------------------------------------------------------
-- promotions
----------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view active promotions" ON promotions;
CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  USING (expires_at IS NULL OR expires_at > NOW());

----------------------------------------------------------------
-- audit_log
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own audit entries" ON audit_log;
CREATE POLICY "Users can view own audit entries"
  ON audit_log FOR SELECT
  USING (auth.uid() = actor);

DROP POLICY IF EXISTS "Service role can insert audit entries" ON audit_log;
CREATE POLICY "Service role can insert audit entries"
  ON audit_log FOR INSERT
  WITH CHECK (true);

----------------------------------------------------------------
-- qr_codes
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own QR codes" ON qr_codes;
CREATE POLICY "Users can view own QR codes"
  ON qr_codes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create QR codes" ON qr_codes;
CREATE POLICY "Users can create QR codes"
  ON qr_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own QR codes" ON qr_codes;
CREATE POLICY "Users can update own QR codes"
  ON qr_codes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own QR codes" ON qr_codes;
CREATE POLICY "Users can delete own QR codes"
  ON qr_codes FOR DELETE
  USING (auth.uid() = user_id);

----------------------------------------------------------------
-- qr_scans
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view scans for own QR codes" ON qr_scans;
CREATE POLICY "Users can view scans for own QR codes"
  ON qr_scans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM qr_codes
      WHERE qr_codes.id = qr_scans.qr_id
        AND qr_codes.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role can insert QR scans" ON qr_scans;
CREATE POLICY "Service role can insert QR scans"
  ON qr_scans FOR INSERT
  WITH CHECK (true);

----------------------------------------------------------------
-- subscriptions
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

----------------------------------------------------------------
-- plan_limits
----------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view plan limits" ON plan_limits;
CREATE POLICY "Anyone can view plan limits"
  ON plan_limits FOR SELECT
  USING (true);

----------------------------------------------------------------
-- usage_tracking
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own usage" ON usage_tracking;
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage usage tracking" ON usage_tracking;
CREATE POLICY "Service role can manage usage tracking"
  ON usage_tracking FOR ALL
  USING (true)
  WITH CHECK (true);

----------------------------------------------------------------
-- consent_log (TTDSG)
----------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own consent logs" ON consent_log;
CREATE POLICY "Users can view own consent logs"
  ON consent_log FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can insert consent logs" ON consent_log;
CREATE POLICY "Anyone can insert consent logs"
  ON consent_log FOR INSERT
  WITH CHECK (true);
