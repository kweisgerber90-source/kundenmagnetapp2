-- Storage buckets setup
-- Run this after the main migrations

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonial-photos',
  'testimonial-photos',
  true, -- Public bucket for testimonial photos
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'qr-codes',
  'qr-codes',
  false, -- Private bucket, served via signed URLs
  10485760, -- 10MB limit
  ARRAY['image/svg+xml', 'image/png', 'application/pdf']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for testimonial-photos bucket
CREATE POLICY "Anyone can view testimonial photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonial-photos');

CREATE POLICY "Users can upload testimonial photos for their campaigns"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'testimonial-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own testimonial photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'testimonial-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own testimonial photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'testimonial-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for qr-codes bucket
CREATE POLICY "Users can view own QR codes"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'qr-codes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload own QR codes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'qr-codes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own QR codes"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'qr-codes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own QR codes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'qr-codes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );