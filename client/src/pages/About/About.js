import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import products from "../../data/products";

// ─── About Page ───────────────────────────────────────────────────────────────
function About() {
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();

  const values = [
    { icon: "🌿", title: "Sustainability",   desc: "We only source timber from responsibly managed forests, and plant a tree for every 10 sold." },
    { icon: "🤝", title: "Community",        desc: "We employ and train over 30 local artisans in Nairobi, creating livelihoods that matter." },
    { icon: "✨", title: "Quality",          desc: "Each item is hand-finished and inspected before it ever leaves our workshop." },
    { icon: "🌍", title: "African Heritage", desc: "Our designs draw from generations of East African craft traditions." },
  ];

  const team = [
    {
      name: "Saheel Amir",
      role: "Founder & Master Craftsman",
      bio: "Saheel founded BoraBora Woodcrafts in 2018 after 15 years of woodworking across East Africa. His signature style blends traditional Swahili motifs with contemporary form. He personally oversees every major carving that leaves the workshop.",
      bestWorks: ["Hand-Carved Wall Panel", "Abstract Tree Wall Art", "Mahogany Side Table"],
      joined: "2018",
      location: "Mombasa, Kenya",
    },
    {
      name: "Alice Nyambu",
      role: "Head of Design",
      bio: "Alice brings a fine arts background from the University of Nairobi to BoraBora. She leads the design language of the brand, ensuring every product is both beautiful and functional. Her kitchenware line has been the company's best-selling range for two consecutive years.",
      bestWorks: ["Acacia Wood Salad Bowl Set", "Olive Wood Cheese Board", "Wooden Spice Rack"],
      joined: "2019",
      location: "Nairobi, Kenya",
    },
    {
      name: "Hassan",
      role: "Operations Manager",
      bio: "Hassan keeps the workshop and the business running smoothly. With a background in supply chain management, he oversees timber sourcing, quality control, and logistics. His relationships with certified forest suppliers are the backbone of our sustainability pledge.",
      bestWorks: ["Teak Dining Chair", "Geometric Wall Clock", "Acacia Wood Salad Bowl Set"],
      joined: "2020",
      location: "Mombasa, Kenya",
    },
  ];

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = ["bg-wood-600", "bg-forest", "bg-wood-400"];

  // Find product id by name and navigate to its page
  const handleWorkClick = (workName) => {
    const match = products.find(
      (p) => p.name.toLowerCase() === workName.toLowerCase()
    );
    if (match) {
      setSelectedMember(null); // close modal first
      navigate(`/product/${match.id}`);
    } else {
      // Fallback: go to shop with name as search hint
      setSelectedMember(null);
      navigate("/shop");
    }
  };

  return (
    <div className="bg-cream dark:bg-black transition-colors duration-300">

      {/* ── Hero — full logo visible, occupies whole section ─────────────── */}
      <section className="relative text-cream text-center overflow-hidden" aria-label="About hero">

        {/* Actual img tag — shows the whole logo, scales to full width */}
        <img
          src="/images/bora-bora-logo.jpg"
          alt="BoraBora Woodcrafts"
          className="w-full object-contain block"
          style={{ maxHeight: "520px", minHeight: "280px", objectPosition: "center" }}
        />

        {/* Dark overlay on top of the image */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Text centred over the image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Our Story</h1>
          <p className="text-white/85 max-w-xl mx-auto text-lg leading-relaxed drop-shadow">
            BoraBora Woodcrafts was born in 2018 from a single workshop in Mombasa Coast, with a vision to
            share the beauty of African woodcraft with the world.
          </p>
        </div>
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
              <div key={title} className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6 text-center shadow-sm dark:shadow-none">
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
        <h2 id="team-heading" className="text-2xl font-bold text-wood-700 dark:text-white text-center mb-2">
          Meet the Team
        </h2>
        <p className="text-center text-wood-500 dark:text-white/50 text-sm mb-10">
          Click a team member to learn more about them.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map(({ name, role }, i) => (
            <button
              key={name}
              onClick={() => setSelectedMember(team[i])}
              className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6 text-center shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-white/10 transition cursor-pointer group focus:outline-none focus:ring-2 focus:ring-wood-400"
              aria-label={`View ${name}'s profile`}
            >
              <div className={`${avatarColors[i]} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform`}>
                <span className="text-white font-bold text-xl">{getInitials(name)}</span>
              </div>
              <h3 className="font-bold text-wood-700 dark:text-white">{name}</h3>
              <p className="text-wood-400 dark:text-white/50 text-sm mt-1">{role}</p>
              <p className="text-xs text-wood-300 dark:text-white/30 mt-2">View profile →</p>
            </button>
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

      {/* ── Team Member Modal ─────────────────────────────────────────────── */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedMember.name}'s profile`}
        >
          <div
            className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-wood-400 hover:text-wood-700 dark:text-white/50 dark:hover:text-white text-xl transition"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Avatar */}
            <div className={`${avatarColors[team.findIndex(m => m.name === selectedMember.name)]} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <span className="text-white font-bold text-2xl">{getInitials(selectedMember.name)}</span>
            </div>

            {/* Name + role */}
            <h2 className="text-xl font-bold text-wood-700 dark:text-white text-center">{selectedMember.name}</h2>
            <p className="text-wood-400 dark:text-white/50 text-sm text-center mb-1">{selectedMember.role}</p>

            {/* Meta */}
            <div className="flex justify-center gap-4 text-xs text-wood-400 dark:text-white/40 mb-5">
              <span>📍 {selectedMember.location}</span>
              <span>🗓 Since {selectedMember.joined}</span>
            </div>

            {/* Bio */}
            <p className="text-wood-500 dark:text-white/70 text-sm leading-relaxed mb-5">
              {selectedMember.bio}
            </p>

            {/* Best works — each is clickable and leads to the product page */}
            <div>
              <h3 className="text-xs font-semibold text-wood-600 dark:text-white/60 uppercase tracking-wide mb-3">
                Best Works — click to view product
              </h3>
              <ul className="space-y-2">
                {selectedMember.bestWorks.map((work) => {
                  const match = products.find(
                    (p) => p.name.toLowerCase() === work.toLowerCase()
                  );
                  return (
                    <li key={work}>
                      <button
                        onClick={() => handleWorkClick(work)}
                        className="w-full text-left flex items-center gap-2 text-sm text-wood-600 dark:text-white/70 hover:text-wood-800 dark:hover:text-white group transition"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-wood-400 dark:bg-wood-300 inline-block flex-shrink-0" />
                        <span className="underline underline-offset-2 decoration-dotted group-hover:decoration-solid">
                          {work}
                        </span>
                        {match && (
                          <span className="ml-auto text-xs text-wood-300 dark:text-white/30 group-hover:text-wood-500 dark:group-hover:text-white/60">
                            View →
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default About;
