import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../../data/products";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/currency";

// ─── Product Detail Page ──────────────────────────────────────────────────────
function Product() {
  const { id }      = useParams();
  const { addItem } = useCart();

  // Scroll to top every time a new product page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const product = products.find((p) => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [activeTab, setActiveTab]         = useState("description");
  const [added, setAdded]                 = useState(false);

  // Reset state whenever product changes
  useEffect(() => {
    setSelectedImage(0);
    setActiveTab("description");
    setLightboxOpen(false);
    setAdded(false);
  }, [id]);

  const related = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // Reviews come from the product's own reviewList in products.js
  const reviews = product.reviewList || [];

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-wood-500 dark:text-dark-muted text-lg">Product not found.</p>
        <Link to="/shop" className="text-wood-600 underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-wood-400" : "text-gray-300"}>★</span>
    ));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-wood-500 dark:text-dark-muted mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">Home</Link> {" / "}
        <Link to="/shop" className="hover:underline">Shop</Link> {" / "}
        <span className="text-wood-700 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">

        {/* Image gallery */}
        <div>
          <button
            className="w-full rounded-xl overflow-hidden bg-wood-50 dark:bg-dark-surface block focus:outline-none focus:ring-2 focus:ring-wood-400"
            onClick={() => setLightboxOpen(true)}
            aria-label="View full image"
          >
            <div className="aspect-[4/3] w-full overflow-hidden relative group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <span className="bg-white/80 text-wood-700 text-xs font-medium px-3 py-1.5 rounded-full shadow">
                  🔍 Click to enlarge
                </span>
              </div>
            </div>
          </button>

          {product.images.length > 1 && (
            <div className="flex gap-3 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`rounded-lg overflow-hidden border-2 transition flex-1 aspect-[4/3] ${
                    selectedImage === i ? "border-wood-500 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <span className="text-xs font-medium text-forest dark:text-forest-light uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-wood-700 dark:text-white mt-1 mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="flex text-lg">{renderStars(product.rating)}</span>
            <span className="text-wood-500 dark:text-dark-muted text-sm">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-wood-600 dark:text-wood-300">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-gray-400 line-through text-lg">{formatPrice(product.oldPrice)}</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                  SAVE {formatPrice(product.oldPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="text-wood-500 dark:text-dark-muted mb-6 leading-relaxed">{product.shortDescription}</p>

          <p className="text-sm mb-5">
            {product.stock > 5
              ? <span className="text-forest">✅ In Stock ({product.stock} available)</span>
              : <span className="text-amber-600">⚠️ Only {product.stock} left!</span>
            }
          </p>

          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-lg font-bold text-base transition ${
              added
                ? "bg-forest text-white"
                : "bg-wood-700 dark:bg-wood-600 text-cream hover:bg-wood-600 dark:hover:bg-wood-500"
            }`}
          >
            {added ? "✓ Added to Cart!" : "Add to Cart"}
          </button>

          <button className="w-full mt-3 py-2.5 rounded-lg border border-wood-300 dark:border-dark-border text-wood-600 dark:text-dark-muted text-sm hover:bg-wood-50 dark:hover:bg-dark-surface transition">
            ♡ Add to Wishlist
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-14">
        <div className="flex border-b border-wood-200 dark:border-dark-border mb-6">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-wood-600 text-wood-700 dark:text-white"
                  : "border-transparent text-wood-400 dark:text-dark-muted hover:text-wood-600"
              }`}
            >
              {tab === "reviews" ? `Reviews (${reviews.length})` : tab}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <p className="text-wood-500 dark:text-dark-muted leading-relaxed max-w-2xl">{product.description}</p>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-5 max-w-2xl">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-wood-700 dark:text-white">{r.name}</span>
                  <span className="text-xs text-wood-400 dark:text-dark-muted">{r.date}</span>
                </div>
                <div className="flex text-base mb-2">{renderStars(r.rating)}</div>
                <p className="text-wood-500 dark:text-dark-muted text-sm">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-bold text-wood-700 dark:text-white mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full size image"
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-wood-300 transition"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-6 flex gap-3" onClick={(e) => e.stopPropagation()}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === i ? "border-wood-300" : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Product;
