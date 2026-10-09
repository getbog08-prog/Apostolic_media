alter table public.profiles
  add column if not exists username text,
  add column if not exists bio text,
  add column if not exists language text not null default 'am',
  add column if not exists country text,
  add column if not exists is_verified boolean not null default false;
alter table public.community_posts
  add column if not exists image_url text,
  add column if not exists language text not null default 'am';
alter table public.media_uploads alter column is_published set default false;
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'comments_exactly_one_target'
      and conrelid = 'public.comments'::regclass
  ) then
    alter table public.comments
      add constraint comments_exactly_one_target
      check ((post_id is not null) <> (media_id is not null)) not valid;
  end if;
end;
$$;
alter table public.comments validate constraint comments_exactly_one_target;