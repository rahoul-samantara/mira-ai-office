create table if not exists public.mira_trials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null check (product_key in ('mira_trial', 'mira_premium')),
  checkout_session_id text not null unique,
  payment_id text unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mira_trials_user_id_created_at_idx
  on public.mira_trials (user_id, created_at desc);

create table if not exists public.mira_webhook_events (
  webhook_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.mira_trials enable row level security;
alter table public.mira_webhook_events enable row level security;

create policy "Users can read their own MIRA trials"
  on public.mira_trials for select to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.activate_mira_trial(
  p_webhook_id text,
  p_event_type text,
  p_checkout_session_id text,
  p_payment_id text,
  p_user_id uuid
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.mira_webhook_events (webhook_id, event_type)
  values (p_webhook_id, p_event_type)
  on conflict (webhook_id) do nothing;

  if not found then return false; end if;

  update public.mira_trials
  set status = 'paid',
      payment_id = p_payment_id,
      starts_at = now(),
      expires_at = now() + interval '48 hours',
      updated_at = now()
  where checkout_session_id = p_checkout_session_id
    and user_id = p_user_id
    and product_key = 'mira_trial';

  if not found then raise exception 'No matching MIRA trial checkout'; end if;
  return true;
end;
$$;

revoke all on function public.activate_mira_trial(text, text, text, text, uuid) from public;
revoke all on function public.activate_mira_trial(text, text, text, text, uuid) from anon;
revoke all on function public.activate_mira_trial(text, text, text, text, uuid) from authenticated;
grant execute on function public.activate_mira_trial(text, text, text, text, uuid) to service_role;