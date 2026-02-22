-- ============================================================
-- ASUCD Pantry — extra ingredient seed
-- Adds the full recipe-matched ingredient list to the
-- EXISTING ingredients table (no schema changes needed).
--
-- Uses WHERE NOT EXISTS (case-insensitive) so it is safe to re-run.
-- ============================================================

insert into ingredients (name, category, item_tags)
select v.name, v.category, v.tags
from (values
  -- Produce
  ('Arugula',           'Produce', array['vegetable', 'leafy green', 'fresh']),
  ('Avocado',           'Produce', array['fruit', 'fresh']),
  ('Baby spinach',      'Produce', array['vegetable', 'leafy green', 'fresh']),
  ('Bell Pepper',       'Produce', array['vegetable', 'fresh']),
  ('Bok Choy',          'Produce', array['vegetable', 'leafy green', 'fresh']),
  ('Broccoli',          'Produce', array['vegetable', 'fresh']),
  ('Butternut Squash',  'Produce', array['vegetable', 'fresh']),
  ('Celery',            'Produce', array['vegetable', 'fresh']),
  ('Cilantro',          'Produce', array['herb', 'fresh']),
  ('Cucumber',          'Produce', array['vegetable', 'fresh']),
  ('Daikon',            'Produce', array['vegetable', 'fresh']),
  ('Eggplant',          'Produce', array['vegetable', 'fresh']),
  ('Okra',              'Produce', array['vegetable', 'fresh']),
  ('Parsley',           'Produce', array['herb', 'fresh']),
  ('Ginger',            'Produce', array['spice', 'fresh']),
  ('Green Beans',       'Produce', array['vegetable', 'fresh']),
  ('Green Onion',       'Produce', array['vegetable', 'fresh']),
  ('Hot Pepper',        'Produce', array['vegetable', 'fresh', 'spicy']),
  ('Iceberg Salad',     'Produce', array['vegetable', 'leafy green', 'fresh']),
  ('Jalapeno',          'Produce', array['vegetable', 'fresh', 'spicy']),
  ('Leeks',             'Produce', array['vegetable', 'fresh']),
  ('Lemon',             'Produce', array['fruit', 'fresh']),
  ('Mushrooms',         'Produce', array['vegetable', 'fresh']),
  ('Mung Bean Sprouts', 'Produce', array['vegetable', 'fresh']),
  ('Pear',              'Produce', array['fruit', 'fresh']),
  ('Persimmon',         'Produce', array['fruit', 'fresh']),
  ('Poblano Pepper',    'Produce', array['vegetable', 'fresh']),
  ('Pomegranate Seeds', 'Produce', array['fruit', 'fresh']),
  ('Potatoes',          'Produce', array['vegetable', 'fresh']),
  ('Radish',            'Produce', array['vegetable', 'fresh']),
  ('Scallions',         'Produce', array['vegetable', 'fresh']),
  ('Sweet Potato',      'Produce', array['vegetable', 'fresh']),
  ('Sweet Red Pepper',  'Produce', array['vegetable', 'fresh']),
  ('Tomatoes',          'Produce', array['vegetable', 'fresh']),
  ('Turnip',            'Produce', array['vegetable', 'fresh']),

  -- Canned / Jarred
  ('Canned Chickpeas',  'Canned/Jarred Foods', array['legume', 'protein', 'vegan']),
  ('Canned Corn',       'Canned/Jarred Foods', array['vegetable', 'vegan']),
  ('Canned Tuna',       'Canned/Jarred Foods', array['protein', 'seafood']),
  ('Chicken Broth',     'Canned/Jarred Foods', array['broth', 'packaged']),
  ('Lima Beans',        'Canned/Jarred Foods', array['legume', 'protein', 'vegan']),
  ('Vegetable Stock',   'Canned/Jarred Foods', array['broth', 'vegan']),

  -- Dry / Baking goods (pasta, grains, spices)
  ('Basil',              'Dry/Baking Goods', array['herb', 'spice']),
  ('Bread',              'Dry/Baking Goods', array['grain', 'staple']),
  ('Crushed Red Pepper', 'Dry/Baking Goods', array['spice', 'spicy']),
  ('Garlic Powder',      'Dry/Baking Goods', array['spice']),
  ('Ground Cumin',       'Dry/Baking Goods', array['spice']),
  ('Onion Powder',       'Dry/Baking Goods', array['spice']),
  ('Oregano',            'Dry/Baking Goods', array['herb', 'spice']),
  ('Orzo',               'Dry/Baking Goods', array['grain', 'pasta', 'staple']),
  ('Smoked Paprika',     'Dry/Baking Goods', array['spice']),

  -- Protein / Meat
  ('Eggs', 'Protein/Meat', array['protein', 'vegetarian'])

) as v(name, category, tags)
where not exists (
  select 1 from ingredients where lower(ingredients.name) = lower(v.name)
);
