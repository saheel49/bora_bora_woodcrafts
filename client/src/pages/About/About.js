import React from "react";
import { Link } from "react-router-dom";

// ─── About Page ───────────────────────────────────────────────────────────────
function About() {
  const values = [
    { icon: "🌿", title: "Sustainability",   desc: "We only source timber from responsibly managed forests, and plant a tree for every 10 sold." },
    { icon: "🤝", title: "Community",        desc: "We employ and train over 30 local artisans in Nairobi, creating livelihoods that matter." },
    { icon: "✨", title: "Quality",          desc: "Each item is hand-finished and inspected before it ever leaves our workshop." },
    { icon: "🌍", title: "African Heritage", desc: "Our designs draw from generations of East African craft traditions." },
  ];

  const team = [
    { name: "Saheel Amir",  role: "Founder & Master Craftsman", emoji: "👨‍🔧" },
    { name: "Alice Nyambu", role: "Head of Design",              emoji: "👩‍🎨" },
    { name: "Hassan",       role: "Operations Manager",          emoji: "👩‍💼" },
  ];

  return (
    <div className="bg-cream dark:bg-black transition-colors duration-300">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-wood-700 dark:bg-black border-b border-transparent dark:border-white/10 text-cream py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-wood-300 dark:text-white">Our Story</h1>
        <p className="text-wood-100 dark:text-white/70 max-w-xl mx-auto text-lg leading-relaxed">
          BoraBora Woodcrafts was born in 2018 from a single workshop in Mombasa Coast, with a vision to
          share the beauty of African woodcraft with the world.
        </p>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-14" aria-labelledby="mission-heading">
        <h2 id="mission-heading" className="text-2xl font-bold text-wood-700 dark:text-white mb-4">
          Our Mission
        </h2>
        <p className="text-wood-500 dark:text-white/70 leading-relaxed mb-4">
          We believe every home deserves a piece of nature — crafted with skill, purpose, and love.
          Our mission is to create heirloom-quality wooden products that celebrate East African artisanship
          while treading lightly on the planet.
        </p>
        <p className="text-wood-500 dark:text-white/70 leading-relaxed">
          From our workshop to your home, every BoraBora product carries the story of the hands that made it.
        </p>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section
        className="bg-wood-50 dark:bg-white/5 border-y border-transparent dark:border-white/10 py-14 px-4"
        aria-labelledby="values-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="values-heading" className="text-2xl font-bold text-wood-700 dark:text-white text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6 text-center shadow-sm dark:shadow-none"
              >
                <span className="text-4xl block mb-3">{icon}</span>
                <h3 className="font-bold text-wood-700 dark:text-white mb-2">{title}</h3>
                <p className="text-wood-500 dark:text-white/60 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-14" aria-labelledby="team-heading">
        <h2 id="team-heading" className="text-2xl font-bold text-wood-700 dark:text-white text-center mb-10">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map(({ name, role, emoji }) => (
            <div
              key={name}
              className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6 text-center shadow-sm dark:shadow-none"
            >
              <span className="text-5xl block mb-3">{emoji}</span>
              <h3 className="font-bold text-wood-700 dark:text-white">{name}</h3>
              <p className="text-wood-400 dark:text-white/50 text-sm mt-1">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-wood-700 dark:bg-white/5 dark:border-t dark:border-white/10 text-cream text-center py-12 px-4">
        <h2 className="text-2xl font-bold mb-3 text-cream dark:text-white">
          Ready to bring nature into your home?
        </h2>
        <Link
          to="/shop"
          className="inline-block bg-wood-300 dark:bg-white text-wood-800 dark:text-black font-bold px-8 py-3 rounded hover:bg-wood-400 dark:hover:bg-gray-200 transition"
        >
          Shop the Collection
        </Link>
      </section>

    </div>
  );
}

export default About;
