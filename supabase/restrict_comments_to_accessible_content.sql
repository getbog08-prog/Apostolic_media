-- Applied to the connected project as migration restrict_comments_to_accessible_content.
-- Safe to rerun: replaces only this named restrictive policy.
drop policy if exists "Restrict comments to accessible content" on public.comments;
create policy "Restrict comments to accessible content"
on public.comments
as restrictive
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and (
    (
      post_id is not null
      and exists (
        select 1 from public.community_posts p
        where p.id = comments.post_id
          and (p.is_published = true or p.user_id = (select auth.uid()) or private.is_admin())
      )
    )
    or
    (
      media_id is not null
      and exists (
        select 1 from public.media_uploads m
        where m.id = comments.media_id
          and (m.is_published = true or m.user_id = (select auth.uid()) or private.is_admin())
      )
    )
  )
);
