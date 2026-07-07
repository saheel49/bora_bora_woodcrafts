import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import api from "../../utils/api";

const LOCAL_PRODUCT_IMAGES = {
  "Hand-Carved Wall Panel": "/images/hand-carved-wall-panel.jpg",
  "Acacia Wood Salad Bowl Set": "/images/acacia-wood-bowl.jpg",
  "Mahogany Side Table": "/images/mahogany-side-table.jpg",
  "Olive Wood Cheese Board": "/images/olive-wood-cheeese-board.jpg",
  "Geometric Wall Clock": "/images/geometric-wall-clock.jpg",
  "Teak Dining Chair": "/images/teak-dining-chair.jpg",
  "Wooden Spice Rack": "/images/wooden-spice-rack.jpg",
  "Abstract Tree Wall Art": "/images/abstract-tree-wall-art.jpg",
};

const getProductImages = (p) => {
  const validImages = (p.images || []).map((img) => img?.image_url).filter(Boolean);
  if (validImages.length > 0) return validImages;
  return [LOCAL_PRODUCT_IMAGES[p.name] || "/images/hand-crafted-wood-art.jpg"];
};

// ─── Shop Page — data from Django API ────────────────────────────────────────
function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice]         = useState(50000);
  const [sortBy, setSortBy]             = useState("newest");
  const [loading, setLoading]           = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) navigate("/admin");
  }, [isAdmin, navigate]);

  // Fetch all products from backend
  useEffect(() => {
    if (isAdmin) {
      setLoading(false);
      return;
    }

    api.get("/products/?page_size=100")
      .then((r) => {
        const data = Array.isArray(r.data) ? r.data : (r.data.results || []);
        setProducts(data);
        // Build category list from returned products
        const cats = ["All", ...new Set(data.map((p) => p.category?.name).filter(Boolean))];
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAdmin]);

  // Normalise a product from API shape → shape ProductCard expects
  const normalise = (p) => ({
    id:               p.id,
    name:             p.name,
    category:         p.category?.name || "",
    price:            parseFloat(p.price),
    oldPrice:         p.old_price ? parseFloat(p.old_price) : null,
    rating:           parseFloat(p.rating) || 0,
    reviews:          p.review_count || 0,
    stock:            p.stock,
    isFeatured:       p.is_featured,
    isBestSeller:     p.is_best_seller,
    images:           getProductImages(p),
    shortDescription: p.short_description,
    description:      p.description,
  });

  // Filter + sort
  const filtered = useMemo(() => {
    let list = products
      .map(normalise)
      .filter((p) => {
        const catMatch   = selectedCategory === "All" || p.category === selectedCategory;
        const priceMatch = p.price <= maxPrice;
        return catMatch && priceMatch;
      });

    if (sortBy === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, selectedCategory, maxPrice, sortBy]);

  if (isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-2">Our Collection</h1>
      <p className="text-wood-500 dark:text-dark-muted mb-8">
        {loading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0" aria-label="Filters">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-5 space-y-6">
            <div>
              <h3 className="font-semibold text-wood-700 dark:text-white mb-3">Category</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded transition ${
                        selectedCategory === cat
                          ? "bg-wood-700 text-cream"
                          : "hover:bg-wood-100 dark:hover:bg-dark-surface text-wood-600 dark:text-dark-muted"
                      }`}>
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-wood-700 dark:text-white mb-3">Max Price</h3>
              <input type="range" min={500} max={50000} step={500} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-wood-500" />
              <p className="text-sm text-wood-500 dark:text-dark-muted mt-1">
                Up to KSh {maxPrice.toLocaleString("en-KE")}
              </p>
            </div>
            <button onClick={() => { setSelectedCategory("All"); setMaxPrice(50000); setSortBy("newest"); }}
              className="w-full text-xs text-wood-500 underline hover:text-wood-700">
              Reset filters
            </button>
          </div>
        </aside>

        {/* Grid */}
        <section className="flex-1" aria-label="Product grid">
          <div className="flex justify-end mb-5">
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="border border-wood-200 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded px-3 py-1.5 text-sm text-wood-700 focus:outline-none focus:ring-1 focus:ring-wood-400">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-white/5 rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
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
