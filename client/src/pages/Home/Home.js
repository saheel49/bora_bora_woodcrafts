import React, { useState } from "react";
import { Link } from "react-router-dom";
import products from "../../data/products";
import ProductCard from "../../components/ProductCard/ProductCard";

// ─── Homepage ─────────────────────────────────────────────────────────────────
function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories = [
    { name: "Wall Décor",  image: "/images/wall-decor.jpg",   desc: "Carved panels, clocks, and 3D art." },
    { name: "Kitchenware", image: "/images/kitchenware.jpg",  desc: "Bowls, boards, and racks for your kitchen." },
    { name: "Furniture",   image: "/images/furniture.jpg",    desc: "Tables, chairs, and shelves built to last." },
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
  className="relative text-cream text-center py-28 px-4 border-b border-transparent dark:border-white/10 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/images/hand-crafted-wood-art.jpg')" }}
  aria-label="Hero"
>
  {/* Dark overlay for better text visibility */}
  <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />

  <div className="relative z-10 max-w-2xl mx-auto">
    <p className="text-wood-300 dark:text-white/50 uppercase tracking-widest text-sm mb-3">
      Est. 2018 · Mombasa, Kenya
    </p>

    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 text-cream dark:text-white">
      Handcrafted Wood Art
      <br />
      for Every Home.
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
              className="relative overflow-hidden rounded-xl h-56 group block"
              style={{ backgroundImage: `url('${cat.image}')`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              {/* Dark overlay — lightens on hover */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-all duration-300" />

              {/* Text content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h3 className="text-white font-bold text-xl mb-1 drop-shadow-md">{cat.name}</h3>
                <p className="text-white/80 text-sm drop-shadow">{cat.desc}</p>
              </div>
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
            { image: "/images/natural-wood.jpg",      title: "100% Natural Wood",        desc: "Every piece is made from responsibly harvested timber." },
            { image: "/images/skilled-artisans.jpg",  title: "Skilled Artisans",         desc: "Decades of woodworking tradition in every product." },
            { image: "/images/transport.jpg",         title: "Fast East Africa Delivery", desc: "We deliver across Kenya, Uganda, Tanzania, and beyond." },
          ].map(({ image, title, desc }) => (
            <div
              key={title}
              className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none"
            >
              {/* Image at the top of each card */}
              <div className="h-40 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Text below the image */}
              <div className="p-5">
                <h3 className="font-semibold text-wood-700 dark:text-white mb-2">{title}</h3>
                <p className="text-wood-500 dark:text-white/60 text-sm">{desc}</p>
              </div>
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
