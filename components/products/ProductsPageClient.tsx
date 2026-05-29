"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import { SlidersHorizontal, X, ChevronDown, Search, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category { id: string; name: string; slug: string; _count: { products: number } }
interface Product {
  id: string; name: string; slug: string; price: number; comparePrice?: number | null;
  brand?: string | null; rating: number; reviewCount: number; soldCount: number;
  isNewArrival?: boolean; isFeatured?: boolean; isTrending?: boolean;
  images: Array<{ url: string; altText?: string | null }>;
  category: { name: string; slug: string }; inventory?: { quantity: number } | null;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "best_selling", label: "Best Selling" },
  { value: "trending", label: "Trending" },
  { value: "rating", label: "Highest Rated" },
];

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,500", min: 1000, max: 2500 },
  { label: "₹2,500 - ₹5,000", min: 2500, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: 999999 },
];

interface Props {
  initialProducts: Product[];
  total: number;
  pages: number;
  currentPage: number;
  categories: Category[];
  brands: string[];
  initialFilters: {
    category?: string; brand?: string; query?: string;
    sort?: string; minPrice?: string; maxPrice?: string;
  };
}

export default function ProductsPageClient({
  initialProducts, total, pages, currentPage, categories, brands, initialFilters,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams]
  );

  const clearFilters = () => {
    startTransition(() => router.push(pathname));
  };

  const activeFiltersCount = [
    initialFilters.category, initialFilters.brand,
    initialFilters.minPrice, initialFilters.query,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-dark-base">
      {/* Page Header */}
      <div className="relative border-b border-white/5 py-12 bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
            {initialFilters.category
              ? categories.find((c) => c.slug === initialFilters.category)?.name ?? "Products"
              : initialFilters.query
              ? `Search: "${initialFilters.query}"`
              : "All Products"}
          </h1>
          <p className="text-gray-400">
            {total.toLocaleString()} products found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          {/* Left: Filters toggle + Active filters */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                filtersOpen
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "glass border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              )}
              id="products-filter-btn"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors" id="products-clear-filters-btn">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}

            {/* Loading indicator */}
            {isPending && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          </div>

          {/* Right: Sort + View mode */}
          <div className="flex items-center gap-3">
            <select
              value={initialFilters.sort ?? "newest"}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500/50 transition-colors"
              id="products-sort-select"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-dark-300">{o.label}</option>
              ))}
            </select>

            <div className="flex glass rounded-xl border border-white/10 overflow-hidden">
              {(["grid", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === mode ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white"
                  )}
                  id={`products-view-${mode}-btn`}
                >
                  {mode === "grid" ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 280 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-64 space-y-6">
                  {/* Search */}
                  <div className="glass rounded-2xl border border-white/8 p-4">
                    <h3 className="font-semibold text-white text-sm mb-3">Search</h3>
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        defaultValue={initialFilters.query ?? ""}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") updateFilter("query", (e.target as HTMLInputElement).value);
                        }}
                        className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
                        id="products-search-input"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="glass rounded-2xl border border-white/8 p-4">
                    <h3 className="font-semibold text-white text-sm mb-3">Category</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => updateFilter("category", null)}
                        className={cn("w-full text-left px-3 py-2 rounded-xl text-sm transition-colors", !initialFilters.category ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5")}
                        id="category-filter-all"
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => updateFilter("category", cat.slug)}
                          className={cn("w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between", initialFilters.category === cat.slug ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5")}
                          id={`category-filter-${cat.slug}`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs text-gray-500">{cat._count.products}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="glass rounded-2xl border border-white/8 p-4">
                    <h3 className="font-semibold text-white text-sm mb-3">Price Range</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => { updateFilter("minPrice", null); updateFilter("maxPrice", null); }}
                        className={cn("w-full text-left px-3 py-2 rounded-xl text-sm transition-colors", !initialFilters.minPrice ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5")}
                        id="price-filter-all"
                      >
                        Any Price
                      </button>
                      {PRICE_RANGES.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => { updateFilter("minPrice", range.min.toString()); updateFilter("maxPrice", range.max.toString()); }}
                          className={cn("w-full text-left px-3 py-2 rounded-xl text-sm transition-colors", parseInt(initialFilters.minPrice ?? "0") === range.min ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5")}
                          id={`price-filter-${range.min}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  {brands.length > 0 && (
                    <div className="glass rounded-2xl border border-white/8 p-4">
                      <h3 className="font-semibold text-white text-sm mb-3">Brand</h3>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        <button
                          onClick={() => updateFilter("brand", null)}
                          className={cn("w-full text-left px-3 py-2 rounded-xl text-sm transition-colors", !initialFilters.brand ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5")}
                          id="brand-filter-all"
                        >
                          All Brands
                        </button>
                        {brands.map((brand) => (
                          <button
                            key={brand}
                            onClick={() => updateFilter("brand", brand)}
                            className={cn("w-full text-left px-3 py-2 rounded-xl text-sm transition-colors", initialFilters.brand === brand ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5")}
                            id={`brand-filter-${brand.toLowerCase()}`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {initialProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors" id="products-clear-search-btn">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className={cn(
                  "gap-4 sm:gap-6",
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid grid-cols-1"
                )}>
                  {initialProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => updateFilter("page", p.toString())}
                        className={cn(
                          "w-10 h-10 rounded-xl text-sm font-medium transition-all",
                          p === currentPage
                            ? "bg-blue-500 text-white shadow-glow-sm"
                            : "glass border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                        )}
                        id={`products-page-${p}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
