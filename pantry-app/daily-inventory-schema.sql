-- Pantry inventory schema update
-- Goal:
-- 1) Stock is enum-only: in_stock | low_stock | out_of_stock
-- 2) Availability is per day of week (0=Sun ... 6=Sat)
-- 3) No quantity_available column anywhere

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'stock_status'
      and n.nspname = 'public'
  ) then
    create type public.stock_status as enum ('in_stock', 'low_stock', 'out_of_stock');
  end if;
end $$;

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  item_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.ingredients
  add column if not exists item_tags text[] not null default '{}';

create table if not exists public.daily_inventory (
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  stock_status public.stock_status not null default 'out_of_stock',
  updated_at timestamptz not null default now(),
  primary key (ingredient_id, day_of_week)
);

alter table public.daily_inventory
  add column if not exists stock_status public.stock_status not null default 'out_of_stock';

alter table public.daily_inventory
  add column if not exists updated_at timestamptz not null default now();

alter table public.daily_inventory
  drop column if exists quantity_available;

create index if not exists daily_inventory_day_idx
  on public.daily_inventory(day_of_week);

create index if not exists daily_inventory_status_idx
  on public.daily_inventory(stock_status);

-- Backfill: if ingredient-level status exists, copy it to all 7 days where missing.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'ingredients'
      and column_name = 'stock_status'
  ) then
    insert into public.daily_inventory (ingredient_id, day_of_week, stock_status)
    select i.id, d.day, i.stock_status::public.stock_status
    from public.ingredients i
    cross join (values (0), (1), (2), (3), (4), (5), (6)) as d(day)
    on conflict (ingredient_id, day_of_week) do nothing;
  elsif exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'ingredients'
      and column_name = 'in_stock'
  ) then
    insert into public.daily_inventory (ingredient_id, day_of_week, stock_status)
    select
      i.id,
      d.day,
      case when i.in_stock then 'in_stock'::public.stock_status else 'out_of_stock'::public.stock_status end
    from public.ingredients i
    cross join (values (0), (1), (2), (3), (4), (5), (6)) as d(day)
    on conflict (ingredient_id, day_of_week) do nothing;
  end if;
end $$;
