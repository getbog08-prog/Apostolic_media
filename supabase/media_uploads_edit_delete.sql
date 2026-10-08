-- Apostolic Media: secure edit/delete ownership for media_uploads
-- Run this once in Supabase SQL Editor after the media_uploads table already exists.

alter table public.media_uploads
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_media_uploads_user_id
  on public.media_uploads(user_id);

alter table public.media_uploads enable row level security;

drop policy if exists "Users can update own media uploads" on public.media_uploads;
create policy "Users can update own media uploads"
on public.media_uploads for update to anon, authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own media uploads" on public.media_uploads;
create policy "Users can delete own media uploads"
on public.media_uploads for delete to anon, authenticated
using (auth.uid() = user_id);
