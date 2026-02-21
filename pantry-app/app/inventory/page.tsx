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
  const handleAdd = useCallback(
    (id: string) => {
      if (selectedIds.size >= MAX_SELECTION) return;
      setSelectedIds((prev) => new Set([...prev, id]));
    },
    [selectedIds.size]
  );

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 lg:pb-0">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Pantry Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse what&apos;s available at ASUCD Pantry and select items to
            find recipes.
          </p>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Left: filter sidebar (desktop only) ── */}
          <aside
            className="hidden lg:block w-56 shrink-0 sticky top-6"
            aria-label="Inventory filters"
          >
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                allCategories={allCategories}
                allTags={allTags}
                resultCount={filteredItems.length}
                onClear={handleClearFilters}
              />
            </div>
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
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
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
                    className="w-2 h-2 rounded-full bg-black dark:bg-white"
                    aria-label="Filters active"
                  />
                )}
              </button>

              {showMobileFilters && (
                <div
                  id="mobile-filter-panel"
                  className="mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
                >
                  <FilterPanel
                    filters={filters}
                    onChange={setFilters}
                    allCategories={allCategories}
                    allTags={allTags}
                    resultCount={filteredItems.length}
                    onClear={handleClearFilters}
                  />
                </div>
              )}
            </div>

            {/* Results meta row (desktop) */}
            <div className="hidden lg:flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                {loading
                  ? "Loading…"
                  : `${filteredItems.length} result${filteredItems.length !== 1 ? "s" : ""}`}
              </span>
              {isFiltersActive(filters) && !loading && (
                <button
                  onClick={handleClearFilters}
                  className="underline underline-offset-2 hover:text-black dark:hover:text-white transition focus:outline-none"
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
                className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center space-y-3"
              >
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Failed to load inventory
                </p>
                <p className="text-xs text-red-500 dark:text-red-500">
                  {error.message}
                </p>
                <button
                  onClick={loadInventory}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  Retry
                </button>
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

            {/* Empty state (no results) */}
            {!error && !loading && filteredItems.length === 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-10 text-center space-y-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  No items found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Try adjusting your search or filters.
                </p>
                {isFiltersActive(filters) && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-1 text-sm text-black dark:text-white underline underline-offset-2 focus:outline-none"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
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
                      onAdd={handleAdd}
                      onRemove={handleRemove}
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
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 h-full flex flex-col">
              <SelectedItemsPanel
                selectedItems={selectedItems}
                onRemove={handleRemove}
                onClear={handleClearSelection}
                onFindRecipes={handleFindRecipes}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile: fixed bottom bar ── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
        aria-label="Mobile selection bar"
      >
        {/* Expandable selected items list */}
        {showMobileSelected && (
          <div
            className="p-3 max-h-52 overflow-y-auto border-b border-gray-100 dark:border-gray-800 space-y-1.5"
            aria-label="Selected items"
          >
            {selectedItems.length === 0 ? (
              <p className="text-sm text-center text-gray-400 dark:text-gray-500 py-2">
                No items selected yet
              </p>
            ) : (
              selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                    {item.name}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="shrink-0 text-gray-400 hover:text-black dark:hover:text-white transition focus:outline-none"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
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
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center font-bold">
              {selectedIds.size}
            </span>
            <span>{showMobileSelected ? "Hide" : "Show"} selected</span>
            <svg
              className={`w-4 h-4 transition-transform ${showMobileSelected ? "rotate-180" : ""}`}
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

          <button
            onClick={handleFindRecipes}
            disabled={selectedIds.size === 0}
            aria-disabled={selectedIds.size === 0}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black dark:focus:ring-white",
              selectedIds.size === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100",
            ].join(" ")}
          >
            Find recipes
          </button>
        </div>
      </div>
    </div>
  );
}
