begin;

create extension if not exists pgcrypto;

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  product_key text not null check (product_key in ('beginner', 'workshop', 'bootcamp')),
  title text not null check (char_length(title) between 3 and 160),
  session_date date not null,
  start_time time not null,
  end_time time not null,
  timezone text not null default 'America/Chicago',
  location_type text not null check (location_type in ('online', 'in_person', 'hybrid')),
  location_name text,
  location_address text,
  meeting_url text,
  capacity integer not null check (capacity > 0 and capacity <= 1000),
  seats_reserved integer not null default 0 check (seats_reserved >= 0 and seats_reserved <= capacity),
  status text not null default 'draft' check (status in ('draft', 'published', 'sold_out', 'cancelled', 'completed')),
  instructor_name text not null default 'Osborn G. Nelson II',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time),
  check (location_type <> 'online' or meeting_url is not null)
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on update cascade on delete restrict,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 20),
  payment_status text not null check (payment_status in ('paid', 'no_payment_required', 'unpaid', 'failed', 'refunded')),
  registration_status text not null default 'confirmed' check (registration_status in ('pending', 'confirmed', 'cancelled', 'waitlisted', 'requires_refund')),
  confirmation_sent_at timestamptz,
  internal_notification_sent_at timestamptz,
  reminder_24h_sent_at timestamptz,
  reminder_2h_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  student_name text not null check (char_length(student_name) between 2 and 100),
  student_role text check (student_role is null or char_length(student_role) <= 100),
  organization text check (organization is null or char_length(organization) <= 140),
  review_text text not null check (char_length(review_text) between 20 and 2000),
  rating integer not null check (rating between 1 and 5),
  photo_url text,
  consent_to_publish boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  featured boolean not null default false,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  check (status <> 'approved' or (consent_to_publish and approved_at is not null))
);

create index if not exists class_sessions_upcoming_idx on public.class_sessions (status, session_date, start_time);
create index if not exists class_sessions_product_idx on public.class_sessions (product_key, status, session_date);
create index if not exists registrations_session_idx on public.registrations (session_id, registration_status);
create index if not exists registrations_reminder_idx on public.registrations (registration_status, reminder_24h_sent_at, reminder_2h_sent_at);
create index if not exists reviews_public_idx on public.reviews (status, featured desc, approved_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists class_sessions_updated_at on public.class_sessions;
create trigger class_sessions_updated_at before update on public.class_sessions for each row execute function public.set_updated_at();
drop trigger if exists registrations_updated_at on public.registrations;
create trigger registrations_updated_at before update on public.registrations for each row execute function public.set_updated_at();

create or replace view public.public_class_sessions
with (security_invoker = true)
as
select
  id, product_key, title, session_date, start_time, end_time, timezone,
  location_type, location_name,
  case when location_type in ('in_person', 'hybrid') then location_address else null end as location_address,
  capacity, seats_reserved, greatest(capacity - seats_reserved, 0) as seats_remaining,
  status, instructor_name
from public.class_sessions
where status in ('published', 'sold_out') and session_date >= current_date;

create or replace view public.public_approved_reviews
with (security_invoker = true)
as
select id, student_name, student_role, organization, review_text, rating, photo_url, featured, approved_at
from public.reviews
where status = 'approved' and consent_to_publish = true;

alter table public.class_sessions enable row level security;
alter table public.registrations enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "published sessions are publicly readable" on public.class_sessions;
create policy "published sessions are publicly readable" on public.class_sessions
for select to anon, authenticated
using (status in ('published', 'sold_out') and session_date >= current_date);

drop policy if exists "approved reviews are publicly readable" on public.reviews;
create policy "approved reviews are publicly readable" on public.reviews
for select to anon, authenticated
using (status = 'approved' and consent_to_publish = true);

revoke all on public.class_sessions, public.registrations, public.reviews from anon, authenticated;
grant select (id, product_key, title, session_date, start_time, end_time, timezone, location_type, location_name, location_address, capacity, seats_reserved, status, instructor_name) on public.class_sessions to anon, authenticated;
grant select (id, student_name, student_role, organization, review_text, rating, photo_url, featured, approved_at) on public.reviews to anon, authenticated;
grant select on public.public_class_sessions, public.public_approved_reviews to anon, authenticated;

create or replace function public.register_paid_checkout(
  p_session_id uuid,
  p_product_key text,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_customer_id text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_quantity integer,
  p_payment_status text
) returns public.registrations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  selected_session public.class_sessions%rowtype;
  registration public.registrations%rowtype;
begin
  if p_quantity is null or p_quantity < 1 or p_quantity > 20 then
    raise exception 'invalid_quantity' using errcode = '22023';
  end if;

  select * into registration from public.registrations where stripe_checkout_session_id = p_checkout_session_id;
  if found then
    return registration;
  end if;

  select * into selected_session from public.class_sessions where id = p_session_id for update;
  if not found or selected_session.product_key <> p_product_key then
    raise exception 'invalid_session' using errcode = '22023';
  end if;
  if selected_session.status not in ('published', 'sold_out') or selected_session.session_date < current_date then
    raise exception 'session_unavailable' using errcode = 'P0001';
  end if;
  if selected_session.seats_reserved + p_quantity > selected_session.capacity then
    insert into public.registrations (
      session_id, stripe_checkout_session_id, stripe_payment_intent_id, stripe_customer_id,
      customer_name, customer_email, customer_phone, quantity, payment_status, registration_status
    ) values (
      p_session_id, p_checkout_session_id, nullif(p_payment_intent_id, ''), nullif(p_customer_id, ''),
      p_customer_name, lower(p_customer_email), nullif(p_customer_phone, ''), p_quantity, p_payment_status, 'requires_refund'
    ) returning * into registration;
    return registration;
  end if;

  insert into public.registrations (
    session_id, stripe_checkout_session_id, stripe_payment_intent_id, stripe_customer_id,
    customer_name, customer_email, customer_phone, quantity, payment_status, registration_status
  ) values (
    p_session_id, p_checkout_session_id, nullif(p_payment_intent_id, ''), nullif(p_customer_id, ''),
    p_customer_name, lower(p_customer_email), nullif(p_customer_phone, ''), p_quantity, p_payment_status, 'confirmed'
  ) returning * into registration;

  update public.class_sessions
  set seats_reserved = seats_reserved + p_quantity,
      status = case when seats_reserved + p_quantity >= capacity then 'sold_out' else status end
  where id = p_session_id;

  return registration;
exception
  when unique_violation then
    select * into registration from public.registrations where stripe_checkout_session_id = p_checkout_session_id;
    return registration;
end;
$$;

create or replace function public.cancel_registration(p_checkout_session_id text, p_payment_status text default 'failed')
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare existing public.registrations%rowtype;
begin
  select * into existing from public.registrations where stripe_checkout_session_id = p_checkout_session_id for update;
  if not found then return false; end if;
  if existing.registration_status = 'cancelled' then return true; end if;
  update public.registrations set registration_status = 'cancelled', payment_status = p_payment_status where id = existing.id;
  update public.class_sessions set seats_reserved = greatest(seats_reserved - existing.quantity, 0), status = case when status = 'sold_out' then 'published' else status end where id = existing.session_id;
  return true;
end;
$$;

revoke all on function public.register_paid_checkout(uuid,text,text,text,text,text,text,text,integer,text) from public, anon, authenticated;
revoke all on function public.cancel_registration(text,text) from public, anon, authenticated;
grant execute on function public.register_paid_checkout(uuid,text,text,text,text,text,text,text,integer,text) to service_role;
grant execute on function public.cancel_registration(text,text) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "no public review photo access" on storage.objects;
create policy "no public review photo access" on storage.objects for select to anon using (false);

commit;

-- Development-only example sessions are intentionally not inserted by this migration.
-- Use the documented local seed command after creating a development Supabase project.
