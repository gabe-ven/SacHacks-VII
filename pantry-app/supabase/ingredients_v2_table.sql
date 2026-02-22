-- ============================================================
-- ASUCD Pantry — ingredients table v2
-- Replaces the old enum-based schema with a simpler text
-- category + boolean in_stock column.
-- Includes the full comprehensive ingredient list that
-- matches the pantry_ingredients used in the recipes table.
--
-- Safe to re-run: drops and recreates everything cleanly.
-- Run this BEFORE recipes_table.sql.
-- ============================================================

-- 1. Drop existing objects
drop table if exists daily_inventory cascade;
drop table if exists ingredients cascade;
drop type  if exists stock_status cascade;
drop type  if exists ingredient_category cascade;

-- 2. Ingredients table (no enum types — plain text category)
create table ingredients (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  category    text        not null,
  in_stock    boolean     not null default true,
  item_tags   text[]      not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3. Keep updated_at current automatically
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

-- 4. Indexes
create index on ingredients (category);
create index on ingredients (in_stock);
create index on ingredients using gin (item_tags);

-- 5. Row-Level Security
alter table ingredients enable row level security;

create policy "Anyone can read ingredients"
  on ingredients for select using (true);

create policy "Authenticated users can insert ingredients"
  on ingredients for insert to authenticated with check (true);

create policy "Authenticated users can update ingredients"
  on ingredients for update to authenticated using (true);

create policy "Authenticated users can delete ingredients"
  on ingredients for delete to authenticated using (true);

-- ============================================================
-- 6. Seed data — comprehensive ASUCD Pantry stock
-- ============================================================

insert into ingredients (name, category, in_stock) values

-- Produce
('Arugula',            'Produce', true),
('Avocados',           'Produce', true),
('Baby spinach',       'Produce', true),
('Bell peppers',       'Produce', true),
('Bok choy',           'Produce', true),
('Broccoli',           'Produce', true),
('Butternut squash',   'Produce', true),
('Carrots',            'Produce', true),
('Celery',             'Produce', true),
('Cilantro',           'Produce', true),
('Cucumber',           'Produce', true),
('Daikon',             'Produce', true),
('Eggplant',           'Produce', true),
('Fresh okra',         'Produce', true),
('Fresh parsley',      'Produce', true),
('Garlic',             'Produce', true),
('Ginger',             'Produce', true),
('Green beans',        'Produce', true),
('Green onions',       'Produce', true),
('Hot pepper',         'Produce', true),
('Iceberg salad',      'Produce', true),
('Jalapeño',           'Produce', true),
('Leeks',              'Produce', true),
('Lemon or lime',      'Produce', true),
('Mushrooms',          'Produce', true),
('Mung bean sprouts',  'Produce', true),
('Onion',              'Produce', true),
('Pear',               'Produce', true),
('Persimmons',         'Produce', true),
('Poblano peppers',    'Produce', true),
('Pomegranate seeds',  'Produce', true),
('Potatoes',           'Produce', true),
('Radishes',           'Produce', true),
('Scallions',          'Produce', true),
('Sweet potato',       'Produce', true),
('Sweet red peppers',  'Produce', true),
('Tomatoes',           'Produce', true),
('Turnips',            'Produce', true),

-- Canned & Packaged
('Barilla Ready Pasta Elbows', 'Canned & Packaged', true),
('Beans and legumes (mixed)',  'Canned & Packaged', true),
('Black beans (canned)',       'Canned & Packaged', true),
('Chickpeas (canned)',         'Canned & Packaged', true),
('Canned tuna',                'Canned & Packaged', true),
('Chicken broth',              'Canned & Packaged', true),
('Corn (canned)',               'Canned & Packaged', true),
('Lima beans (canned)',         'Canned & Packaged', true),
('Natural peanut butter',      'Canned & Packaged', true),
('Preserved daikon',           'Canned & Packaged', true),
('Vegetable stock',            'Canned & Packaged', true),

-- Grains & Pasta
('Basmati rice',          'Grains & Pasta', true),
('Bread',                 'Grains & Pasta', true),
('Orzo',                  'Grains & Pasta', true),
('Pasta noodles',         'Grains & Pasta', true),
('Rice',                  'Grains & Pasta', true),
('Sushi rice',            'Grains & Pasta', true),
('Whole-wheat spaghetti', 'Grains & Pasta', true),

-- Spices & Seasonings
('Basil',              'Spices & Seasonings', true),
('Crushed red pepper', 'Spices & Seasonings', true),
('Garlic powder',      'Spices & Seasonings', true),
('Granulated garlic',  'Spices & Seasonings', true),
('Ground cumin',       'Spices & Seasonings', true),
('Onion powder',       'Spices & Seasonings', true),
('Oregano',            'Spices & Seasonings', true),
('Pepper',             'Spices & Seasonings', true),
('Salt',               'Spices & Seasonings', true),
('Smoked paprika',     'Spices & Seasonings', true),

-- Proteins
('Eggs', 'Proteins', true);
