create table if not exists public.mira_signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  organization text,
  source_path text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists mira_signups_created_at_idx
  on public.mira_signups (created_at desc);

alter table public.mira_signups enable row level security;

create policy "Users can read their own MIRA signup"
  on public.mira_signups for select to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.handle_new_mira_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.mira_signups (
    user_id,
    email,
    full_name,
    organization,
    source_path,
    referrer,
    user_agent
  )
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'organization', ''),
    nullif(new.raw_user_meta_data ->> 'signup_source_path', ''),
    nullif(new.raw_user_meta_data ->> 'signup_referrer', ''),
    nullif(new.raw_user_meta_data ->> 'signup_user_agent', '')
  )
  on conflict (user_id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      organization = excluded.organization,
      source_path = excluded.source_path,
      referrer = excluded.referrer,
      user_agent = excluded.user_agent;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_mira_signup on auth.users;

create trigger on_auth_user_created_mira_signup
  after insert on auth.users
  for each row execute function public.handle_new_mira_signup();
