import React, { useState } from "react";
import { Link } from "react-router-dom";
import products from "../../data/products";
import ProductCard from "../../components/ProductCard/ProductCard";

// ─── Homepage ─────────────────────────────────────────────────────────────────
function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories = [
    { name: "Wall Décor",  emoji: "🖼️", desc: "Carved panels, clocks, and 3D art." },
    { name: "Kitchenware", emoji: "🥗", desc: "Bowls, boards, and racks for your kitchen." },
    { name: "Furniture",   emoji: "🪑", desc: "Tables, chairs, and shelves built to last." },
  ];

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: wire up to newsletter API
    setSubscribed(true);
  };

  return (
    // Page wrapper — black in dark mode
    <div className="bg-cream dark:bg-black transition-colors duration-300">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section
        className="relative bg-wood-700 dark:bg-black text-cream text-center py-28 px-4 border-b border-transparent dark:border-white/10"
        aria-label="Hero"
      >
        <div className="absolute inset-0 bg-black/20 dark:bg-black/60" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-wood-300 dark:text-white/50 uppercase tracking-widest text-sm mb-3">
            Est. 2018 · Mombasa, Kenya
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 text-cream dark:text-white">
            Handcrafted Wood Art<br />for Every Home.
          </h1>
          <p className="text-wood-100 dark:text-white/70 text-lg mb-8">
            Sustainably sourced. Artisan made. Uniquely yours.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-wood-300 dark:bg-white text-wood-800 dark:text-black font-bold px-8 py-3 rounded hover:bg-wood-400 dark:hover:bg-gray-200 transition text-base"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* ── Featured Categories ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-2xl font-bold text-wood-700 dark:text-white text-center mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="bg-wood-100 dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-8 text-center hover:bg-wood-200 dark:hover:bg-white/10 transition group"
            >
              <span className="text-5xl block mb-4">{cat.emoji}</span>
              <h3 className="text-wood-700 dark:text-white font-bold text-lg mb-2">{cat.name}</h3>
              <p className="text-wood-600 dark:text-white/60 text-sm">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────────────────── */}
      <section
        className="bg-wood-50 dark:bg-white/5 py-16 px-4 border-y border-transparent dark:border-white/10"
        aria-labelledby="bestsellers-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 id="bestsellers-heading" className="text-2xl font-bold text-wood-700 dark:text-white">
              Best Sellers
            </h2>
            <Link
              to="/shop"
              className="text-sm text-wood-500 dark:text-white/50 hover:text-wood-700 dark:hover:text-white underline transition"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-2xl font-bold text-wood-700 dark:text-white text-center mb-10">
          Why BoraBora?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: "🌳", title: "100% Natural Wood",        desc: "Every piece is made from responsibly harvested timber." },
            { icon: "🔨", title: "Skilled Artisans",         desc: "Decades of woodworking tradition in every product." },
            { icon: "🚚", title: "Fast East Africa Delivery", desc: "We deliver across Kenya, Uganda, Tanzania, and beyond." },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none"
            >
              <span className="text-4xl block mb-3">{icon}</span>
              <h3 className="font-semibold text-wood-700 dark:text-white mb-2">{title}</h3>
              <p className="text-wood-500 dark:text-white/60 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section
        className="bg-wood-700 dark:bg-white/5 dark:border-t dark:border-white/10 text-cream py-14 px-4"
        aria-labelledby="newsletter-heading"
      >
        <div className="max-w-xl mx-auto text-center">
          <h2 id="newsletter-heading" className="text-2xl font-bold mb-3 text-cream dark:text-white">
            Get 10% Off Your First Order
          </h2>
          <p className="text-wood-100 dark:text-white/60 mb-6 text-sm">
            Subscribe to our newsletter for exclusive deals, new arrivals, and woodcraft tips.
          </p>
          {subscribed ? (
            <p className="text-wood-300 dark:text-green-400 font-semibold">
              🎉 You're subscribed! Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded text-wood-800 dark:bg-white/10 dark:text-white dark:placeholder-white/40 dark:border dark:border-white/20 focus:outline-none focus:ring-1 focus:ring-wood-300"
              />
              <button
                type="submit"
                className="bg-wood-300 dark:bg-white text-wood-800 dark:text-black font-bold px-6 py-2 rounded hover:bg-wood-400 dark:hover:bg-gray-200 transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

export default Home;
