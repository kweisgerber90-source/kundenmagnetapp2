-- supabase/migrations/006_qr_storage_service_role.sql
-- 🔒 Service-Role-Policy für bestehenden Bucket 'qr-codes'
-- 🛡️ USING + WITH CHECK, damit nur service_role Vollzugriff hat (Server-API).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND polname = 'qr_service_all'
  ) THEN
    CREATE POLICY "qr_service_all"
      ON storage.objects
      FOR ALL
      USING (bucket_id = 'qr-codes' AND auth.role() = 'service_role')
      WITH CHECK (bucket_id = 'qr-codes' AND auth.role() = 'service_role');
  END IF;
END $$;
