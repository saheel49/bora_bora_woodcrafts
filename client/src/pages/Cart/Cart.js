import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/currency";

// ─── Cart Page ────────────────────────────────────────────────────────────────
function Cart() {
  const { cart, removeItem, updateQty, subtotal, clearCart } = useCart();

  // Shipping is calculated at checkout based on city — show estimate here
  const SHIPPING = 0; // placeholder, real cost set at checkout
  const total    = subtotal + SHIPPING;

  if (cart.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-wood-700 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-wood-500 dark:text-dark-muted mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-wood-700 text-cream px-6 py-2.5 rounded font-medium hover:bg-wood-600 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Cart items */}
        <section className="flex-1" aria-label="Cart items">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-4 flex gap-4 items-start">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-wood-50 dark:bg-dark-surface"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/product/${item.id}`} className="font-semibold text-wood-700 dark:text-white hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-xs text-wood-400 dark:text-dark-muted mb-2">{item.category}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded border border-wood-200 dark:border-dark-border flex items-center justify-center hover:bg-wood-100 dark:hover:bg-dark-surface transition text-wood-700 dark:text-white font-bold"
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="text-wood-700 dark:text-white font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded border border-wood-200 dark:border-dark-border flex items-center justify-center hover:bg-wood-100 dark:hover:bg-dark-surface transition text-wood-700 dark:text-white font-bold"
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-wood-700 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-xs text-wood-400 dark:text-dark-muted mb-3">
                    {formatPrice(item.price)} each
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-5 text-sm text-wood-400 hover:text-red-500 underline transition"
          >
            Clear cart
          </button>
        </section>

        {/* Order summary */}
        <aside className="w-full lg:w-72" aria-label="Order summary">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-wood-700 dark:text-white mb-5">Order Summary</h2>

            <dl className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-wood-600 dark:text-dark-muted">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-wood-600 dark:text-dark-muted">
                <dt>Shipping</dt>
                <dd><span className="text-wood-400 dark:text-dark-muted italic">Calculated at checkout</span></dd>
              </div>
              <div className="flex justify-between font-bold text-wood-700 dark:text-white pt-3 border-t border-wood-100 dark:border-dark-border">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
            </dl>

            <Link
              to="/checkout"
              className="block w-full bg-wood-700 text-cream text-center py-3 rounded font-bold hover:bg-wood-600 transition"
            >
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="block text-center text-sm text-wood-500 dark:text-dark-muted mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
