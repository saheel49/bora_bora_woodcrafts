import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/currency";

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const { addItem } = useCart();

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-wood-400" : "text-gray-300"}>★</span>
    ));

  return (
    <article className="bg-white dark:bg-dark-card rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden group flex flex-col">

      {/* Product image — fixed aspect ratio */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden bg-wood-50 dark:bg-dark-surface">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-forest dark:text-forest-light font-medium uppercase tracking-wide">
          {product.category}
        </span>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-wood-700 dark:text-white font-semibold mt-1 mb-1 hover:text-wood-500 transition line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-sm mb-2">
          <span className="flex">{renderStars(product.rating)}</span>
          <span className="text-gray-500 dark:text-dark-muted text-xs">({product.reviews})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-wood-600 dark:text-wood-300 font-bold text-base">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            className="w-full bg-wood-700 dark:bg-wood-600 text-cream py-2 rounded-lg hover:bg-wood-600 dark:hover:bg-wood-500 transition font-medium text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
