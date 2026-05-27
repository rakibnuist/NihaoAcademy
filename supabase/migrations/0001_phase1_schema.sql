-- ============================================================
-- NiHao Academy — Phase 1 Schema
-- Migration: 0001_phase1_schema.sql
--
-- Run this in the Supabase SQL editor or via `supabase db push`.
-- Tables follow the dev guide Section 6.1 exactly.
-- All timestamps are stored as timestamptz (UTC).
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ─────────────────────────────────────────────────────────────────────
do $$ begin
  create type student_status      as enum ('active', 'inactive', 'suspended');
  create type enrollment_status   as enum ('pending', 'active', 'completed', 'cancelled');
  create type fee_status          as enum ('unpaid', 'partial', 'paid');
  create type payment_method      as enum ('bkash', 'nagad', 'card', 'cash', 'other');
  create type payment_status      as enum ('pending', 'success', 'failed', 'refunded');
  create type division            as enum ('live', 'recorded');
  create type instructor_role     as enum ('instructor', 'admin');
exception
  when duplicate_object then null;
end $$;

-- ── students ──────────────────────────────────────────────────────────────────
-- Linked 1-to-1 with auth.users via the same UUID.
create table if not exists public.students (
  id                uuid          primary key references auth.users(id) on delete cascade,
  full_name         text          not null,
  phone             text          not null unique,
  email             text,
  status            student_status not null default 'active',
  marketing_source  text,
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now()
);

comment on table public.students is 'One row per enrolled student, linked to auth.users.';

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger students_updated_at
  before update on public.students
  for each row execute procedure public.set_updated_at();

-- ── instructors ───────────────────────────────────────────────────────────────
create table if not exists public.instructors (
  id          uuid          primary key default uuid_generate_v4(),
  full_name   text          not null,
  phone       text          not null unique,
  subject     text,
  role        instructor_role not null default 'instructor',
  created_at  timestamptz   not null default now()
);

comment on table public.instructors is 'Staff who teach or administer courses.';

-- ── batches ───────────────────────────────────────────────────────────────────
create table if not exists public.batches (
  id              uuid          primary key default uuid_generate_v4(),
  course_slug     text          not null,          -- matches courses.ts slug
  name            text          not null,           -- e.g. "Engineering CSCA — Batch A"
  division        division      not null,
  start_date      date,
  schedule        text,                             -- human-readable, e.g. "Mon·Wed·Fri 7PM"
  instructor_id   uuid          references public.instructors(id) on delete set null,
  is_active       boolean       not null default true,
  capacity        integer       not null default 20,
  created_at      timestamptz   not null default now()
);

comment on table public.batches is 'A running cohort of a course — one per schedule/division.';

create index if not exists batches_course_slug_idx on public.batches(course_slug);
create index if not exists batches_active_idx on public.batches(is_active) where is_active = true;

-- ── enrollments ───────────────────────────────────────────────────────────────
create table if not exists public.enrollments (
  id            uuid              primary key default uuid_generate_v4(),
  student_id    uuid              not null references public.students(id) on delete cascade,
  batch_id      uuid              not null references public.batches(id) on delete cascade,
  status        enrollment_status not null default 'pending',
  fee_status    fee_status        not null default 'unpaid',
  enrolled_at   timestamptz       not null default now(),
  notes         text,
  unique(student_id, batch_id)
);

comment on table public.enrollments is 'Which student is in which batch, and their payment status.';

create index if not exists enrollments_student_idx on public.enrollments(student_id);
create index if not exists enrollments_batch_idx   on public.enrollments(batch_id);

-- ── payments ──────────────────────────────────────────────────────────────────
create table if not exists public.payments (
  id          uuid            primary key default uuid_generate_v4(),
  student_id  uuid            not null references public.students(id) on delete cascade,
  amount      numeric(10, 2)  not null check (amount > 0),
  method      payment_method  not null,
  purpose     text            not null,   -- e.g. "Engineering CSCA Batch A — full fee"
  status      payment_status  not null default 'pending',
  paid_at     timestamptz,
  receipt_no  text,
  created_at  timestamptz     not null default now()
);

comment on table public.payments is 'All payment records, manual and gateway.';

create index if not exists payments_student_idx on public.payments(student_id);
create index if not exists payments_status_idx  on public.payments(status);

-- ── attendance ────────────────────────────────────────────────────────────────
create table if not exists public.attendance (
  id          uuid        primary key default uuid_generate_v4(),
  student_id  uuid        not null references public.students(id) on delete cascade,
  batch_id    uuid        not null references public.batches(id) on delete cascade,
  class_date  date        not null,
  present     boolean     not null default false,
  marked_by   uuid        references public.instructors(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique(student_id, batch_id, class_date)
);

comment on table public.attendance is 'Per-student, per-class attendance records.';

create index if not exists attendance_student_idx on public.attendance(student_id);
create index if not exists attendance_batch_idx   on public.attendance(batch_id);

-- ── announcements ─────────────────────────────────────────────────────────────
create table if not exists public.announcements (
  id          uuid        primary key default uuid_generate_v4(),
  batch_id    uuid        references public.batches(id) on delete cascade,  -- null = site-wide
  title       text        not null,
  body        text        not null,
  created_by  uuid        not null references public.instructors(id) on delete restrict,
  created_at  timestamptz not null default now()
);

comment on table public.announcements is 'Batch-specific or site-wide announcements.';

create index if not exists announcements_batch_idx on public.announcements(batch_id);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.students      enable row level security;
alter table public.instructors   enable row level security;
alter table public.batches       enable row level security;
alter table public.enrollments   enable row level security;
alter table public.payments      enable row level security;
alter table public.attendance    enable row level security;
alter table public.announcements enable row level security;

-- ── students RLS ──────────────────────────────────────────────────────────────
-- Students can read and update only their own row.
create policy "students: own row read"
  on public.students for select
  using (auth.uid() = id);

create policy "students: own row update"
  on public.students for update
  using (auth.uid() = id);

-- Service-role (admin API routes) bypasses RLS automatically.

-- ── batches RLS ───────────────────────────────────────────────────────────────
-- Anyone (including anonymous) can read active batches (public course info).
create policy "batches: public read active"
  on public.batches for select
  using (is_active = true);

-- ── enrollments RLS ───────────────────────────────────────────────────────────
-- Students can read only their own enrollments.
create policy "enrollments: own read"
  on public.enrollments for select
  using (auth.uid() = student_id);

-- ── payments RLS ──────────────────────────────────────────────────────────────
-- Students can read only their own payments.
create policy "payments: own read"
  on public.payments for select
  using (auth.uid() = student_id);

-- ── attendance RLS ────────────────────────────────────────────────────────────
-- Students can read their own attendance.
create policy "attendance: own read"
  on public.attendance for select
  using (auth.uid() = student_id);

-- ── announcements RLS ─────────────────────────────────────────────────────────
-- Students can read announcements for batches they're enrolled in,
-- plus site-wide announcements (batch_id is null).
create policy "announcements: enrolled or global read"
  on public.announcements for select
  using (
    batch_id is null
    or exists (
      select 1 from public.enrollments e
      where e.batch_id = announcements.batch_id
        and e.student_id = auth.uid()
        and e.status = 'active'
    )
  );

-- ── instructors RLS ───────────────────────────────────────────────────────────
-- Instructors table is admin-only; no public read.
-- (Admins use service-role key which bypasses RLS.)

-- ============================================================
-- Auto-create student profile on first OTP login
-- ============================================================
-- When a new user is created in auth.users, insert a skeleton students row.
-- The user will fill in full_name later in the onboarding flow.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.students (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student'),
    coalesce(new.phone, new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
