-- Only admins may publish uploaded media. Owners can still edit their metadata.
create or replace function private.guard_media_upload_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and not private.is_admin() then
    if tg_op = 'INSERT' and new.is_published is distinct from false then
      raise exception 'Only an administrator can publish media'
        using errcode = '42501';
    elsif tg_op = 'UPDATE' and new.is_published is distinct from old.is_published then
      raise exception 'Only an administrator can change media publication status'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function private.guard_media_upload_publication() from public, anon, authenticated;
drop trigger if exists guard_media_upload_publication on public.media_uploads;
create trigger guard_media_upload_publication
before insert or update on public.media_uploads
for each row execute function private.guard_media_upload_publication();

drop policy if exists "Admins can delete media from bucket" on storage.objects;
create policy "Admins can delete media from bucket"
on storage.objects
for delete
to authenticated
using (bucket_id = 'Apostolic_Media' and private.is_admin());
