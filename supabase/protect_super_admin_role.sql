-- Protect super-administrator accounts from changes by regular admins.
create or replace function private.guard_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_role text;
begin
  if auth.uid() is null then
    return new;
  end if;

  select p.role into actor_role
  from public.profiles p
  where p.id = auth.uid();

  if tg_op = 'INSERT' then
    if new.role is distinct from 'user'
       or new.is_verified is distinct from false then
      if actor_role is distinct from 'super_admin' then
        raise exception 'Only a super administrator can assign privileged roles or verification status during profile creation'
          using errcode = '42501';
      end if;
    end if;
  elsif tg_op = 'UPDATE' then
    if new.role is distinct from old.role
       or new.is_verified is distinct from old.is_verified then
      if coalesce(actor_role, '') not in ('admin', 'super_admin') then
        raise exception 'Only an administrator can change profile role or verification status'
          using errcode = '42501';
      end if;

      if actor_role <> 'super_admin'
         and (old.role = 'super_admin' or new.role = 'super_admin') then
        raise exception 'Only a super administrator can change a super-administrator role'
          using errcode = '42501';
      end if;

      if auth.uid() = new.id and actor_role <> 'super_admin' then
        raise exception 'Administrators cannot change their own role or verification status'
          using errcode = '42501';
      end if;
    end if;
  end if;

  return new;
end;
$$;

revoke execute on function private.guard_profile_privileged_fields() from public, anon, authenticated;
revoke execute on function private.handle_new_user() from public, anon, authenticated;
