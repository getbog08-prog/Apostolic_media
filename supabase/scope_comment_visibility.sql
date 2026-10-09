drop policy if exists "Comments are public to read" on public.comments;
drop policy if exists "Users can read comments" on public.comments;
create policy "Read comments on accessible content"
on public.comments
for select
to anon, authenticated
using (
  user_id = (select auth.uid())
  or (
    post_id is not null
    and exists (
      select 1 from public.community_posts p
      where p.id = comments.post_id
        and (p.is_published = true or p.user_id = (select auth.uid()) or private.is_admin())
    )
  )
  or (
    media_id is not null
    and exists (
      select 1 from public.media_uploads m
      where m.id = comments.media_id
        and (m.is_published = true or m.user_id = (select auth.uid()) or private.is_admin())
    )
  )
);
