-- Lock media uploads to a user's own folder and cap public media uploads.
-- The bucket remains public for playback through public media URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'Apostolic_Media',
  'Apostolic_Media',
  true,
  262144000,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'audio/wav',
    'audio/webm',
    'audio/aac',
    'audio/flac',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'application/pdf'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated can upload to Apostolic Media" on storage.objects;
create policy "Authenticated can upload to Apostolic Media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'Apostolic_Media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
