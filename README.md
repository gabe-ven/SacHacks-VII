# The Pantry at ASUCD — Recipe Finder

**SacHacks VII** · Turn your Pantry picks into real meals.

A web app for UC Davis students who use [The Pantry at ASUCD](https://thepantry.ucdavis.edu/). Select the ingredients you grabbed, and get **real recipe suggestions** that match what you have — plus AI-powered “Suggested for you” picks and generated recipe images.

---

## What it does

- **Browse inventory** — View Pantry items by day, search, and filter by category, dietary tags, and stock.
- **Select what you got** — Tap items to build your list (up to 20). Use **Find recipes** to see what you can make.
- **Best matches** — Recipe list from our database scored by how well they use your selected ingredients (with match %).
- **Suggested for you** — AI selects 5–6 **real recipes** from the database that fit your ingredients, then formats them and generates images (DALL·E 3).
- **Recipe detail** — Full instructions, “What you have” vs “What you need,” cook time, difficulty. Works for both DB recipes and AI-suggested ones.
- **Dark mode** — Theme toggle in the nav.
- **Mobile-friendly** — Responsive layout, pill search bars, hamburger nav, and a sticky selection bar on inventory.

---

## Tech stack

| Layer        | Tech |
|-------------|------|
| Framework   | Next.js 16 (App Router), React 19 |
| Styling     | Tailwind CSS 4, CSS variables (pantry theme) |
| Data        | Supabase (recipes, ingredients, inventory) |
| AI          | OpenAI GPT-4o-mini (recipe selection), DALL·E 3 (recipe images) |
| Motion      | Framer Motion |

---

## Run locally

1. **Clone and install**

   ```bash
   git clone https://github.com/your-org/SacHacks-VII.git
   cd SacHacks-VII/pantry-app
   npm install
   ```

2. **Environment variables**

   Create `pantry-app/.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPEN_AI_API_KEY=your_openai_api_key
   ```

   - Supabase: [supabase.com](https://supabase.com) → project → Settings → API.
   - OpenAI: [platform.openai.com](https://platform.openai.com/api-keys) (needed for “Suggested” recipes and images).

3. **Start dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
SacHacks-VII/
├── pantry-app/
│   ├── app/
│   │   ├── page.tsx              # Landing (Hero, How it works, CTA)
│   │   ├── inventory/page.tsx    # Browse items, select, Find recipes
│   │   ├── recipes/page.tsx      # Best matches + Suggested for you
│   │   ├── recipes/[id]/page.tsx # DB recipe detail
│   │   ├── recipes/generated/[id]/page.tsx  # AI-suggested recipe detail
│   │   └── api/generate-recipes/route.ts     # Real-recipe selection + images
│   ├── components/
│   │   ├── landing/              # Hero, HowItWorks, MissionQuote, etc.
│   │   ├── recipes/              # RecipeCard, RecipeFilters, RecipeSteps, BackToRecipesLink
│   │   └── inventory/            # SearchBar, FilterPanel, SelectedItemsPanel, InventoryCard
│   ├── lib/
│   │   ├── getRecipes.ts         # Supabase recipes + scoreRecipe()
│   │   └── getInventory.ts       # Inventory fetch
│   └── context/ThemeContext.tsx  # Light/dark
└── README.md
```

---

## How “Suggested for you” works

1. User selects ingredients and hits **Find recipes**.
2. We fetch real recipes from Supabase and score them with `scoreRecipe(recipe, userIngredients)`.
3. We send the **top matching real recipes** (and the user’s ingredients) to GPT-4o-mini with instructions to **pick 5–6 from that list only** — no inventing.
4. The model returns those recipes in our JSON shape (have/need ingredients, steps).
5. We generate one DALL·E 3 image per recipe and return the list to the client.

So suggestions are **real recipes** from the DB, with AI used for selection, formatting, and images.

---

## Built for

**SacHacks VII** — supporting [The Pantry at ASUCD](https://thepantry.ucdavis.edu/) and UC Davis students.

*No student goes hungry.*
