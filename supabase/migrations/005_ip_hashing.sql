-- 2D: IP hashing (hex sha256 of ip + pepper), forbid raw IP storage
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper (на будущее, в БД можно не использовать; основное хэширование делаем на сервере)
CREATE OR REPLACE FUNCTION hash_ip(ip_text TEXT, pepper TEXT)
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT encode(digest(coalesce(ip_text,'') || ':' || coalesce(pepper,''), 'sha256'), 'hex');
$$;

-- 0) Очистка существующих "плохих" значений перед наложением CHECK
--    В consent_log значение обязательно, поэтому заменим все невалидные/NULL на случайный 64-hex,
--    чтобы разорвать любую связь с исходным IP (не хэшируем старое значение).
UPDATE consent_log
SET ip_hash = encode(gen_random_bytes(32), 'hex')
WHERE ip_hash IS NULL OR ip_hash !~ '^[0-9a-f]{64}$';

-- В testimonials/qr_scans поле может быть NULL — проще занулить невалидные значения.
UPDATE testimonials
SET submitted_ip_hash = NULL
WHERE submitted_ip_hash IS NOT NULL AND submitted_ip_hash !~ '^[0-9a-f]{64}$';

UPDATE qr_scans
SET ip_hash = NULL
WHERE ip_hash IS NOT NULL AND ip_hash !~ '^[0-9a-f]{64}$';

-- 1) Снимаем старые CHECK (если есть)
ALTER TABLE consent_log    DROP CONSTRAINT IF EXISTS consent_log_ip_hash_format_chk;
ALTER TABLE testimonials   DROP CONSTRAINT IF EXISTS testimonials_ip_hash_format_chk;
ALTER TABLE qr_scans       DROP CONSTRAINT IF EXISTS qr_scans_ip_hash_format_chk;

-- 2) Накладываем строгие CHECK-ограничения
ALTER TABLE consent_log
  ADD CONSTRAINT consent_log_ip_hash_format_chk
  CHECK (ip_hash ~ '^[0-9a-f]{64}$');

ALTER TABLE testimonials
  ADD CONSTRAINT testimonials_ip_hash_format_chk
  CHECK (submitted_ip_hash IS NULL OR submitted_ip_hash ~ '^[0-9a-f]{64}$');

ALTER TABLE qr_scans
  ADD CONSTRAINT qr_scans_ip_hash_format_chk
  CHECK (ip_hash IS NULL OR ip_hash ~ '^[0-9a-f]{64}$');
