import React, { useState, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/currency";

// ─── Shipping Rates (KSh) per city ────────────────────────────────────────────
// Rates are approximate based on distance from Mombasa workshop
const SHIPPING_DATA = {
  Kenya: {
    cities: {
      "Mombasa":    0,     // Free — local pickup
      "Nairobi":    500,
      "Kisumu":     700,
      "Nakuru":     600,
      "Eldoret":    750,
      "Thika":      550,
      "Malindi":    300,
      "Nyeri":      650,
      "Meru":       700,
      "Kisii":      750,
    },
  },
  Uganda: {
    cities: {
      "Kampala":    1500,
      "Entebbe":    1600,
      "Jinja":      1700,
      "Gulu":       2000,
      "Mbarara":    1800,
      "Mbale":      1800,
    },
  },
  Tanzania: {
    cities: {
      "Dar es Salaam": 1200,
      "Arusha":        1400,
      "Zanzibar":      1300,
      "Mwanza":        1800,
      "Dodoma":        1600,
      "Tanga":         900,
      "Moshi":         1300,
    },
  },
};

// ─── Checkout Page ────────────────────────────────────────────────────────────
function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", address: "",
    country: "Kenya",
    city: "Nairobi",
  });

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [mpesaPhone, setMpesaPhone]       = useState("");
  const [orderPlaced, setOrderPlaced]     = useState(false);

  // Cities available for the selected country
  const availableCities = useMemo(() => {
    return Object.keys(SHIPPING_DATA[form.country]?.cities || {});
  }, [form.country]);

  // Shipping cost based on selected city
  const shippingCost = useMemo(() => {
    return SHIPPING_DATA[form.country]?.cities[form.city] ?? 500;
  }, [form.country, form.city]);

  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      // When country changes reset city to first city of that country
      const firstCity = Object.keys(SHIPPING_DATA[value]?.cities || {})[0] || "";
      setForm((prev) => ({ ...prev, country: value, city: firstCity }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST order to backend  →  POST /api/orders
    // Backend will send order receipt email to saheelamir49@gmail.com via Nodemailer + Gmail SMTP
    console.log("Order placed:", { form, cart, paymentMethod, shippingCost, total });
    clearCart();
    setOrderPlaced(true);
    setTimeout(() => navigate("/account"), 4000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="text-center py-20">
        <p className="text-wood-500 dark:text-dark-muted text-lg">No items to checkout.</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="text-center py-24 max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bold text-wood-700 dark:text-white mb-3">Order Placed!</h2>
        <p className="text-wood-500 dark:text-dark-muted mb-2">
          Thank you, <strong>{form.firstName}</strong>. Your order has been received.
        </p>
        <p className="text-wood-500 dark:text-dark-muted mb-6">
          We will confirm your order and reach out to you at <strong>{form.email}</strong> or <strong>{form.phone}</strong> shortly.
        </p>
        <div className="bg-wood-50 dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-4 text-sm text-wood-600 dark:text-white/60 mb-6">
          <p>📦 Delivering to: <strong className="text-wood-700 dark:text-white">{form.city}, {form.country}</strong></p>
          <p className="mt-1">💰 Total paid: <strong className="text-wood-700 dark:text-white">{formatPrice(total)}</strong></p>
        </div>
        <p className="text-xs text-wood-400 dark:text-dark-muted">Redirecting to your account...</p>
      </div>
    );
  }

  // Shared input/select class
  const fieldClass =
    "w-full border border-wood-200 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

        {/* ── Left column ─────────────────────────────────────────────────── */}
        <div className="flex-1 space-y-6">

          {/* Delivery Details */}
          <fieldset className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6">
            <legend className="text-lg font-bold text-wood-700 dark:text-white mb-4">
              Delivery Details
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* First + Last name */}
              {[
                { name: "firstName", label: "First Name", type: "text",  placeholder: "Jane"            },
                { name: "lastName",  label: "Last Name",  type: "text",  placeholder: "Wanjiku"         },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-wood-700 dark:text-white mb-1">{label}</label>
                  <input id={name} name={name} type={type} value={form[name]} onChange={handleChange} required placeholder={placeholder} className={fieldClass} />
                </div>
              ))}

              {/* Email */}
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-wood-700 dark:text-white mb-1">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="jane@example.com" className={fieldClass} />
              </div>

              {/* Phone */}
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-wood-700 dark:text-white mb-1">Phone</label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+254 700 000 000" className={fieldClass} />
              </div>

              {/* Street address */}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-wood-700 dark:text-white mb-1">Street Address</label>
                <input id="address" name="address" type="text" value={form.address} onChange={handleChange} required placeholder="123 Uhuru Street" className={fieldClass} />
              </div>

              {/* Country selector */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-wood-700 dark:text-white mb-1">Country</label>
                <select id="country" name="country" value={form.country} onChange={handleChange} className={fieldClass}>
                  {Object.keys(SHIPPING_DATA).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* City selector */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-wood-700 dark:text-white mb-1">City</label>
                <select id="city" name="city" value={form.city} onChange={handleChange} className={fieldClass}>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city} — {SHIPPING_DATA[form.country].cities[city] === 0 ? "Free" : `KSh ${SHIPPING_DATA[form.country].cities[city].toLocaleString()}`}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Shipping estimate banner */}
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm flex items-center justify-between ${
              shippingCost === 0
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                : "bg-wood-50 dark:bg-white/5 text-wood-600 dark:text-white/70 border border-wood-200 dark:border-white/10"
            }`}>
              <span>🚚 Shipping to <strong>{form.city}, {form.country}</strong></span>
              <span className="font-bold">
                {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
              </span>
            </div>
          </fieldset>

          {/* Payment options */}
          <fieldset className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6">
            <legend className="text-lg font-bold text-wood-700 dark:text-white mb-4">Payment Method</legend>
            <div className="space-y-3">

              {/* M-Pesa */}
              <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${paymentMethod === "mpesa" ? "border-wood-500 bg-wood-50 dark:bg-dark-surface" : "border-wood-200 dark:border-dark-border hover:bg-wood-50 dark:hover:bg-dark-surface"}`}>
                <input type="radio" name="payment" value="mpesa" checked={paymentMethod === "mpesa"} onChange={() => setPaymentMethod("mpesa")} className="mt-0.5 accent-wood-600" />
                <div>
                  <p className="font-medium text-wood-700 dark:text-white">📱 M-Pesa</p>
                  <p className="text-xs text-wood-400 dark:text-dark-muted">Lipa Na M-Pesa — STK push to your number</p>
                </div>
              </label>
              {paymentMethod === "mpesa" && (
                <div className="ml-6">
                  <label htmlFor="mpesa-phone" className="text-sm font-medium text-wood-700 dark:text-white block mb-1">M-Pesa Phone Number</label>
                  <input
                    id="mpesa-phone" type="tel" value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className={fieldClass}
                  />
                </div>
              )}

              {/* PayPal */}
              <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${paymentMethod === "paypal" ? "border-wood-500 bg-wood-50 dark:bg-dark-surface" : "border-wood-200 dark:border-dark-border hover:bg-wood-50 dark:hover:bg-dark-surface"}`}>
                <input type="radio" name="payment" value="paypal" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} className="mt-0.5 accent-wood-600" />
                <div>
                  <p className="font-medium text-wood-700 dark:text-white">💳 PayPal</p>
                  <p className="text-xs text-wood-400 dark:text-dark-muted">Pay securely via PayPal account or card</p>
                </div>
              </label>

              {/* Card */}
              <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${paymentMethod === "card" ? "border-wood-500 bg-wood-50 dark:bg-dark-surface" : "border-wood-200 dark:border-dark-border hover:bg-wood-50 dark:hover:bg-dark-surface"}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="mt-0.5 accent-wood-600" />
                <div>
                  <p className="font-medium text-wood-700 dark:text-white">🏦 Debit / Credit Card</p>
                  <p className="text-xs text-wood-400 dark:text-dark-muted">Visa, Mastercard (Stripe — coming soon)</p>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        {/* ── Order Summary ────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-72">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-wood-700 dark:text-white mb-4">Order Summary</h2>

            <ul className="space-y-2 mb-4">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-wood-600 dark:text-dark-muted">
                  <span className="line-clamp-1 flex-1">{item.name} × {item.quantity}</span>
                  <span className="ml-2 font-medium">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="text-sm border-t border-wood-100 dark:border-dark-border pt-3 space-y-2">
              <div className="flex justify-between text-wood-600 dark:text-dark-muted">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-wood-600 dark:text-dark-muted">
                <dt>Shipping ({form.city})</dt>
                <dd>
                  {shippingCost === 0
                    ? <span className="text-forest font-medium">Free</span>
                    : formatPrice(shippingCost)
                  }
                </dd>
              </div>
              <div className="flex justify-between font-bold text-wood-700 dark:text-white pt-2 border-t border-wood-100 dark:border-dark-border">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              className="mt-5 w-full bg-wood-700 dark:bg-white text-cream dark:text-black py-3 rounded font-bold hover:bg-wood-600 dark:hover:bg-gray-200 transition"
            >
              Place Order
            </button>
          </div>
        </aside>

      </form>
    </div>
  );
}

export default Checkout;
