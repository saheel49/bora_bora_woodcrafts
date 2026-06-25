import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import products from "../../data/products";
import ProductCard from "../../components/ProductCard/ProductCard";

// ─── Shop Page ────────────────────────────────────────────────────────────────
function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy]                     = useState("newest");

  // Unique categories from data
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter + sort logic
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const catMatch   = selectedCategory === "All" || p.category === selectedCategory;
      const priceMatch = p.price <= maxPrice;
      return catMatch && priceMatch;
    });

    if (sortBy === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    // "newest" keeps original array order (by id)

    return list;
  }, [selectedCategory, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Page title */}
      <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-2">Our Collection</h1>
      <p className="text-wood-500 dark:text-dark-muted mb-8">
        {filtered.length} product{filtered.length !== 1 && "s"} found
      </p>

      <div className="flex flex-col md:flex-row gap-8">

        {/* ── Sidebar Filters ─────────────────────────────────────────────── */}
        <aside className="w-full md:w-56 shrink-0" aria-label="Filters">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-5 space-y-6">

            {/* Category filter */}
            <div>
              <h3 className="font-semibold text-wood-700 dark:text-white mb-3">Category</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded transition ${
                        selectedCategory === cat
                          ? "bg-wood-700 text-cream"
                          : "hover:bg-wood-100 dark:hover:bg-dark-surface text-wood-600 dark:text-dark-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price filter */}
            <div>
              <h3 className="font-semibold text-wood-700 dark:text-white mb-3">Max Price</h3>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-wood-500"
                aria-label="Maximum price filter"
              />
              <p className="text-sm text-wood-500 dark:text-dark-muted mt-1">
                Up to KSh {maxPrice.toLocaleString("en-KE")}
              </p>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setSelectedCategory("All"); setMaxPrice(50000); setSortBy("newest"); }}
              className="w-full text-xs text-wood-500 underline hover:text-wood-700"
            >
              Reset filters
            </button>
          </div>
        </aside>

        {/* ── Product Grid ────────────────────────────────────────────────── */}
        <section className="flex-1" aria-label="Product grid">

          {/* Sort bar */}
          <div className="flex justify-end mb-5">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-wood-200 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded px-3 py-1.5 text-sm text-wood-700 focus:outline-none focus:ring-1 focus:ring-wood-400"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-wood-500 text-center py-16">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Shop;
