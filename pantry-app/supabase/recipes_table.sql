-- ============================================================
-- ASUCD Pantry — recipes table
-- Safe to re-run: drops and recreates everything cleanly.
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- 1. Drop if re-running
drop table if exists recipes cascade;

-- 2. Recipes table
create table recipes (
  id                  text        primary key,
  title               text        not null,
  cook_time           text        not null,
  difficulty          text        not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  ingredients         text[]      not null default '{}',
  pantry_ingredients  text[]      not null default '{}',
  instructions        text[]      not null default '{}',
  substitutions       text[]      not null default '{}',
  ai_generated        boolean     not null default false,
  created_at          timestamptz not null default now()
);

-- 3. Row-Level Security (read-only for everyone)
alter table recipes enable row level security;

create policy "Anyone can read recipes"
  on recipes for select
  using (true);

create policy "Authenticated users can insert recipes"
  on recipes for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update recipes"
  on recipes for update
  to authenticated
  using (true);

-- ============================================================
-- 4. Seed data
-- ============================================================

insert into recipes (id, title, cook_time, difficulty, ingredients, pantry_ingredients, instructions, substitutions, ai_generated) values

('pasta-cobb-salad', 'Pasta Cobb Salad', '15 min', 'Easy',
  ARRAY['1 pouch Barilla Ready Pasta Elbows','2 slices bacon, crispy and cut in strips','1 cup iceberg salad, shredded','1 hard-boiled egg, chopped','4 oz grilled chicken breast, sliced','2 ripe plum tomatoes, diced','½ avocado, diced','3 green onions, chopped','¼ cup blue cheese, crumbled','4 oz ranch dressing'],
  ARRAY['Barilla Ready Pasta Elbows','Iceberg salad','Hard-boiled eggs','Green onions'],
  ARRAY['Tear corner of Ready Pasta pouch to vent, heat in microwave for one minute; pour on a plate and let cool down.','Toss pasta with all ingredients together in individual-sized serving bowls.'],
  ARRAY['Swap bacon for canned tuna from the Pantry.','Replace blue cheese with any pantry-available cheese.'],
  false),

('pasta-salad-tomato-basil', 'Pasta Salad with Tomato Basil Sauce and Cheese', '10 min', 'Easy',
  ARRAY['1 pouch Barilla Ready Pasta Elbows','1 cup Barilla Tomato & Basil Sauce','2 leaves of basil, julienned','2 tbsp Parmigiano-Reggiano cheese, grated'],
  ARRAY['Barilla Ready Pasta Elbows','Basil leaves'],
  ARRAY['Tear corner of Ready Pasta pouch to vent, heat for 60 seconds in the microwave.','Warm sauce and basil in a bowl for 2 minutes in the microwave.','Combine pasta with sauce and top with cheese.'],
  ARRAY['Use any canned tomato sauce from the Pantry.','Sprinkle nutritional yeast instead of cheese.'],
  false),

('esquite', 'Esquite', '15 min', 'Easy',
  ARRAY['1 can of sweet corn','1 tbsp butter','Salt to taste','⅓ cup Parmesan cheese or Cotija','Chile powder or Hot Cheetos powder','2 tbsp mayonnaise'],
  ARRAY['Corn (canned)'],
  ARRAY['Start by adding the butter to a frying pan.','Add the corn kernels and cook for 5 minutes over medium heat.','Serve in cups.','Add cheese, mayonnaise on top, and finish with chili powder or Hot Cheetos powder.','Eat as is, or mix. Enjoy!'],
  ARRAY['Use olive oil instead of butter.','Substitute Cotija with any crumbled cheese.'],
  false),

('tuna-salad-sandwich', 'Tuna Salad Sandwich', '15 min', 'Easy',
  ARRAY['1 can tuna','2 medium tomatoes','¼ cup cilantro','A pinch of sea salt','⅛ cup white or red onion','¼ cup cucumber','1 lemon or lime','2 slices of bread','Optional: ¼ cup mayonnaise'],
  ARRAY['Canned tuna','Tomatoes','Cilantro','Onion','Cucumber','Lemon or lime','Bread'],
  ARRAY['Open the canned tuna. Drain the liquid. Add the tuna to the bowl.','Wash and chop the tomatoes, cucumber, and onion into small cubes.','Wash and drain cilantro and roughly chop it.','Add the chopped vegetables and cilantro into the bowl with tuna.','Add lemon or lime juice. Optionally add mayonnaise and sea salt.','Carefully mix your ingredients together.','Eat right away or store in an airtight container in the refrigerator.'],
  ARRAY['Use canned salmon instead of tuna.','Swap cucumber for any crunchy vegetable available.'],
  false),

('tuna-noodle-casserole', 'Tuna Noodle Casserole', '35 min', 'Medium',
  ARRAY['1 can tuna','½ cup beans and legumes','Pasta noodles','4 cups spinach','¼ cup Alfredo sauce','Oil','Dash of basil','Dash of oregano'],
  ARRAY['Canned tuna','Beans and legumes (mixed)','Pasta noodles','Baby spinach','Basil','Oregano'],
  ARRAY['Preheat the oven to 400°F.','Cook pasta according to packaging instructions.','Coat the casserole dish with oil.','Combine all ingredients in the casserole dish.'],
  ARRAY['Use canned chicken instead of tuna.','Swap spinach for any leafy green from the Pantry.'],
  false),

('tuna-melts-on-pepper', 'Tuna Melts on Pepper', '20 min', 'Easy',
  ARRAY['1 can tuna','1 green bell pepper','1 tbsp mayonnaise','⅓ cup mozzarella cheese, shredded','Dash of everything bagel seasoning'],
  ARRAY['Canned tuna','Bell peppers'],
  ARRAY['Preheat the oven to 425°F.','Slice peppers into quarters.','Mix tuna and mayonnaise.','Combine all ingredients into a casserole dish.','Bake for 10 minutes.','Remove from the oven and top with cheese.','Bake for another ~3 minutes.'],
  ARRAY['Use any color bell pepper available.','Swap mozzarella for any melting cheese.'],
  false),

('arugula-chickpea-tuna-salad', 'Arugula Chickpea Tuna Salad', '15 min', 'Easy',
  ARRAY['2 tbsp olive oil','Arugula','Canned chickpeas','Lemon juice','Canned tuna','Diced red onion','Sesame salad dressing','Garlic powder','Onion powder','Smoked paprika','Cayenne pepper (optional)','Za''atar','Salt','Pepper','Dill seasoning'],
  ARRAY['Arugula','Chickpeas (canned)','Canned tuna','Onion','Garlic powder','Onion powder','Smoked paprika','Salt','Pepper'],
  ARRAY['Open and drain cans of tuna and chickpeas. Lightly mash tuna after draining.','Dice red onions.','Drizzle olive oil in a bowl and toss in chickpeas to cover in oil.','Mix in garlic powder, onion powder, smoked paprika, cayenne pepper, za''atar, salt, and pepper.','Add tuna and lightly mix.','Top with arugula.','Squeeze lemon juice and add dill seasoning.','Toss and serve!'],
  ARRAY['Use any canned beans instead of chickpeas.','Swap arugula for spinach or mixed greens.'],
  false),

('spicy-rice-casserole', 'Spicy Rice Casserole', '25 min', 'Medium',
  ARRAY['3 tbsp canola oil','4 eggs, lightly beaten','½ tsp sesame oil','1 onion, chopped','1 tsp ginger, finely chopped','1 clove garlic, finely chopped','½ hot pepper, deseeded and finely chopped','2 bell peppers, deseeded and finely chopped','1 lb broccoli, chopped','4 cups cooked rice','4 tbsp soy sauce','¼ cup oyster sauce'],
  ARRAY['Eggs','Onion','Ginger','Garlic','Hot pepper','Bell peppers','Broccoli','Rice'],
  ARRAY['In a large skillet, heat 1 tbsp canola oil and sesame oil over medium-high heat. Add eggs and stir until cooked through.','Set aside the eggs, wipe the skillet, and add remaining oil. Add onion, ginger, garlic, peppers, broccoli, and rice. Cook until rice is crispy (about 5 minutes).','Combine oyster sauce with soy sauce. Pour over rice and cook until absorbed.','Add cooked eggs back into the skillet and mix. Serve.'],
  ARRAY['Use any available vegetables instead of broccoli or bell peppers.','Substitute oyster sauce with additional soy sauce.'],
  false),

('chicken-panang-curry', 'Chicken Panang Curry', '30 min', 'Medium',
  ARRAY['2 chicken breasts','Panang curry paste or panang curry sauce','Coconut milk','Salt to taste','Oil','¼ cup shallots','1 tbsp thai chilies','¼ tsp curry powder','Broccoli','Green beans','Chicken broth','Bok choy'],
  ARRAY['Salt','Broccoli','Green beans','Chicken broth','Bok choy'],
  ARRAY['Thoroughly wash bok choy and separate sprigs.','Rinse broccoli and green beans.','Chop chicken breast and shallots into bite-sized pieces.','Heat oil in a large pot. Cook shallots and thai chilis until shallots start to brown.','Add panang curry paste and pour in coconut milk.','Add chicken and a small amount of chicken broth and curry powder.','Cover and simmer for 10-12 minutes.','Uncover, add broccoli, green beans, and bok choy.','Cook for an additional 5 minutes. Serve with rice!'],
  ARRAY['Use canned chickpeas or tofu instead of chicken for a vegetarian version.','Swap bok choy for spinach or any leafy green.'],
  false),

('chili-stuffed-poblano-peppers', 'Chili Stuffed Poblano Peppers', '35 min', 'Medium',
  ARRAY['1 lb ground turkey','1 can of chili','¼ tsp salt','1½ cups shredded Mexican cheese','1 medium tomato','4 green onions','4 poblano peppers','1 tsp olive oil'],
  ARRAY['Salt','Tomatoes','Green onions','Poblano peppers'],
  ARRAY['Preheat the oven to 350°F or use a broiler.','Fully cook ground turkey. Add chili and salt. Mix in cheese, tomatoes, and green onions.','Cut the top of each pepper to remove the stem. Remove the seeds and insides.','Cut peppers in half and coat with oil.','Place peppers opening-down on a foil-lined tray. Bake about 5 minutes until skin blisters.','Flip peppers over and fill with the chili mixture.'],
  ARRAY['Use canned beans instead of ground turkey for a vegetarian filling.','Swap poblano peppers for regular bell peppers.'],
  false),

('leek-turnip-rice-soup', 'Leek, Turnip, and Rice Soup', '45 min', 'Easy',
  ARRAY['2 tbsp extra virgin olive oil','4 large leeks, cleaned and sliced','1 lb turnips, cut in ½ inch dice','2 garlic cloves, minced','2 quarts vegetable stock or water','½ cup rice','2 tbsp chopped fresh parsley','Salt and pepper to taste','1 bay leaf'],
  ARRAY['Leeks','Turnips','Garlic','Vegetable stock','Rice','Fresh parsley','Salt','Pepper'],
  ARRAY['Heat oil on medium heat in a soup pot and add leeks.','Cook, stirring often, until leeks soften, then add turnips. Cook until translucent.','Stir in garlic and cook until fragrant.','Add stock, salt, bay leaf, and rice. Bring to a boil.','Reduce heat to low, cover, and simmer for 30 minutes.'],
  ARRAY['Use any root vegetable (carrots, potatoes) instead of turnips.','Substitute rice with any small pasta or lentils.'],
  false),

('vegetable-hand-rolls', 'Vegetable Hand Rolls (Temaki)', '35 min', 'Medium',
  ARRAY['1 cup uncooked sushi rice','3 tbsp sushi seasoning','10 sheets toasted sushi nori','½ English cucumber','1 medium red bell pepper','6 oz preserved daikon','2 medium persimmons','2 small avocados, pitted and sliced','Furikake for topping (optional)'],
  ARRAY['Sushi rice','Cucumber','Bell peppers','Preserved daikon','Persimmons','Avocados'],
  ARRAY['Cook the sushi rice and mix in the sushi seasoning.','Cut all vegetables into matchstick-size pieces.','Cut nori sheets in half. Spoon 2-3 tablespoons of rice onto each nori half.','Top with sliced vegetables and roll the nori.'],
  ARRAY['Use regular long-grain rice instead of sushi rice.','Fill with any available crunchy vegetables.'],
  false),

('eggplant-curry', 'Eggplant Curry', '50 min', 'Medium',
  ARRAY['2 large eggplants','3 tbsp oil','1 bunch scallions, finely chopped','1 cup mushrooms, halved','3 garlic cloves, crushed','1 fresh red chili, finely chopped','1 tsp chili powder','1 tbsp curry powder','1 tsp salt','14 oz chopped tomatoes','1 tbsp cilantro, chopped'],
  ARRAY['Eggplant','Scallions','Mushrooms','Garlic','Salt','Tomatoes','Cilantro'],
  ARRAY['Preheat the oven to 400°F. Brush eggplants with 1 tbsp oil and prick with a fork. Bake for 30-35 minutes until soft.','Heat remaining oil in a saucepan. Add scallions, mushrooms, garlic, and chili. Cook for 5 minutes.','Stir in chili powder, curry powder, and salt. Cook 3-4 minutes. Add tomatoes and simmer 5 minutes.','Scoop eggplant flesh into a bowl and mash briefly. Add to the pan with cilantro.','Bring to a boil and simmer for 5 minutes until sauce thickens. Serve garnished with cilantro!'],
  ARRAY['Use zucchini or butternut squash instead of eggplant.','Substitute cilantro with parsley.'],
  false),

('pear-pomegranate-salad', 'Pear and Pomegranate Salad', '10 min', 'Easy',
  ARRAY['¼ cup pomegranate seeds','1 pear, sliced','3 cups packed baby spinach','¼ cup crumbled feta cheese','¼ cup pecan halves','Optional: orange poppyseed vinaigrette'],
  ARRAY['Pomegranate seeds','Pear','Baby spinach'],
  ARRAY['Add the spinach to a large bowl and layer remaining ingredients on top.','Top with desired dressing or orange poppyseed vinaigrette.','For vinaigrette: combine orange juice, olive oil, dijon mustard, apple cider vinegar, poppyseeds, and honey in a jar. Shake well.','Drizzle over salad, toss to combine, and serve immediately.'],
  ARRAY['Swap feta for any crumbled cheese or nutritional yeast.','Use any fresh fruit from the Pantry instead of pear.'],
  false),

('garlic-clove-spaghetti', 'Garlic Clove Spaghetti', '70 min', 'Hard',
  ARRAY['1 lb whole-wheat spaghetti','2 pork loin blade chops','40 cloves fresh garlic, peeled','¼ cup half and half milk','4 tbsp oil','2 tbsp butter','½ tsp crushed red pepper','2 green onions, chopped','Salt and ground pepper to taste'],
  ARRAY['Whole-wheat spaghetti','Garlic','Green onions','Salt','Pepper','Crushed red pepper'],
  ARRAY['Sauté garlic cloves in oil on low for 40 minutes, stirring often, until lightly caramelized. Set aside.','In the same pan, brown pork chops on both sides on medium-high. Cook through on low. Set aside.','Cook spaghetti and reserve 1 cup of pasta water. Toss strained pasta with 1 tbsp butter.','Blend garlic with half and half until hummus-like consistency.','In a small pan, combine butter, garlic mixture, and ¾ cup pasta water. Heat and stir until emulsified.','Reheat pan on medium-high. Toss in crushed red peppers then pasta. Add remaining pasta water and garlic mixture. Toss until evenly coated.'],
  ARRAY['Use any pasta shape available at the Pantry.','Omit pork for a vegetarian garlic pasta.'],
  false),

('orzo-garlicky-spinach', 'Orzo with Garlicky Spinach', '20 min', 'Easy',
  ARRAY['¾ cup uncooked orzo','1 tbsp butter','4 cups spinach','2 tsp minced garlic','1 oz Parmesan cheese','¼ cup chicken broth','1 tbsp white balsamic vinegar','⅜ tsp salt','¼ tsp crushed red pepper'],
  ARRAY['Orzo','Baby spinach','Garlic','Chicken broth','Salt','Crushed red pepper'],
  ARRAY['Cook orzo according to package directions, omitting salt.','Melt butter over medium heat and cook for 1 minute until browned.','Add spinach and minced garlic. Cook for 1 minute.','Stir in orzo, Parmesan, chicken broth, vinegar, salt, and crushed red pepper.'],
  ARRAY['Use any small pasta shape instead of orzo.','Use vegetable broth for a vegetarian version.'],
  false),

('udon-chicken-peanut-dressing', 'Udon with Chicken and Garlicky Peanut Dressing', '25 min', 'Medium',
  ARRAY['¼ cup natural creamy peanut butter','¼ cup soy sauce','¼ cup unseasoned rice vinegar','1 tbsp honey','1 garlic clove, finely grated','¼ cup vegetable oil','8 oz dried udon noodles','8 oz shredded rotisserie chicken','1½ cups thinly sliced celery hearts','1½ cups mung bean sprouts','1 small daikon, cut into matchsticks','2 tsp sesame seeds','Chili oil for serving'],
  ARRAY['Natural peanut butter','Garlic','Celery','Mung bean sprouts','Daikon'],
  ARRAY['Whisk peanut butter, soy sauce, vinegar, honey, and garlic until smooth. Gradually whisk in vegetable oil until emulsified.','Cook udon noodles until al dente. Drain and rinse under cold water.','Toss noodles, chicken, celery, bean sprouts, and daikon with three-quarters of the dressing.','Top with sesame seeds and drizzle remaining dressing and chili oil over.'],
  ARRAY['Use any noodle available at the Pantry.','Substitute chicken with canned tuna or chickpeas.'],
  false),

('roasted-tomato-avocado-toast', 'Roasted Tomato Avocado Toast', '30 min', 'Easy',
  ARRAY['3 tomatoes','4 slices bread of your choice','2 ripe avocados','Juice from 1 lime','Flat leaf parsley for garnish','Italian seasoning','Olive oil','Red pepper flakes (optional)','Balsamic vinegar','Sea salt'],
  ARRAY['Tomatoes','Bread','Avocados','Fresh parsley','Salt'],
  ARRAY['Preheat the oven to 375°F. Slice tomatoes, season with Italian seasoning and sea salt, drizzle with olive oil. Roast for 15-20 minutes.','Mash avocados with lime juice to desired texture.','Toast the bread.','Spread avocado mash over toast, top with roasted tomatoes, drizzle with balsamic glaze, and garnish with parsley.'],
  ARRAY['Use any available bread type.','Top with a fried or poached egg for extra protein.'],
  false),

('corn-salad-radish-jalapeno', 'Corn Salad with Radishes, Jalapeño, and Lime', '10 min', 'Easy',
  ARRAY['1½ cans of corn','6 radishes','½ jalapeño','3 tbsp lime juice','2 tbsp cilantro leaves','1½ tbsp olive oil','Salt to taste'],
  ARRAY['Corn (canned)','Radishes','Jalapeño','Cilantro'],
  ARRAY['Chop radishes, jalapeño, and cilantro leaves to your preference.','Combine all ingredients in a bowl. Season with salt to taste.','Salad can be stored in the fridge for 1 day.'],
  ARRAY['Use frozen corn instead of canned.','Omit jalapeño for a milder version.'],
  false),

('butternut-squash-soup', 'Butternut Squash Soup', '50 min', 'Easy',
  ARRAY['2 tbsp butter','1 medium onion, diced','1 medium butternut squash, peeled and cubed','1 medium carrot, chopped','1 stalk celery, chopped','2 medium potatoes, cubed','23 oz vegetable broth or chicken stock','Salt and pepper to taste'],
  ARRAY['Onion','Butternut squash','Carrots','Celery','Potatoes','Vegetable stock','Salt','Pepper'],
  ARRAY['Melt butter in a large pot over medium-high heat. Sauté onions until lightly browned.','Season with salt and pepper. Add all chopped vegetables.','Pour broth to cover vegetables and bring to a boil.','Reduce heat, cover, and simmer for 40 minutes.','Purée using an immersion blender or food processor until smooth.','Return to pot and adjust consistency with remaining stock.'],
  ARRAY['Swap butternut squash for pumpkin or sweet potato.','Use olive oil instead of butter.'],
  false),

('butternut-squash-basmati-rice', 'Butternut Squash Basmati Rice', '25 min', 'Easy',
  ARRAY['1 tbsp unsalted butter','1 tsp whole cumin seeds','1 tsp mustard seeds','1 cup basmati rice','2 cups water','¾ lb butternut squash, cut into ¼ inch cubes','2 tsp salt'],
  ARRAY['Basmati rice','Butternut squash','Salt'],
  ARRAY['Melt butter in a saucepan. Add cumin and mustard seeds and cook over high heat until mustard seeds begin to pop (about 30 seconds).','Add rice and diced squash. Stir to coat with butter. Add water and salt. Bring to a boil.','Cover and cook over very low heat until squash is tender and water is absorbed (about 15 minutes).','Remove from heat and let stand covered for 5 minutes. Fluff with a fork and serve.'],
  ARRAY['Use any rice variety available at the Pantry.','Substitute butternut squash with sweet potato.'],
  false),

('chicken-sweet-potato-black-bean-skillet', 'Chicken, Sweet Potato, and Black Bean Skillet', '30 min', 'Medium',
  ARRAY['1 sweet potato, peeled and diced','1 cup cherry tomatoes, halved','½ cup diced onion','½ cup diced green chilis','1 lb boneless skinless chicken breasts','1 can black beans, rinsed and drained','⅓ cup salsa or red enchilada sauce','½ cup shredded cheddar/jack cheese','2 tsp olive oil','½ lime, juiced','1 tsp each: ground cumin, chili powder, oregano','¼ tsp each: granulated garlic, pepper'],
  ARRAY['Sweet potato','Onion','Black beans (canned)','Ground cumin','Granulated garlic','Pepper','Oregano'],
  ARRAY['Heat oil in a skillet over medium-high heat. Combine all spices in a small bowl.','Add chicken in an even layer and sprinkle with half the spice blend. Sauté 3 minutes then add onion.','Cook until onion softens and chicken is cooked through.','Add remaining spices, sweet potato, tomatoes, black beans, green chilis, and salsa. Cook 2-3 minutes.','Squeeze lime juice over everything, top with shredded cheese, and cover until cheese melts.','Garnish with cilantro and serve.'],
  ARRAY['Use canned chickpeas instead of chicken for a vegetarian version.','Swap black beans for any canned beans from the Pantry.'],
  false),

('lima-bean-soup', 'Lima Bean Soup', '35 min', 'Easy',
  ARRAY['3 cans chicken broth','2 cans lima beans, rinsed and drained','3 medium carrots','2 medium potatoes','2 small onions','2 small sweet red peppers','¼ cup butter','Salt, pepper, oregano','1 cup half and half cream'],
  ARRAY['Chicken broth','Lima beans (canned)','Carrots','Potatoes','Onion','Sweet red peppers','Salt','Pepper','Oregano'],
  ARRAY['In a large pot, combine all ingredients. Bring to a boil over medium heat.','Reduce heat, cover, and simmer for 25-35 minutes.','Add cream and heat through but do not boil.'],
  ARRAY['Use vegetable broth for a vegetarian version.','Substitute lima beans with any canned white beans.'],
  false),

('okra-chickpeas-tomato-sauce', 'Okra and Chickpeas in Fresh Tomato Sauce', '30 min', 'Easy',
  ARRAY['2 tbsp extra-virgin olive oil','1 medium yellow onion, chopped','2 garlic cloves, very finely chopped','5 ripe tomatoes, cored and chopped','1 tbsp ground cumin','1 tbsp harissa or Sriracha','1 tsp lemon zest plus 1 tbsp lemon juice','1 lb fresh okra, cut into ½-inch slices','1½ tsp kosher salt','¾ tsp black pepper','1 can chickpeas, drained and rinsed','¼ cup chopped fresh flat-leaf parsley'],
  ARRAY['Onion','Garlic','Tomatoes','Ground cumin','Fresh okra','Salt','Pepper','Chickpeas (canned)','Fresh parsley'],
  ARRAY['Heat oil in a large skillet over medium-low. Cook onion until soft and translucent, about 6 minutes.','Add garlic and cook until fragrant, about 45-60 seconds.','Add tomatoes, cumin, harissa, lemon zest, and lemon juice. Cook until tomatoes start to break down, about 5 minutes.','Add okra, 1 tsp salt, and ½ tsp pepper. Cover and cook until okra is just tender, about 10 minutes.','Add chickpeas, cover, and cook until heated through, about 3 minutes.','Stir in parsley and remaining salt and pepper. Serve immediately.'],
  ARRAY['Use frozen okra if fresh is unavailable.','Add spinach or kale for extra greens.'],
  false),

('creamy-tomato-basil-soup', 'Creamy Tomato Basil Soup', '30 min', 'Easy',
  ARRAY['2 tbsp oil','2 tbsp unsalted butter','1 yellow onion, chopped','2 cloves garlic, minced','1 tsp kosher salt','½ tsp pepper','2 tbsp flour','4 cans vegetable broth','1 can whole peeled tomatoes','3 oz tomato paste','1 tsp sugar','1 cup heavy cream','5 basil leaves, chopped'],
  ARRAY['Onion','Garlic','Salt','Pepper'],
  ARRAY['Add oil and butter to a pan on medium heat.','Add onion and garlic and cook for 2-3 minutes until translucent.','Add salt, pepper, and flour. Whisk until flour is cooked, about 30 seconds.','Slowly add broth while whisking. Add tomatoes, tomato paste, sugar, and basil.','Lower heat and cook for 20 minutes.','Blend soup until completely smooth.','Add cream and cook for an additional 5 minutes before serving.','Serve with grilled cheese!'],
  ARRAY['Use coconut milk instead of heavy cream for a dairy-free version.','Add canned white beans for extra protein.'],
  false),

('cilantro-rice', 'Cilantro Rice', '30 min', 'Easy',
  ARRAY['1 cup rice','2 dried bay leaves','1½ cups water','2 tbsp lime juice','Salt to taste','½ cup chopped fresh cilantro','1 tsp lemon juice (optional)'],
  ARRAY['Rice','Salt','Cilantro'],
  ARRAY['In a saucepan, add rice, bay leaves, and water. Bring to a boil.','Reduce heat, cover, and simmer for 18 minutes.','Remove lid, fluff rice with fork, cover, and let rest for 10 minutes.','Remove bay leaves, add lime juice, lemon juice, salt, and cilantro. Stir to combine.'],
  ARRAY['Use any rice variety from the Pantry.','Substitute cilantro with fresh parsley.'],
  false),

('moringa-stir-fry', 'Moringa Leaves Stir-Fry (Thoran) with Grated Coconut', '25 min', 'Easy',
  ARRAY['250 grams moringa leaves','¼ cup grated coconut','Salt to taste','1 tbsp oil','½ tsp mustard seeds','¼ cup shallots','1 tbsp crushed dried chilies','1 sprig curry leaves (optional)','¼ tsp turmeric powder (optional)'],
  ARRAY[]::text[],
  ARRAY['Wash and drain the moringa leaves. Remove all thick sprigs.','Crush and finely chop shallots.','Combine moringa leaves, grated coconut, turmeric powder, and salt in a mixing bowl.','Heat oil in a pan. Add mustard seeds, then chopped shallots.','Once shallots are tender, add crushed chillies and curry leaves. Sauté for 2 minutes.','Add the moringa leaf mixture and combine well.','Cook with lid closed for 10 minutes, stirring occasionally.','Open lid, stir, and cook for 2 more minutes. Serve hot with rice and curry.'],
  ARRAY['Serve over pantry rice for a complete meal.','Add canned chickpeas for extra protein.'],
  false);
