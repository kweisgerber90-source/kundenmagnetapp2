-- Seed data for development and testing
-- This file should NOT be run in production

-- Note: This assumes you have at least one user created via Supabase Auth
-- You can create a test user via the Supabase dashboard or Auth API

-- Example test data (uncomment and modify as needed)
/*
-- Insert a test profile (replace with your auth user ID)
INSERT INTO profiles (id, email, name, locale)
VALUES (
  'YOUR-AUTH-USER-ID-HERE',
  'test@kundenmagnet-app.de',
  'Test User',
  'de'
) ON CONFLICT (id) DO NOTHING;

-- Insert test campaigns
INSERT INTO campaigns (user_id, name, slug, status) VALUES
  ('YOUR-AUTH-USER-ID-HERE', 'Mein Restaurant', 'mein-restaurant', 'active'),
  ('YOUR-AUTH-USER-ID-HERE', 'Online Shop 2024', 'online-shop-2024', 'active');

-- Insert test testimonials
WITH campaign AS (
  SELECT id FROM campaigns WHERE slug = 'mein-restaurant' LIMIT 1
)
INSERT INTO testimonials (campaign_id, name, email, text, rating, status, approved_at) 
SELECT 
  campaign.id,
  name,
  email,
  text,
  rating,
  status,
  CASE WHEN status = 'approved' THEN NOW() - INTERVAL '1 day' * ROW_NUMBER() OVER () ELSE NULL END
FROM campaign,
(VALUES
  ('Max Müller', 'max@example.com', 'Ausgezeichnetes Essen und toller Service! Sehr zu empfehlen.', 5, 'approved'),
  ('Anna Schmidt', 'anna@example.com', 'Gemütliche Atmosphäre und leckere Gerichte. Komme gerne wieder!', 4, 'approved'),
  ('Peter Weber', 'peter@example.com', 'Das beste Restaurant in der Stadt! Freundliches Personal.', 5, 'approved'),
  ('Lisa Meyer', null, 'Sehr gutes Preis-Leistungs-Verhältnis.', 4, 'pending'),
  ('Tom Wagner', 'tom@example.com', 'Nette Bedienung, aber das Essen war nur mittelmäßig.', 3, 'hidden')
) AS t(name, email, text, rating, status);

-- Insert widget settings for test campaign
INSERT INTO widget_settings (campaign_id, theme, limit, order_by)
SELECT id, 'light', 6, 'approved_at_desc'
FROM campaigns
WHERE slug = 'mein-restaurant';

-- Insert test QR code
INSERT INTO qr_codes (user_id, campaign_id, public_id, title, utm_campaign)
SELECT 
  'YOUR-AUTH-USER-ID-HERE',
  id,
  'test-qr-' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8),
  'Tischaufsteller Restaurant',
  'restaurant-tisch'
FROM campaigns
WHERE slug = 'mein-restaurant'
LIMIT 1;

-- Insert test subscription (Pro plan)
INSERT INTO subscriptions (
  user_id, 
  plan_name, 
  status, 
  trial_ends_at, 
  current_period_start, 
  current_period_end
)
VALUES (
  'YOUR-AUTH-USER-ID-HERE',
  'pro',
  'trialing',
  NOW() + INTERVAL '14 days',
  NOW(),
  NOW() + INTERVAL '14 days'
) ON CONFLICT (user_id) DO NOTHING;
*/