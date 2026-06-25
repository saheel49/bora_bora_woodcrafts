import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/currency";

// ─── Checkout Page ────────────────────────────────────────────────────────────
function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const SHIPPING = subtotal >= 15000 ? 0 : 500;
  const total    = subtotal + SHIPPING;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", address: "", city: "", country: "Kenya",
  });
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [mpesaPhone, setMpesaPhone]       = useState("");
  const [orderPlaced, setOrderPlaced]     = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST order to backend API
    // TODO: Trigger M-Pesa STK push via backend /api/payments/mpesa (Safaricom Daraja API)
    console.log("Order placed:", { form, cart, paymentMethod, total });
    clearCart();
    setOrderPlaced(true);
    setTimeout(() => navigate("/account"), 3000);
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
      <div className="text-center py-24">
        <p className="text-6xl mb-4">🎉</p>
        <h2 className="text-3xl font-bold text-wood-700 dark:text-white mb-2">Order Placed!</h2>
        <p className="text-wood-500 dark:text-dark-muted mb-2">
          Thank you, {form.firstName}. We'll confirm your order shortly.
        </p>
        <p className="text-sm text-wood-400 dark:text-dark-muted">Redirecting to your account...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

        {/* Customer Details + Payment */}
        <div className="flex-1 space-y-6">

          <fieldset className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6">
            <legend className="text-lg font-bold text-wood-700 dark:text-white mb-4">Delivery Details</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "firstName", label: "First Name",     type: "text",  placeholder: "Jane"               },
                { name: "lastName",  label: "Last Name",      type: "text",  placeholder: "Wanjiku"             },
                { name: "email",     label: "Email",          type: "email", placeholder: "jane@example.com", span: true },
                { name: "phone",     label: "Phone",          type: "tel",   placeholder: "+254 700 000 000", span: true },
                { name: "address",   label: "Street Address", type: "text",  placeholder: "123 Uhuru Street", span: true },
                { name: "city",      label: "City",           type: "text",  placeholder: "Nairobi"            },
                { name: "country",   label: "Country",        type: "text",  placeholder: "Kenya"              },
              ].map(({ name, label, type, placeholder, span }) => (
                <div key={name} className={span ? "sm:col-span-2" : ""}>
                  <label htmlFor={name} className="block text-sm font-medium text-wood-700 dark:text-white mb-1">
                    {label}
                  </label>
                  <input
                    id={name} name={name} type={type}
                    value={form[name]} onChange={handleChange}
                    required placeholder={placeholder}
                    className="w-full border border-wood-200 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400"
                  />
                </div>
              ))}
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
                  <label htmlFor="mpesa-phone" className="text-sm font-medium text-wood-700 dark:text-white block mb-1">
                    M-Pesa Phone Number
                  </label>
                  <input
                    id="mpesa-phone" type="tel" value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full border border-wood-200 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400"
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

        {/* Order Summary */}
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
                <dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-wood-600 dark:text-dark-muted">
                <dt>Shipping</dt>
                <dd>
                  {SHIPPING === 0
                    ? <span className="text-forest">Free</span>
                    : formatPrice(SHIPPING)
                  }
                </dd>
              </div>
              <div className="flex justify-between font-bold text-wood-700 dark:text-white pt-2 border-t border-wood-100 dark:border-dark-border">
                <dt>Total</dt><dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              className="mt-5 w-full bg-wood-700 text-cream py-3 rounded font-bold hover:bg-wood-600 transition"
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
