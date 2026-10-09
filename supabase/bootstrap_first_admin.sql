-- One-time bootstrap for the first trusted Apostolic Media administrator.
-- Replace the placeholder with the email address of the account you control,
-- then run this script in Supabase SQL Editor as the project owner.
-- Do not use an email address belonging to someone else.

do $$
declare
  admin_email text := 'REPLACE_WITH_THE_TRUSTED_ACCOUNT_EMAIL';
  target_user_id uuid;
  target_name text;
begin
  if admin_email = 'REPLACE_WITH_THE_TRUSTED_ACCOUNT_EMAIL' then
    raise exception 'Edit admin_email to the trusted account email before running this script';
  end if;

  select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1))
    into target_user_id, target_name
  from auth.users u
  where lower(u.email) = lower(admin_email)
  limit 1;

  if target_user_id is null then
    raise exception 'No Supabase Auth user found for the configured email. Create the account first.';
  end if;

  insert into public.profiles (id, full_name, role, is_verified)
  values (target_user_id, target_name, 'super_admin', true)
  on conflict (id) do update
    set role = 'super_admin',
        is_verified = true,
        updated_at = now();
end;
$$;
