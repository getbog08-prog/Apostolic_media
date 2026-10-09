-- Require admin approval before community posts become public.
alter table public.community_posts alter column is_published set default false;

create or replace function private.guard_community_post_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and not private.is_admin() then
    if tg_op = 'INSERT' and new.is_published is distinct from false then
      raise exception 'Only an administrator can publish community posts'
        using errcode = '42501';
    elsif tg_op = 'UPDATE' and new.is_published is distinct from old.is_published then
      raise exception 'Only an administrator can change community post publication status'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function private.guard_community_post_publication() from public, anon, authenticated;
drop trigger if exists guard_community_post_publication on public.community_posts;
create trigger guard_community_post_publication
before insert or update on public.community_posts
for each row execute function private.guard_community_post_publication();
