-- Enable needed extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  locale TEXT DEFAULT 'de',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  text TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  consent_text_snapshot TEXT,
  submitted_ip_hash TEXT,
  submitted_user_agent TEXT,
  approved_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  anonymized_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT testimonials_approved_time_chk
    CHECK (
      (status = 'approved' AND approved_at IS NOT NULL)
      OR (status <> 'approved' AND approved_at IS NULL)
    )
);
CREATE INDEX IF NOT EXISTS idx_testimonials_campaign_id ON testimonials(campaign_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved_at ON testimonials(approved_at DESC);

-- Widget settings table
CREATE TABLE IF NOT EXISTS widget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID UNIQUE NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  display_limit INT DEFAULT 6 CHECK (display_limit > 0 AND display_limit <= 50),
  order_by TEXT DEFAULT 'approved_at_desc'
    CHECK (order_by IN ('approved_at_desc','approved_at_asc','rating_desc','rating_asc','random')),
  show_rating BOOLEAN DEFAULT true,
  show_date BOOLEAN DEFAULT true,
  primary_color TEXT DEFAULT '#3B82F6',
  background_color TEXT DEFAULT '#FFFFFF',
  text_color TEXT DEFAULT '#1F2937',
  border_radius INT DEFAULT 8 CHECK (border_radius >= 0 AND border_radius <= 20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email sends
CREATE TABLE IF NOT EXISTS email_sends (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  template TEXT NOT NULL,
  to_email TEXT NOT NULL,
  message_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','failed','bounced','complained')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_sends_user_id ON email_sends(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_to_email ON email_sends(to_email);
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);

-- Email unsubscribes
CREATE TABLE IF NOT EXISTS email_unsubscribes (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promotions
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage','fixed')),
  value INT NOT NULL CHECK (value > 0),
  expires_at TIMESTAMPTZ,
  max_redemptions INT,
  current_redemptions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- QR codes
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  public_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  design JSONB DEFAULT '{"color":"#000000","background":"#FFFFFF","errorCorrectionLevel":"H","margin":4,"size":1024}'::jsonb,
  file_url_svg TEXT,
  file_url_png TEXT,
  file_url_pdf TEXT,
  scan_count INT DEFAULT 0,
  last_scanned_at TIMESTAMPTZ,
  utm_source TEXT DEFAULT 'qr',
  utm_medium TEXT DEFAULT 'offline',
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_campaign_id ON qr_codes(campaign_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_public_id ON qr_codes(public_id);

-- QR scans
CREATE TABLE IF NOT EXISTS qr_scans (
  id BIGSERIAL PRIMARY KEY,
  qr_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  referer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  utm JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_id ON qr_scans(qr_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_created_at ON qr_scans(created_at DESC);

-- Subscriptions (Stripe)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan_name TEXT CHECK (plan_name IN ('starter','pro','business')),
  status TEXT DEFAULT 'trialing' CHECK (status IN ('trialing','active','canceled','incomplete','past_due','unpaid')),
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  plan_override JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Plan limits
CREATE TABLE IF NOT EXISTS plan_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT UNIQUE NOT NULL CHECK (plan_name IN ('starter','pro','business')),
  max_campaigns INT NOT NULL,
  max_testimonials_per_campaign INT NOT NULL,
  max_widget_requests_per_day INT NOT NULL,
  max_qr_codes INT NOT NULL,
  max_qr_scans_per_month INT NOT NULL,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed plan limits
INSERT INTO plan_limits (plan_name, max_campaigns, max_testimonials_per_campaign, max_widget_requests_per_day, max_qr_codes, max_qr_scans_per_month, features) VALUES
('starter',   2,   50,   1000,   5,     500,   '{"csv_export":false,"custom_widget_styling":false,"white_label":false,"api_access":false,"priority_support":false}'),
('pro',      10,  500,  10000,  50,    5000,  '{"csv_export":true,"custom_widget_styling":true,"white_label":false,"api_access":false,"priority_support":false}'),
('business', 999999, 999999, 100000, 999999, 999999, '{"csv_export":true,"custom_widget_styling":true,"white_label":true,"api_access":true,"priority_support":true}')
ON CONFLICT (plan_name) DO NOTHING;

-- Usage tracking (monthly buckets; widget_requests will be aggregated daily in app)
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('widget_requests','qr_scans','testimonials_collected')),
  count INT DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, metric_type, period_start)
);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- TTDSG Consent Log
CREATE TABLE IF NOT EXISTS consent_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash TEXT NOT NULL,
  user_agent TEXT,
  consent_given BOOLEAN NOT NULL,
  categories JSONB NOT NULL DEFAULT '{}'::jsonb,
  consent_text_snapshot TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_consent_log_user_id ON consent_log(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_log_created_at ON consent_log(created_at DESC);

-- updated_at triggers helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_widget_settings_updated_at ON widget_settings;
CREATE TRIGGER update_widget_settings_updated_at
  BEFORE UPDATE ON widget_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usage_tracking_updated_at ON usage_tracking;
CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
