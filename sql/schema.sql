-- WIPI schema for Supabase Postgres.
-- Run this in the Supabase SQL editor, or let the app apply it on first use.
-- Connect the app with the session pooler (port 5432), not the transaction pooler (port 6543).

create extension if not exists pgcrypto;

create table if not exists site_settings (
  id smallint primary key default 1 check (id = 1),
  reported_members integer not null default 20000,
  established_year integer not null default 2022,
  text jsonb not null default '{}'::jsonb,
  heroes jsonb not null default '[]'::jsonb,
  images jsonb not null default '{}'::jsonb,
  bank jsonb not null default '{}'::jsonb,
  plans jsonb,
  updated_at timestamptz not null default now()
);

alter table site_settings add column if not exists plans jsonb;

create table if not exists lgas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  members text not null default '',
  coordinator text not null default '',
  phone text not null default '',
  position integer not null
);

create table if not exists partnerships (
  id text primary key,
  name text not null,
  image text not null default '',
  position integer not null
);

create table if not exists gallery_images (
  id text primary key,
  image text not null,
  caption text not null default '',
  category text not null default 'Community',
  position integer not null
);

create table if not exists submissions (
  id uuid primary key,
  type text not null check (type in ('membership', 'contact', 'partner', 'interest')),
  status text not null default 'new' check (status in ('new', 'reviewed')),
  data jsonb not null default '{}'::jsonb,
  payment_screenshot text,
  payment_confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists submissions_created_at_idx on submissions (created_at desc);
create index if not exists submissions_type_idx on submissions (type);

alter table submissions add column if not exists payment_confirmed boolean not null default false;

create table if not exists subscribers (
  id uuid primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists mail_sends (
  id uuid primary key,
  subject text not null,
  recipient_count integer not null,
  sent_at timestamptz not null default now()
);

create index if not exists mail_sends_sent_at_idx on mail_sends (sent_at desc);
