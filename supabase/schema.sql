-- ============================================================
-- APOSTOLIC MEDIA - SUPABASE DATABASE SCHEMA
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- PROFILES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  language text default 'am',
  country text,
  role text default 'user'
    check (role in ('user', 'creator', 'minister', 'admin', 'super_admin')),
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PRIVILEGED PROFILE FIELD PROTECTION
-- Prevent users from granting themselves admin/creator roles or
-- verification status through direct profile inserts/updates.
-- ============================================================

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$;

grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.guard_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $
begin
  if auth.uid() is not null
     and auth.uid() = new.id
     and not private.is_admin() then
    if tg_op = 'INSERT' then
      if new.role is distinct from 'user'
         or new.is_verified is distinct from false then
        raise exception 'New profiles cannot assign privileged roles or verification status'
          using errcode = '42501';
      end if;
    elsif tg_op = 'UPDATE' then
      if new.role is distinct from old.role
         or new.is_verified is distinct from old.is_verified then
        raise exception 'Only an administrator can change profile role or verification status'
          using errcode = '42501';
      end if;
    end if;
  end if;
  return new;
end;
$;

revoke all on function private.guard_profile_privileged_fields() from public, anon, authenticated;

drop trigger if exists guard_profile_privileged_fields on public.profiles;
create trigger guard_profile_privileged_fields
before insert or update on public.profiles
for each row execute function private.guard_profile_privileged_fields();

-- ============================================================
-- MINISTRIES
-- ============================================================

create table if not exists public.ministries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  logo_url text,
  country text,
  city text,
  website text,
  contact_email text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- FOLDERS
-- ============================================================

create table if not exists public.folders (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  cover_url text,
  parent_id uuid references public.folders(id) on delete cascade,
  language text default 'am',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ARTISTS / MINISTERS
-- ============================================================

create table if not exists public.artists (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text default 'artist',
  bio text,
  avatar_url text,
  country text,
  language text default 'am',
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- SONGS
-- ============================================================

create table if not exists public.songs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist_id uuid references public.artists(id) on delete set null,
  folder_id uuid references public.folders(id) on delete set null,
  ministry_id uuid references public.ministries(id) on delete set null,
  description text,
  cover_url text,
  audio_url text,
  duration_seconds integer,
  language text default 'am',
  category text,
  is_published boolean default false,
  play_count bigint default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- LYRICS
-- ============================================================

create table if not exists public.lyrics (
  id uuid primary key default uuid_generate_v4(),
  song_id uuid not null references public.songs(id) on delete cascade,
  lyrics_text text not null,
  language text default 'am',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TEACHINGS
-- ============================================================

create table if not exists public.teachings (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  content text,
  cover_url text,
  author_id uuid references public.profiles(id) on delete set null,
  language text default 'am',
  category text,
  is_published boolean default false,
  view_count bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- SERMONS
-- ============================================================

create table if not exists public.sermons (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  speaker_id uuid references public.artists(id) on delete set null,
  audio_url text,
  video_url text,
  cover_url text,
  language text default 'am',
  category text,
  duration_seconds integer,
  is_published boolean default false,
  view_count bigint default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- BIBLE STUDIES
-- ============================================================

create table if not exists public.bible_studies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  content text,
  scripture_reference text,
  cover_url text,
  language text default 'am',
  category text,
  author_id uuid references public.profiles(id) on delete set null,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- COURSES
-- ============================================================

create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  cover_url text,
  instructor_id uuid references public.profiles(id) on delete set null,
  language text default 'am',
  level text default 'beginner',
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- COURSE LESSONS
-- ============================================================

create table if not exists public.course_lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  content text,
  video_url text,
  audio_url text,
  lesson_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- VIDEOS
-- ============================================================

create table if not exists public.videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  duration_seconds integer,
  language text default 'am',
  category text,
  creator_id uuid references public.profiles(id) on delete set null,
  is_published boolean default false,
  view_count bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- EVENTS
-- ============================================================

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  location text,
  event_url text,
  cover_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  organizer_id uuid references public.profiles(id) on delete set null,
  ministry_id uuid references public.ministries(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PLAYLISTS
-- ============================================================

create table if not exists public.playlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  cover_url text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.playlist_songs (
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  position integer default 0,
  added_at timestamptz default now(),
  primary key (playlist_id, song_id)
);

-- ============================================================
-- COMMUNITY POSTS
-- ============================================================

create table if not exists public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  content text not null,
  image_url text,
  language text default 'am',
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- COMMENTS
-- ============================================================

create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- LIKES
-- ============================================================

create table if not exists public.likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_type text not null,
  content_id uuid not null,
  created_at timestamptz default now(),
  unique(user_id, content_type, content_id)
);

-- ============================================================
-- SAVED CONTENT
-- ============================================================

create table if not exists public.saved_content (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_type text not null,
  content_id uuid not null,
  created_at timestamptz default now(),
  unique(user_id, content_type, content_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'general',
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- LIVE ROOMS
-- ============================================================

create table if not exists public.live_rooms (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  host_id uuid references public.profiles(id) on delete set null,
  status text default 'scheduled'
    check (status in ('scheduled', 'live', 'ended')),
  stream_url text,
  starts_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Q&A
-- ============================================================

create table if not exists public.questions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  language text default 'am',
  is_answered boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.answers (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- DOWNLOADS
-- ============================================================

create table if not exists public.downloads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_type text not null,
  content_id uuid not null,
  created_at timestamptz default now(),
  unique(user_id, content_type, content_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_songs_artist
  on public.songs(artist_id);

create index if not exists idx_songs_language
  on public.songs(language);

create index if not exists idx_songs_category
  on public.songs(category);

create index if not exists idx_teachings_language
  on public.teachings(language);

create index if not exists idx_sermons_language
  on public.sermons(language);

create index if not exists idx_videos_language
  on public.videos(language);

create index if not exists idx_events_starts_at
  on public.events(starts_at);

create index if not exists idx_notifications_user
  on public.notifications(user_id);

create index if not exists idx_posts_user
  on public.community_posts(user_id);

-- ============================================================
-- PROFILE CREATION TRIGGER
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists songs_updated_at on public.songs;
create trigger songs_updated_at
before update on public.songs
for each row execute procedure public.set_updated_at();

drop trigger if exists teachings_updated_at on public.teachings;
create trigger teachings_updated_at
before update on public.teachings
for each row execute procedure public.set_updated_at();

drop trigger if exists sermons_updated_at on public.sermons;
create trigger sermons_updated_at
before update on public.sermons
for each row execute procedure public.set_updated_at();

drop trigger if exists videos_updated_at on public.videos;
create trigger videos_updated_at
before update on public.videos
for each row execute procedure public.set_updated_at();

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at
before update on public.events
for each row execute procedure public.set_updated_at();

drop trigger if exists community_posts_updated_at on public.community_posts;
create trigger community_posts_updated_at
before update on public.community_posts
for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.ministries enable row level security;
alter table public.folders enable row level security;
alter table public.artists enable row level security;
alter table public.songs enable row level security;
alter table public.lyrics enable row level security;
alter table public.teachings enable row level security;
alter table public.sermons enable row level security;
alter table public.bible_studies enable row level security;
alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.videos enable row level security;
alter table public.events enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;
alter table public.community_posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.saved_content enable row level security;
alter table public.notifications enable row level security;
alter table public.live_rooms enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.downloads enable row level security;

-- ============================================================
-- BASIC PUBLIC READ POLICIES
-- ============================================================

create policy "Public can read published songs"
on public.songs for select
using (is_published = true);

create policy "Public can read lyrics"
on public.lyrics for select
using (true);

create policy "Public can read artists"
on public.artists for select
using (true);

create policy "Public can read published teachings"
on public.teachings for select
using (is_published = true);

create policy "Public can read published sermons"
on public.sermons for select
using (is_published = true);

create policy "Public can read published bible studies"
on public.bible_studies for select
using (is_published = true);

create policy "Public can read published courses"
on public.courses for select
using (is_published = true);

create policy "Public can read course lessons"
on public.course_lessons for select
using (true);

create policy "Public can read published videos"
on public.videos for select
using (is_published = true);

create policy "Public can read events"
on public.events for select
using (true);

create policy "Public can read ministries"
on public.ministries for select
using (true);

create policy "Public can read folders"
on public.folders for select
using (true);

create policy "Public can read live rooms"
on public.live_rooms for select
using (true);

-- ============================================================
-- PROFILE POLICIES
-- ============================================================

create policy "Users can read profiles"
on public.profiles for select
using (true);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- ============================================================
-- PLAYLIST POLICIES
-- ============================================================

create policy "Users can read own playlists"
on public.playlists for select
using (auth.uid() = user_id or is_public = true);

create policy "Users can create own playlists"
on public.playlists for insert
with check (auth.uid() = user_id);

create policy "Users can update own playlists"
on public.playlists for update
using (auth.uid() = user_id);

create policy "Users can delete own playlists"
on public.playlists for delete
using (auth.uid() = user_id);

create policy "Users can manage playlist songs"
on public.playlist_songs for all
using (
  exists (
    select 1
    from public.playlists
    where playlists.id = playlist_songs.playlist_id
    and playlists.user_id = auth.uid()
  )
);

-- ============================================================
-- COMMUNITY POLICIES
-- ============================================================

create policy "Users can read community posts"
on public.community_posts for select
using (is_published = true or auth.uid() = user_id);

create policy "Users can create community posts"
on public.community_posts for insert
with check (auth.uid() = user_id);

create policy "Users can update own community posts"
on public.community_posts for update
using (auth.uid() = user_id);

create policy "Users can delete own community posts"
on public.community_posts for delete
using (auth.uid() = user_id);

create policy "Users can read comments"
on public.comments for select
using (true);

create policy "Users can create comments"
on public.comments for insert
with check (auth.uid() = user_id);

create policy "Users can update own comments"
on public.comments for update
using (auth.uid() = user_id);

create policy "Users can delete own comments"
on public.comments for delete
using (auth.uid() = user_id);

-- ============================================================
-- LIKE / SAVE POLICIES
-- ============================================================

create policy "Users can read likes"
on public.likes for select
using (true);

create policy "Users can manage own likes"
on public.likes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can read saved content"
on public.saved_content for select
using (auth.uid() = user_id);

create policy "Users can manage own saved content"
on public.saved_content for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATION POLICIES
-- ============================================================

create policy "Users can read own notifications"
on public.notifications for select
using (auth.uid() = user_id);

create policy "Users can update own notifications"
on public.notifications for update
using (auth.uid() = user_id);

-- ============================================================
-- QUESTIONS / ANSWERS
-- ============================================================

create policy "Users can read questions"
on public.questions for select
using (true);

create policy "Users can create questions"
on public.questions for insert
with check (auth.uid() = user_id);

create policy "Users can update own questions"
on public.questions for update
using (auth.uid() = user_id);

create policy "Users can read answers"
on public.answers for select
using (true);

create policy "Users can create answers"
on public.answers for insert
with check (auth.uid() = user_id);

-- ============================================================
-- DOWNLOAD POLICIES
-- ============================================================

create policy "Users can manage own downloads"
on public.downloads for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
