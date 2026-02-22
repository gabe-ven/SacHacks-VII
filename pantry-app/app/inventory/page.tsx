"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getDailyInventory } from "@/lib/getDailyInventory";
import {
  filterInventory,
  getAllCategories,
  getAllTags,
  isFiltersActive,
} from "@/lib/inventoryFilters";
import { getLocalDayOfWeek, parseDayParam, toDayParam, wrapDay } from "@/lib/days";
import type { FilterState, InventoryItem } from "@/types/inventory";

import SearchBar from "@/components/inventory/SearchBar";
import FilterPanel from "@/components/inventory/FilterPanel";
import InventoryCard from "@/components/inventory/InventoryCard";
import SelectedItemsPanel from "@/components/inventory/SelectedItemsPanel";
import SkeletonCard from "@/components/inventory/SkeletonCard";
import DayCarousel from "@/components/DayCarousel";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// ── Constants ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "pantry_selected_items_v1";
const MAX_SELECTION = 20;
const SKELETON_COUNT = 12;
const ITEMS_PER_PAGE = 24;

const DEFAULT_FILTERS: FilterState = {
  search: "",
  categories: [],
  stockStatus: "all",
  tags: [],
};

function isRecipeEligibleCategory(category: string): boolean {
  return category.trim().toLowerCase() !== "personal care";
}

// ── Page component ─────────────────────────────────────────────────────────
export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Data state ────────────────────────────────────────────────────────────
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<number>(() => getLocalDayOfWeek());
  const [dayInitialized, setDayInitialized] = useState(false);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // ── Selection state ───────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Track whether localStorage has been read so we don't overwrite it on first render
  const [hydrated, setHydrated] = useState(false);

  // ── Mobile UI toggles ─────────────────────────────────────────────────────
  const [showMobileSelected, setShowMobileSelected] = useState(false);
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const isWeekendView = dayOfWeek === 0 || dayOfWeek === 6;

  // ── Load inventory for selected day ───────────────────────────────────────
  const loadInventory = useCallback(async (targetDay: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDailyInventory(targetDay);
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize day from URL (?day=mon) or keep local current day.
  useEffect(() => {
    const parsedDay = parseDayParam(searchParams.get("day"));
    const nextDay = parsedDay ?? getLocalDayOfWeek();
    setDayOfWeek((prev) => (prev === nextDay ? prev : nextDay));
    setDayInitialized(true);
  }, [searchParams]);

  // Keep URL in sync with selected day for shareable links.
  useEffect(() => {
    if (!dayInitialized) return;
    const desired = toDayParam(dayOfWeek);
    const current = searchParams.get("day");
    if (current === desired) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("day", desired);
    router.replace(`/inventory?${next.toString()}`, { scroll: false });
  }, [dayInitialized, dayOfWeek, router, searchParams]);

  useEffect(() => {
    if (!dayInitialized) return;
    loadInventory(dayOfWeek);
  }, [dayInitialized, dayOfWeek, loadInventory]);

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

  // ── Clear selection when leaving the inventory page ───────────────────────
  useEffect(() => {
    return () => {
      localStorage.removeItem(STORAGE_KEY);
    };
  }, []);

  // ── Derived values (memoised) ─────────────────────────────────────────────
  const allCategories = useMemo(() => getAllCategories(inventory), [inventory]);
  const allTags = useMemo(() => getAllTags(inventory), [inventory]);
  const filteredItems = useMemo(() => {
    const items = filterInventory(inventory, filters);
    const stockOrder: Record<string, number> = { in_stock: 0, low_stock: 1, out_of_stock: 2 };
    return [...items].sort((a, b) => {
      const diff = (stockOrder[a.stockStatus] ?? 2) - (stockOrder[b.stockStatus] ?? 2);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });
  }, [inventory, filters]);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredItems]);
  const selectedItems = useMemo(
    () => inventory.filter((item) => selectedIds.has(item.id)),
    [inventory, selectedIds]
  );
  const recipeEligibleSelectedIds = useMemo(
    () =>
      selectedItems
        .filter((item) => isRecipeEligibleCategory(item.category))
        .map((item) => item.id),
    [selectedItems]
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

  const handleBlockedSelection = useCallback((message: string) => {
    setSelectionWarning(message);
  }, []);

  // ── Filter handlers ───────────────────────────────────────────────────────
  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  // Passes selected item names to /recipes via query string for ingredient matching.
  const handleFindRecipes = useCallback(() => {
    if (recipeEligibleSelectedIds.length === 0) return;
    const names = selectedItems
      .filter((item) => recipeEligibleSelectedIds.includes(item.id))
      .map((item) => encodeURIComponent(item.name))
      .join(",");
    router.push(`/recipes?items=${names}`);
  }, [recipeEligibleSelectedIds, selectedItems, router]);

  useEffect(() => {
    if (!selectionWarning) return;
    const timeoutId = window.setTimeout(() => setSelectionWarning(null), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [selectionWarning]);

  // Reset pagination when filter/day context changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [dayOfWeek, filters]);

  // Keep current page in bounds as data changes.
  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 py-6 sm:py-12">

        {/* ── Page header ── */}
        <div className="mb-8 relative overflow-hidden rounded-2xl sm:rounded-3xl bg-pantry-green px-5 py-8 sm:px-8 sm:py-12 flex flex-col gap-2 sm:gap-3">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <span className="relative z-10 text-pantry-amber text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
            The Pantry at ASUCD · UC Davis
          </span>
          <h1
            className="relative z-10 text-4xl sm:text-5xl md:text-6xl text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Browse the Pantry
          </h1>
          <p className="relative z-10 text-pantry-cream/60 max-w-md text-xs sm:text-sm leading-relaxed">
            Pick the items you grabbed this week and we&apos;ll generate a real meal from them.
          </p>
        </div>

        {/* ── Day selector ── */}
        <div className="mb-4">
          <DayCarousel
            dayOfWeek={dayOfWeek}
            onChange={(nextDay) => setDayOfWeek(wrapDay(nextDay))}
          />
        </div>
        {/* ── Search + filter bar — full width above the grid ── */}
        <div className="space-y-3 mb-6">
          <SearchBar
            value={filters.search}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, search: val }))
            }
          />
          {selectionWarning && (
            <div
              role="alert"
              className="rounded-xl border border-pantry-coral/30 bg-pantry-coral/10 px-4 py-2 text-sm text-pantry-coral"
            >
              {selectionWarning}
            </div>
          )}
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            allCategories={allCategories}
            allTags={allTags}
            resultCount={loading ? 0 : filteredItems.length}
            onClear={handleClearFilters}
          />
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Center: main content area ── */}
          <div className="flex-1 min-w-0 space-y-4">
            {isWeekendView && 
              <div className="rounded-xl border border-pantry-amber/40 bg-pantry-amber/15 px-4 py-2 text-sm font-medium text-pantry-green text-center font-bold">
                Stock may vary during weekend.
              </div>
            }

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
                <Button variant="primary" onClick={() => loadInventory(dayOfWeek)}>
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
                    className="mt-1 text-sm text-pantry-coral hover:text-pantry-green underline underline-offset-2 transition-colors focus:outline-none cursor-pointer"
                  >
                    Clear all filters
                  </button>
                )}
              </Card>
            )}

            {/* Item grid */}
            {!error && !loading && filteredItems.length > 0 && (
              <div className="space-y-4">
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 auto-rows-[96px]"
                  role="list"
                  aria-label={`${filteredItems.length} pantry items, page ${currentPage} of ${totalPages}`}
                >
                  {paginatedItems.map((item) => (
                    <div key={item.id} role="listitem" className="h-full">
                      <InventoryCard
                        item={item}
                        isSelected={selectedIds.has(item.id)}
                        onToggle={handleToggle}
                        selectionCount={selectedIds.size}
                        onBlockedSelect={handleBlockedSelection}
                      />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2" aria-label="Inventory pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className={[
                        "w-9 h-9 flex items-center justify-center rounded-full border transition-colors focus:outline-none cursor-pointer",
                        currentPage === 1
                          ? "border-border text-muted cursor-not-allowed"
                          : "border-pantry-tan text-pantry-green hover:bg-pantry-tan/20",
                      ].join(" ")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-foreground/60 min-w-24 text-center">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className={[
                        "w-9 h-9 flex items-center justify-center rounded-full border transition-colors focus:outline-none cursor-pointer",
                        currentPage === totalPages
                          ? "border-border text-muted cursor-not-allowed"
                          : "border-pantry-tan text-pantry-green hover:bg-pantry-tan/20",
                      ].join(" ")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: selected items panel (desktop only) ── */}
          <aside
            className="hidden lg:flex lg:flex-col w-64 shrink-0 sticky top-6"
            aria-label="Selected items"
          >
            <div className="p-5 flex flex-col rounded-2xl bg-surface-card border border-border">
              <SelectedItemsPanel
                selectedItems={selectedItems}
                onRemove={handleRemove}
                onClear={handleClearSelection}
                onFindRecipes={handleFindRecipes}
                canFindRecipes={recipeEligibleSelectedIds.length > 0}
              />
            </div>
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
            disabled={recipeEligibleSelectedIds.length === 0}
            onClick={handleFindRecipes}
          >
            Find recipes
          </Button>
        </div>
      </div>
    </div>
  );
}
