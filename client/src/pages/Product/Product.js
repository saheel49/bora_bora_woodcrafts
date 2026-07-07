import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/currency";
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

// ─── Normalise API product → local shape ──────────────────────────────────────
const normalise = (p) => ({
  id:               p.id,
  name:             p.name,
  category:         p.category?.name || p.category || "",
  price:            parseFloat(p.price),
  oldPrice:         p.old_price ? parseFloat(p.old_price) : null,
  rating:           parseFloat(p.rating) || 0,
  reviews:          p.review_count || 0,
  stock:            p.stock,
  isBestSeller:     p.is_best_seller,
  images:           getProductImages(p),
  shortDescription: p.short_description || "",
  description:      p.description || "",
  reviewList:       [],
});

// ─── Product Detail Page ──────────────────────────────────────────────────────
function Product() {
  const { id }      = useParams();
  const { addItem } = useCart();
  const { user, isAdmin }    = useAuth();
  const navigate    = useNavigate();

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading]   = useState(true);

  const [selectedImage, setSelectedImage]         = useState(0);
  const [lightboxOpen, setLightboxOpen]           = useState(false);
  const [activeTab, setActiveTab]                 = useState("description");
  const [added, setAdded]                         = useState(false);
  const [inWishlist, setInWishlist]               = useState(false);
  const [wishlistLoading, setWishlistLoading]     = useState(false);
  const [reviewForm, setReviewForm]               = useState({ rating: 5, text: "" });
  const [reviewSubmitting, setReviewSubmitting]   = useState(false);
  const [reviewError, setReviewError]             = useState("");

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSelectedImage(0);
    setActiveTab("description");
    setLightboxOpen(false);
    setAdded(false);
    setInWishlist(false);
  }, [id]);

  // Fetch product + reviews + related from API
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/products/${id}/`),
      api.get(`/reviews/products/${id}/`),
    ])
      .then(([prodRes, revRes]) => {
        const p = normalise(prodRes.data);
        setProduct(p);
        const revData = Array.isArray(revRes.data) ? revRes.data : (revRes.data.results || []);
        setReviews(revData);
        const currentReview = user ? revData.find((r) => r.author_id === user.id) : null;
        setExistingReview(currentReview || null);
        // Fetch related: same category
        return api.get(`/products/?page_size=20`);
      })
      .then((r) => {
        const all = Array.isArray(r.data) ? r.data : (r.data.results || []);
        setRelated(
          all
            .filter((p) => p.id !== parseInt(id))
            .slice(0, 4)
            .map(normalise)
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) {
      setExistingReview(null);
      return;
    }
    const currentReview = reviews.find((r) => r.author_id === user.id);
    setExistingReview(currentReview || null);
    if (currentReview) {
      setReviewForm({ rating: currentReview.rating, text: currentReview.text });
    }
  }, [user, reviews]);

  // Check wishlist
  useEffect(() => {
    if (!user || !id) return;
    api.get("/wishlist/")
      .then((r) => {
        const data = Array.isArray(r.data) ? r.data : (r.data.results || []);
        setInWishlist(data.some((w) => w.product?.id === parseInt(id)));
      })
      .catch(() => {});
  }, [user, id]);

  const handleWishlist = async () => {
    if (!user) { navigate("/account"); return; }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${id}/`);
        setInWishlist(false);
      } else {
        await api.post(`/wishlist/${id}/`);
        setInWishlist(true);
      }
    } catch { alert("Failed to update wishlist."); }
    setWishlistLoading(false);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!user) { navigate("/account"); return; }
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const { data } = existingReview
        ? await api.put(`/reviews/products/${id}/`, reviewForm)
        : await api.post(`/reviews/products/${id}/`, reviewForm);
      setReviews((prev) => existingReview ? prev.map((r) => (r.id === data.id ? data : r)) : [data, ...prev]);
      setExistingReview(data);
      setReviewForm(existingReview ? { rating: data.rating, text: data.text } : { rating: 5, text: "" });
    } catch (err) {
      setReviewError(err.response?.data?.error || err.response?.data?.detail || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[4/3] bg-wood-100 dark:bg-white/10 rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-wood-100 dark:bg-white/10 rounded w-1/3" />
            <div className="h-8 bg-wood-100 dark:bg-white/10 rounded w-3/4" />
            <div className="h-6 bg-wood-100 dark:bg-white/10 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-wood-500 dark:text-dark-muted text-lg">Product not found.</p>
        <Link to="/shop" className="text-wood-600 underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (isAdmin) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-wood-400" : "text-gray-300"}>★</span>
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

          {isAdmin && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4 text-sm text-amber-900 dark:text-amber-200">
              Admin accounts cannot purchase products. Please use the admin dashboard to manage the store.
            </div>
          )}

          <p className="text-sm mb-5">
            {product.stock > 5
              ? <span className="text-forest">✅ In Stock ({product.stock} available)</span>
              : <span className="text-amber-600">⚠️ Only {product.stock} left!</span>
            }
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isAdmin}
            className={`w-full py-3 rounded-lg font-bold text-base transition ${
              isAdmin
                ? "bg-wood-100 dark:bg-white/10 text-wood-500 dark:text-wood-400 cursor-not-allowed"
                : added
                ? "bg-forest text-white"
                : "bg-wood-700 dark:bg-wood-600 text-cream hover:bg-wood-600 dark:hover:bg-wood-500"
            }`}
          >
            {isAdmin ? "Admin cannot purchase" : added ? "✓ Added to Cart!" : "Add to Cart"}
          </button>

          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`w-full mt-3 py-2.5 rounded-lg border text-sm transition font-medium ${
              inWishlist
                ? "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100"
                : "border-wood-300 dark:border-dark-border text-wood-600 dark:text-dark-muted hover:bg-wood-50 dark:hover:bg-dark-surface"
            }`}
          >
            {wishlistLoading
              ? "..."
              : inWishlist
              ? "♥ Remove from Wishlist"
              : user
              ? "♡ Add to Wishlist"
              : "♡ Add to Wishlist (Login required)"
            }
          </button>        </div>
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
              {tab === "reviews" ? `Reviews (${reviews.length})` : tab}            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <p className="text-wood-500 dark:text-dark-muted leading-relaxed max-w-2xl">{product.description}</p>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-5 max-w-2xl">
            {reviews.length === 0 ? (
              <p className="text-wood-400 dark:text-dark-muted">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-wood-700 dark:text-white">{r.author_name || r.name}</span>
                    <span className="text-xs text-wood-400 dark:text-dark-muted">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString("en-KE") : r.date}
                    </span>
                  </div>
                  <div className="flex text-base mb-2">{renderStars(r.rating)}</div>
                  <p className="text-wood-500 dark:text-dark-muted text-sm">{r.text}</p>
                </div>
              ))
            )}

            <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-wood-700 dark:text-white mb-3">Share your review</h3>
              {existingReview && (
                <p className="text-sm text-wood-500 dark:text-dark-muted mb-3">
                  You already have a review for this product. Submit again to update it.
                </p>
              )}
              {reviewError && <p className="text-sm text-red-500 mb-3">{reviewError}</p>}
              {!user ? (
                <p className="text-wood-500 dark:text-dark-muted">
                  Please <button type="button" onClick={() => navigate("/account")}
                    className="underline text-wood-700 dark:text-white">log in</button> to leave a review.
                </p>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-wood-700 dark:text-white mb-2">Rating</label>
                    <select value={reviewForm.rating} onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wood-400">
                      {[5,4,3,2,1].map((stars) => (
                        <option key={stars} value={stars}>{stars} star{stars > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-wood-700 dark:text-white mb-2">Review</label>
                    <textarea rows={4} required value={reviewForm.text}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, text: e.target.value }))}
                      className="w-full border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wood-400"
                      placeholder="Write what you liked about the product..."
                    />
                  </div>
                  <button type="submit" disabled={reviewSubmitting}
                    className="bg-wood-700 dark:bg-white text-cream dark:text-black px-5 py-2 rounded-lg font-semibold hover:bg-wood-600 transition">
                    {reviewSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
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
