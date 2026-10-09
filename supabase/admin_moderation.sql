-- Apostolic Media consolidated owner/admin moderation policies.
-- Safe to re-run after schema.sql or earlier moderation-policy scripts.

drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users and admins can update profiles" on public.profiles;
create policy "Users and admins can update profiles"
on public.profiles for update to authenticated
using (id = (select auth.uid()) or private.is_admin())
with check (id = (select auth.uid()) or private.is_admin());

drop policy if exists "Admins can moderate community posts" on public.community_posts;
drop policy if exists "Users can update own posts" on public.community_posts;
drop policy if exists "Users can update own community posts" on public.community_posts;
drop policy if exists "Users and admins can update community posts" on public.community_posts;
create policy "Users and admins can update community posts"
on public.community_posts for update to authenticated
using (user_id = (select auth.uid()) or private.is_admin())
with check (user_id = (select auth.uid()) or private.is_admin());

drop policy if exists "Admins can delete community posts" on public.community_posts;
drop policy if exists "Users can delete own posts" on public.community_posts;
drop policy if exists "Users can delete own community posts" on public.community_posts;
drop policy if exists "Users and admins can delete community posts" on public.community_posts;
create policy "Users and admins can delete community posts"
on public.community_posts for delete to authenticated
using (user_id = (select auth.uid()) or private.is_admin());
