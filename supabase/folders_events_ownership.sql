-- Folder and event ownership policies
alter table public.folders enable row level security;
alter table public.events enable row level security;

drop policy if exists "Users can create folders" on public.folders;
create policy "Users can create folders" on public.folders
for insert to authenticated
with check (auth.uid() = created_by);

drop policy if exists "Users can update own folders" on public.folders;
create policy "Users can update own folders" on public.folders
for update to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

drop policy if exists "Users can delete own folders" on public.folders;
create policy "Users can delete own folders" on public.folders
for delete to authenticated
using (auth.uid() = created_by);

drop policy if exists "Users can create events" on public.events;
create policy "Users can create events" on public.events
for insert to authenticated
with check (auth.uid() = organizer_id);

drop policy if exists "Users can update own events" on public.events;
create policy "Users can update own events" on public.events
for update to authenticated
using (auth.uid() = organizer_id)
with check (auth.uid() = organizer_id);

drop policy if exists "Users can delete own events" on public.events;
create policy "Users can delete own events" on public.events
for delete to authenticated
using (auth.uid() = organizer_id);
