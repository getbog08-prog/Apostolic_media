-- Align the connected schema with fields used by the profile and community UI.
alter table public.profiles
  add column if not exists username text,
  add column if not exists bio text,
  add column if not exists language text not null default 'am',
  add column if not exists country text,
  add column if not exists is_verified boolean not null default false;

create unique index if not exists profiles_username_unique
  on public.profiles (username)
  where username is not null;

alter table public.community_posts
  add column if not exists image_url text,
  add column if not exists language text not null default 'am';
