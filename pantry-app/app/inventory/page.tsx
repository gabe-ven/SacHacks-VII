"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchInventory } from "@/lib/mockInventory";
import {
  filterInventory,
  getAllCategories,
  getAllTags,
  isFiltersActive,
} from "@/lib/inventoryFilters";
import type { FilterState, InventoryItem } from "@/types/inventory";

import SearchBar from "@/components/inventory/SearchBar";
import FilterPanel from "@/components/inventory/FilterPanel";
import InventoryCard from "@/components/inventory/InventoryCard";
import SelectedItemsPanel from "@/components/inventory/SelectedItemsPanel";
import SkeletonCard from "@/components/inventory/SkeletonCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// ── Constants ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "pantry_selected_items_v1";
const MAX_SELECTION = 20;
const SKELETON_COUNT = 12;

const DEFAULT_FILTERS: FilterState = {
  search: "",
  categories: [],
  stockStatus: "all",
  tags: [],
};

// ── Page component ─────────────────────────────────────────────────────────
export default function InventoryPage() {
  const router = useRouter();

  // ── Data state ────────────────────────────────────────────────────────────
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // ── Selection state ───────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Track whether localStorage has been read so we don't overwrite it on first render
  const [hydrated, setHydrated] = useState(false);

  // ── Mobile UI toggles ─────────────────────────────────────────────────────
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSelected, setShowMobileSelected] = useState(false);

  // ── Load inventory ────────────────────────────────────────────────────────
  // TODO: When integrating a real API, replace fetchInventory() with your
  //       actual service call. The error/loading state shape stays the same.
  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  // ── Hydrate selection from localStorage ───────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids: unknown = JSON.parse(raw);
        if (Array.isArray(ids)) {
          setSelectedIds(new Set(ids.filter((v) => typeof v === "string")));
        }
      }
    } catch {
      // Silently ignore malformed localStorage data
    }
    setHydrated(true);
  }, []);

  // ── Persist selection to localStorage ────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedIds]));
  }, [selectedIds, hydrated]);

  // ── Derived values (memoised) ─────────────────────────────────────────────
  const allCategories = useMemo(() => getAllCategories(inventory), [inventory]);
  const allTags = useMemo(() => getAllTags(inventory), [inventory]);
  const filteredItems = useMemo(
    () => filterInventory(inventory, filters),
    [inventory, filters]
  );
  const selectedItems = useMemo(
    () => inventory.filter((item) => selectedIds.has(item.id)),
    [inventory, selectedIds]
  );

  // ── Selection handlers ────────────────────────────────────────────────────
  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < MAX_SELECTION) next.add(id);
      }
      return next;
    });
  }, []);

  // Used by SelectedItemsPanel chips (explicit removal, not a toggle)
  const handleRemove = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ── Filter handlers ───────────────────────────────────────────────────────
  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  // Passes selected item IDs to /recipes via query string so the recipes page
  // can read them with useSearchParams() or equivalent.
  const handleFindRecipes = useCallback(() => {
    if (selectedIds.size === 0) return;
    const ids = [...selectedIds].join(",");
    router.push(`/recipes?items=${ids}`);
  }, [selectedIds, router]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    // Extra bottom padding on mobile so content isn't hidden behind the fixed bar
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Page header — mirrors homepage section rhythm ── */}
        <div className="mb-8">
          <p className="text-pantry-green text-sm font-semibold uppercase tracking-widest mb-2">
            The Pantry at ASUCD · UC Davis
          </p>
          <h1
            className="text-4xl sm:text-5xl text-pantry-green mb-3"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            Browse the Pantry
          </h1>
          <p className="text-foreground/70 max-w-xl">
            Pick the items you grabbed this week and we&apos;ll turn them into a
            real meal.
          </p>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Left: filter sidebar (desktop only) ── */}
          <aside
            className="hidden lg:block w-56 shrink-0 sticky top-6"
            aria-label="Inventory filters"
          >
            <Card className="p-5">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                allCategories={allCategories}
                allTags={allTags}
                resultCount={filteredItems.length}
                onClear={handleClearFilters}
              />
            </Card>
          </aside>

          {/* ── Center: main content area ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Search */}
            <SearchBar
              value={filters.search}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, search: val }))
              }
            />

            {/* Mobile: filter toggle button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileFilters((v) => !v)}
                aria-expanded={showMobileFilters}
                aria-controls="mobile-filter-panel"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pantry-tan text-sm font-medium text-pantry-green hover:bg-pantry-tan/20 transition-colors focus:outline-none focus:ring-2 focus:ring-pantry-green"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h18M7 8h10M10 12h4"
                  />
                </svg>
                Filters
                {isFiltersActive(filters) && (
                  <span
                    className="w-2 h-2 rounded-full bg-pantry-coral"
                    aria-label="Filters active"
                  />
                )}
              </button>

              {showMobileFilters && (
                <Card id="mobile-filter-panel" className="mt-2 p-5">
                  <FilterPanel
                    filters={filters}
                    onChange={setFilters}
                    allCategories={allCategories}
                    allTags={allTags}
                    resultCount={filteredItems.length}
                    onClear={handleClearFilters}
                  />
                </Card>
              )}
            </div>

            {/* Results meta row (desktop) */}
            <div className="hidden lg:flex items-center justify-between text-sm text-foreground/60">
              <span>
                {loading
                  ? "Loading…"
                  : `${filteredItems.length} result${filteredItems.length !== 1 ? "s" : ""}`}
              </span>
              {isFiltersActive(filters) && !loading && (
                <button
                  onClick={handleClearFilters}
                  className="text-pantry-coral hover:text-pantry-green underline underline-offset-2 transition-colors focus:outline-none"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* ── Content states ── */}

            {/* Error state */}
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-pantry-coral/30 bg-pantry-coral/10 p-8 text-center space-y-3"
              >
                <p className="text-sm font-semibold text-pantry-coral">
                  Failed to load inventory
                </p>
                <p className="text-xs text-pantry-coral/80">
                  {error.message}
                </p>
                <Button variant="primary" onClick={loadInventory}>
                  Retry
                </Button>
              </div>
            )}

            {/* Loading skeleton grid */}
            {!error && loading && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                aria-busy="true"
                aria-label="Loading inventory items"
              >
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!error && !loading && filteredItems.length === 0 && (
              <Card className="p-10 text-center space-y-2">
                <p className="font-semibold text-pantry-green">
                  No items found
                </p>
                <p className="text-sm text-foreground/60">
                  Try adjusting your search or filters.
                </p>
                {isFiltersActive(filters) && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-1 text-sm text-pantry-coral hover:text-pantry-green underline underline-offset-2 transition-colors focus:outline-none"
                  >
                    Clear all filters
                  </button>
                )}
              </Card>
            )}

            {/* Item grid */}
            {!error && !loading && filteredItems.length > 0 && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                role="list"
                aria-label={`${filteredItems.length} pantry items`}
              >
                {filteredItems.map((item) => (
                  <div key={item.id} role="listitem" className="h-full">
                    <InventoryCard
                      item={item}
                      isSelected={selectedIds.has(item.id)}
                      onToggle={handleToggle}
                      selectionCount={selectedIds.size}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: selected items panel (desktop only) ── */}
          <aside
            className="hidden lg:flex lg:flex-col w-64 shrink-0 sticky top-6"
            style={{ height: "calc(100vh - 6rem)" }}
            aria-label="Selected items"
          >
            <Card className="p-5 h-full flex flex-col">
              <SelectedItemsPanel
                selectedItems={selectedItems}
                onRemove={handleRemove}
                onClear={handleClearSelection}
                onFindRecipes={handleFindRecipes}
              />
            </Card>
          </aside>
        </div>
      </div>

      {/* ── Mobile: fixed bottom bar — styled like the navbar ── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-pantry-green shadow-lg"
        aria-label="Mobile selection bar"
      >
        {/* Expandable selected items tray */}
        {showMobileSelected && (
          <div
            className="px-4 pt-3 pb-2 max-h-52 overflow-y-auto border-b border-pantry-cream/20 space-y-1.5"
            aria-label="Selected items"
          >
            {selectedItems.length === 0 ? (
              <p className="text-sm text-center text-pantry-cream/50 py-2">
                No items selected yet
              </p>
            ) : (
              selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 py-1.5 px-3 rounded-full bg-pantry-cream/10 border border-pantry-cream/20"
                >
                  <span className="text-sm text-pantry-cream truncate">
                    {item.name}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="shrink-0 text-pantry-cream/50 hover:text-pantry-coral transition-colors focus:outline-none"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bottom bar controls */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setShowMobileSelected((v) => !v)}
            aria-expanded={showMobileSelected}
            className="flex items-center gap-2 text-sm font-medium text-pantry-cream focus:outline-none"
          >
            <span className="w-6 h-6 rounded-full bg-pantry-amber text-pantry-green text-xs flex items-center justify-center font-bold">
              {selectedIds.size}
            </span>
            <span>{showMobileSelected ? "Hide" : "Show"} selected</span>
            <svg
              className={`w-4 h-4 text-pantry-cream transition-transform ${showMobileSelected ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          <div className="flex-1" />

          <Button
            variant="primary"
            disabled={selectedIds.size === 0}
            onClick={handleFindRecipes}
          >
            Find recipes
          </Button>
        </div>
      </div>
    </div>
  );
}
