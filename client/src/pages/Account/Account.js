import React, { useState } from "react";
import { formatPrice } from "../../utils/currency";

// ─── Account Page ─────────────────────────────────────────────────────────────
// Tabs: Login/Register · Order History · Wishlist
function Account() {
  const [tab,      setTab]      = useState("login");   // login | register | orders | wishlist
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Sample order history
  const orders = [
    { id: "ORD-001", date: "2024-03-15", status: "Delivered",  total: 11500, items: ["Hand-Carved Wall Panel"] },
    { id: "ORD-002", date: "2024-04-02", status: "Processing", total: 5800,  items: ["Acacia Wood Salad Bowl Set"] },
  ];

  // Sample wishlist
  const wishlist = [
    { id: 3, name: "Mahogany Side Table", price: 25000 },
    { id: 5, name: "Geometric Wall Clock", price: 8400  },
  ];

  // Fake login handler — replace with real auth API call
  const handleLogin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    setTab("orders");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    setTab("orders");
  };

  const statusColor = {
    Delivered:  "text-forest bg-green-50",
    Processing: "text-yellow-700 bg-yellow-50",
    Shipped:    "text-blue-700 bg-blue-50",
    Cancelled:  "text-red-600 bg-red-50",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-wood-700 mb-8">My Account</h1>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-wood-200 mb-8">
        {(!isLoggedIn ? ["login", "register"] : ["orders", "wishlist"]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium capitalize transition border-b-2 -mb-px ${
              tab === t ? "border-wood-600 text-wood-700" : "border-transparent text-wood-400 hover:text-wood-600"
            }`}
          >
            {t === "login" ? "Log In" : t === "register" ? "Register" : t === "orders" ? "Order History" : "Wishlist"}
          </button>
        ))}
        {isLoggedIn && (
          <button
            onClick={() => { setLoggedIn(false); setTab("login"); }}
            className="ml-auto text-xs text-wood-400 hover:text-red-500 transition px-3"
          >
            Log Out
          </button>
        )}
      </div>

      {/* ── Login ────────────────────────────────────────────────────────── */}
      {tab === "login" && (
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-sm p-8 max-w-sm mx-auto space-y-4">
          <h2 className="text-xl font-bold text-wood-700">Welcome Back</h2>
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-wood-700 mb-1">Email</label>
            <input id="login-email" type="email" required placeholder="you@example.com"
              className="w-full border border-wood-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400" />
          </div>
          <div>
            <label htmlFor="login-pass" className="block text-sm font-medium text-wood-700 mb-1">Password</label>
            <input id="login-pass" type="password" required placeholder="••••••••"
              className="w-full border border-wood-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400" />
          </div>
          <button type="submit" className="w-full bg-wood-700 text-cream py-2.5 rounded font-bold hover:bg-wood-600 transition">
            Log In
          </button>
          <p className="text-center text-sm text-wood-400">
            No account?{" "}
            <button type="button" onClick={() => setTab("register")} className="text-wood-600 underline">Register</button>
          </p>
        </form>
      )}

      {/* ── Register ─────────────────────────────────────────────────────── */}
      {tab === "register" && (
        <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-sm p-8 max-w-sm mx-auto space-y-4">
          <h2 className="text-xl font-bold text-wood-700">Create Account</h2>
          {[
            { id: "reg-name",  label: "Full Name", type: "text",     placeholder: "Jane Wanjiku"    },
            { id: "reg-email", label: "Email",     type: "email",    placeholder: "jane@example.com"},
            { id: "reg-phone", label: "Phone",     type: "tel",      placeholder: "+254 700 000 000"},
            { id: "reg-pass",  label: "Password",  type: "password", placeholder: "••••••••"        },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-wood-700 mb-1">{label}</label>
              <input id={id} type={type} required placeholder={placeholder}
                className="w-full border border-wood-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400" />
            </div>
          ))}
          <button type="submit" className="w-full bg-wood-700 text-cream py-2.5 rounded font-bold hover:bg-wood-600 transition">
            Create Account
          </button>
          <p className="text-center text-sm text-wood-400">
            Have an account?{" "}
            <button type="button" onClick={() => setTab("login")} className="text-wood-600 underline">Log In</button>
          </p>
        </form>
      )}

      {/* ── Order History ─────────────────────────────────────────────────── */}
      {tab === "orders" && (
        <div>
          <h2 className="text-xl font-bold text-wood-700 mb-5">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-wood-400">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-wood-700">{order.id}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-wood-400 mb-1">Placed: {order.date}</p>
                  <p className="text-sm text-wood-500 mb-2">{order.items.join(", ")}</p>
                  <p className="font-bold text-wood-700">{formatPrice(order.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Wishlist ──────────────────────────────────────────────────────── */}
      {tab === "wishlist" && (
        <div>
          <h2 className="text-xl font-bold text-wood-700 mb-5">My Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className="text-wood-400">Your wishlist is empty.</p>
          ) : (
            <div className="space-y-3">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-wood-700">{item.name}</p>
                    <p className="text-wood-500 text-sm">{formatPrice(item.price)}</p>
                  </div>
                  <button className="text-sm bg-wood-700 text-cream px-4 py-1.5 rounded hover:bg-wood-600 transition">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
