-- ============================
-- QR Storage: Bucket & Policies
-- ============================

-- 1) Private Bucket anlegen (id = name = 'qr-codes')
insert into storage.buckets (id, name, public)
values ('qr-codes', 'qr-codes', false)
on conflict (id) do nothing;

-- 2) RLS-Policies
-- Hinweis: storage.objects hat bereits RLS aktiv.

-- (optional) Alte Policies mit gleichem Namen entfernen, falls existieren
drop policy if exists "qr_codes_service_all" on storage.objects;
drop policy if exists "qr_codes_select_own" on storage.objects;

-- 2a) Service-Role darf alles (für Server-Routen mit Service-Key)
create policy "qr_codes_service_all"
on storage.objects
for all
to service_role
using (bucket_id = 'qr-codes')
with check (bucket_id = 'qr-codes');

-- 2b) Authentifizierte Nutzer dürfen NUR eigene Dateien lesen:
-- Wir speichern Dateien unter dem Pfad: {user_id}/{public_id}.svg
create policy "qr_codes_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'qr-codes'
  and position(auth.uid()::text || '/' in name) = 1
);

-- (Kein Insert/Update/Delete für authenticated/anon; Uploads macht nur Server via Service-Role)
comment on table storage.objects is 'Private QR bucket (qr-codes). Files are server-generated; users may only read their own paths {user_id}/...';
