-- Apostolic Media secure admin moderation policies
-- Run once in Supabase SQL Editor.

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles for update
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

drop policy if exists "Admins can moderate community posts" on public.community_posts;
create policy "Admins can moderate community posts"
on public.community_posts for update
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

drop policy if exists "Admins can delete community posts" on public.community_posts;
create policy "Admins can delete community posts"
on public.community_posts for delete
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));
