"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { addItem } from "@/store/cartSlice";
import { useDispatch } from "react-redux";
import { Search, Star } from "lucide-react";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";

type TSort = "relevance" | "price-asc" | "price-desc" | "rating-desc";

export default function ShopPage() {
  const dispatch = useDispatch();

  // Build filter lists from static data (client only)
  // If you have a lot of products, this could also come from server.
  const { categories, brands } = useMemo(() => {
    const prods = require("@/data/products").products as any[];
    return {
      categories: Array.from(new Set(prods.map((p) => p.category))).sort(),
      brands: Array.from(new Set(prods.map((p) => p.brand))).sort(),
    };
  }, []);

  // State (same as before)
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<TSort>("relevance");

  const toggleInSet = (value: string, set: Set<string>, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setMinPrice("");
    setMaxPrice("");
    setMinRating(null);
    setSearch("");
    setSortBy("relevance");
  };

  // Params for the hook — THIS is what fixes the sidebar filters
  const params = {
    q: search,
    categories: Array.from(selectedCategories),
    brands: Array.from(selectedBrands),
    minPrice,
    maxPrice,
    minRating,
    sort: sortBy,
    limit: 12,
  };

  // Infinite loader
  const { items, total, hasMore, loading, error, loadMore } = useInfiniteProducts(params);

  // Sentinel for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) loadMore();
      },
      { rootMargin: "600px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Top bar */}
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-lg border border-white/15 bg-black/50 px-9 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-red-600/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-white/70">Sort by</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TSort)}
              className="rounded-md border border-white/15 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/40"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating-desc">Rating: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 pb-12 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar (unchanged visually) */}
        <aside className="lg:sticky lg:top-20 h-fit rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-white/70">
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-xs text-white/60 hover:text-white underline underline-offset-2"
            >
              Clear all
            </button>
          </div>

          <fieldset className="mb-5">
            <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-white/60">Category</legend>
            <div className="space-y-2">
              {categories.map((c: string) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(c)}
                    onChange={() => toggleInSet(c, selectedCategories, setSelectedCategories)}
                    className="h-4 w-4 rounded border-white/20 bg-black focus:outline-none focus:ring-2 focus:ring-red-600/40"
                  />
                  <span className="capitalize">{c}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mb-5">
            <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-white/60">Brand</legend>
            <div className="max-h-48 overflow-y-auto pr-1 no-scrollbar space-y-2">
              {brands.map((b: string) => (
                <label key={b} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedBrands.has(b)}
                    onChange={() => toggleInSet(b, selectedBrands, setSelectedBrands)}
                    className="h-4 w-4 rounded border-white/20 bg-black focus:outline-none focus:ring-2 focus:ring-red-600/40"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mb-5">
            <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-white/60">Price</legend>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-md border border-white/15 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/40"
              />
              <span className="text-white/60">—</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-md border border-white/15 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/40"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-white/60">Rating</legend>
            <div className="space-y-2">
              {[4.5, 4.0].map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(r)}
                    className="h-4 w-4 rounded-full border-white/20 bg-black focus:outline-none focus:ring-2 focus:ring-red-600/40"
                  />
                  <span>{r}+ stars</span>
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === null}
                  onChange={() => setMinRating(null)}
                  className="h-4 w-4 rounded-full border-white/20 bg-black focus:outline-none focus:ring-2 focus:ring-red-600/40"
                />
                <span>Any rating</span>
              </label>
            </div>
          </fieldset>
        </aside>

        {/* Products */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Shop</h1>
            <div className="text-sm text-white/70">
              {total} result{total !== 1 && "s"}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-400/30 bg-red-900/20 p-3 text-sm">
              {error}
            </div>
          )}

          {items.length === 0 && !loading ? (
            <div className="rounded-lg border border-white/10 bg-black/40 p-8 text-center">
              <p className="text-white/80">No products match your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <article
                    key={p.id}
                    className="overflow-hidden rounded-lg border border-white/10 bg-black/50 shadow hover:shadow-lg transition"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-xs uppercase tracking-wide text-white/70">{p.brand}</div>
                      <h3 className="mt-1 line-clamp-2 font-semibold">{p.name}</h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{p.rating.toFixed(1)}</span>
                        <span className="text-white/50">({p.reviewsCount})</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-lg font-bold text-red-500">${p.price.toFixed(2)}</div>
                        <button
                          onClick={() =>
                            dispatch(
                              addItem({
                                id: p.id,
                                name: p.name,
                                price: p.price,
                                image: p.image,
                                quantity: 1,
                              })
                            )
                          }
                          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/40"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Sentinel */}
              <div ref={sentinelRef} className="h-12" />

              {loading && (
                <div className="mt-4 text-center text-sm text-white/70">Loading…</div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
