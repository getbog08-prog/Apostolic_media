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
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.guard_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

revoke all on function private.guard_profile_privileged_fields() from public, anon, authenticated;

drop trigger if exists guard_profile_privileged_fields on public.profiles;
create trigger guard_profile_privileged_fields
before insert or update on public.profiles
for each row execute function private.guard_profile_privileged_fields();
