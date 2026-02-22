-- ============================================================
-- ASUCD Pantry — ingredients table
-- Safe to re-run: drops and recreates everything cleanly.
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- 1. Drop existing objects so re-runs don't conflict
drop table if exists ingredients cascade;
drop type  if exists stock_status cascade;
drop type  if exists ingredient_category cascade;

-- 2. Enum types
create type stock_status as enum ('in_stock', 'low_stock', 'out_of_stock');

create type ingredient_category as enum (
  'produce',
  'milk',
  'snacks',
  'canned',
  'necessities'
);

-- 3. ingredients table
create table ingredients (
  id            uuid                primary key default gen_random_uuid(),
  name          text                not null,
  category      ingredient_category not null,
  stock_status  stock_status        not null default 'in_stock',
  item_tags     text[]              not null default '{}',
  created_at    timestamptz         not null default now(),
  updated_at    timestamptz         not null default now()
);

-- 4. Keep updated_at current automatically
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ingredients_updated_at
  before update on ingredients
  for each row execute procedure set_updated_at();

-- 5. Helpful indexes
create index on ingredients (category);
create index on ingredients (stock_status);
create index on ingredients using gin (item_tags);

-- 6. Row-Level Security (read-only for anonymous users, full access for authenticated)
alter table ingredients enable row level security;

create policy "Anyone can read ingredients"
  on ingredients for select
  using (true);

create policy "Authenticated users can insert ingredients"
  on ingredients for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update ingredients"
  on ingredients for update
  to authenticated
  using (true);

create policy "Authenticated users can delete ingredients"
  on ingredients for delete
  to authenticated
  using (true);

-- ============================================================
-- 7. Seed data — current ASUCD Pantry stock (as of 2026-02-15)
-- ============================================================

insert into ingredients (name, category, stock_status, item_tags) values
  -- Produce
  ('Carrots',      'produce',     'in_stock', array['vegetable', 'fresh']),
  ('Apples',       'produce',     'in_stock', array['fruit', 'fresh']),
  ('Bananas',      'produce',     'in_stock', array['fruit', 'fresh']),
  ('Spinach',      'produce',     'in_stock', array['vegetable', 'leafy green', 'fresh']),
  ('Onions',       'produce',     'in_stock', array['vegetable', 'fresh']),

  -- Milk / Dairy alternatives
  ('1% Milk',      'milk',        'in_stock', array['dairy', 'drink']),
  ('Oat Milk',     'milk',        'in_stock', array['dairy-free', 'drink', 'vegan']),
  ('Almond Milk',  'milk',        'in_stock', array['dairy-free', 'drink', 'vegan', 'nut']),

  -- Snacks
  ('Granola Bars',   'snacks',    'in_stock', array['snack', 'packaged']),
  ('Crackers',       'snacks',    'in_stock', array['snack', 'packaged']),
  ('Peanut Butter',  'snacks',    'in_stock', array['protein', 'spread', 'nut']),

  -- Canned goods
  ('Black Beans',    'canned',    'in_stock', array['legume', 'protein', 'vegan']),
  ('Corn',           'canned',    'in_stock', array['vegetable', 'vegan']),
  ('Tomato Sauce',   'canned',    'in_stock', array['sauce', 'vegan']),
  ('Chickpeas',      'canned',    'in_stock', array['legume', 'protein', 'vegan']),
  ('Lentils',        'canned',    'in_stock', array['legume', 'protein', 'vegan']),

  -- Necessities / Pantry staples
  ('Toothpaste',   'necessities', 'in_stock', array['hygiene', 'non-food']),
  ('Pads',         'necessities', 'in_stock', array['hygiene', 'non-food']),
  ('Rice',         'necessities', 'in_stock', array['grain', 'staple', 'vegan']),
  ('Pasta',        'necessities', 'in_stock', array['grain', 'staple', 'vegan']),
  ('Olive Oil',    'necessities', 'in_stock', array['oil', 'staple', 'vegan']);
