-- Consolidate equivalent permissive RLS policies while preserving access:
-- owners can manage their own rows; administrators can moderate/delete.
drop policy if exists "Public can read media comments" on public.comments;
drop policy if exists "Users can create media comments" on public.comments;
drop policy if exists "Users can delete own posts" on public.community_posts;
drop policy if exists "Users can update own posts" on public.community_posts;
drop policy if exists "Users can update own media uploads" on public.media_uploads;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Users and admins can update profiles" on public.profiles;

create policy "Users and admins can update profiles"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()) or private.is_admin())
with check (id = (select auth.uid()) or private.is_admin());
