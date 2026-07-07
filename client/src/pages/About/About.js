import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import products from "../../data/products";

// ─── About Page ───────────────────────────────────────────────────────────────
function About() {
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();
  const worksRef = useRef(null);

  const scrollToWorks = () => {
    worksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const values = [
    {  title: "Sustainability",   desc: "We only source timber from responsibly managed forests, and plant a tree for every 10 sold." },
    {  title: "Community",        desc: "We employ and train over 30 local artisans in Nairobi, creating livelihoods that matter." },
    { title: "Quality",          desc: "Each item is hand-finished and inspected before it ever leaves our workshop." },
    {  title: "African Heritage", desc: "Our designs draw from generations of East African craft traditions." },
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
            {values.map(({ title, desc }, index) => (
              <div
                key={title}
                className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl overflow-hidden text-center shadow-sm dark:shadow-none group transition hover:shadow-md min-h-[22rem]"
              >
                <div
                  className={`banner-slice banner-slice-${index + 1} h-56 overflow-hidden rounded-t-xl transition-transform duration-300 group-hover:scale-105`}
                  style={{ backgroundImage: "url('/images/about.png')" }}
                />

                <div className="p-6">
                  <h3 className="font-bold text-wood-700 dark:text-white mb-2">{title}</h3>
                  <p className="text-wood-500 dark:text-white/60 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="team-heading">
        <div className="text-center mb-12">
          <h2 id="team-heading" className="text-3xl sm:text-4xl font-extrabold text-wood-800 dark:text-white mb-3">
            Meet the Team
          </h2>
          <p className="mx-auto max-w-2xl text-wood-500 dark:text-white/60 text-sm sm:text-base">
            Our artisans and makers bring every product to life with care, craft, and attention to detail.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map(({ name, role }, i) => (
            <button
              key={name}
              onClick={() => setSelectedMember(team[i])}
              className="relative overflow-hidden rounded-[28px] bg-white/90 dark:bg-slate-950/80 border border-wood-100 dark:border-white/10 p-6 text-left shadow-lg shadow-wood-200/60 dark:shadow-black/30 transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-wood-300"
              aria-label={`View ${name}'s profile`}
            >
              <div className="absolute -left-6 top-14 h-16 w-16 rounded-full bg-amber-200/60 dark:bg-wood-600/20 blur-3xl" />
              <div className="absolute -right-8 bottom-10 h-20 w-20 rounded-full bg-forest/20 blur-3xl" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-forest to-wood-500" />
              <div className="relative flex items-center gap-4 mb-5">
                <div className={`${avatarColors[i]} w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-inner`}>
                  {getInitials(name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-800 dark:text-white">{name}</h3>
                  <p className="text-sm text-wood-500 dark:text-white/60">{role}</p>
                </div>
              </div>
              <p className="text-sm text-wood-500 dark:text-white/60 leading-relaxed mb-6">
                {`Click to learn more about ${name} and their craftsmanship.`}
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-wood-700 dark:text-white">
                <span>View profile</span>
                <span aria-hidden="true">→</span>
              </div>
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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedMember.name}'s profile`}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/15 bg-white dark:bg-slate-950 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="sticky top-4 right-4 z-20 float-right flex h-12 w-12 items-center justify-center rounded-full border border-wood-200 dark:border-white/20 bg-white/90 dark:bg-slate-900/90 text-wood-700 dark:text-white shadow-md transition hover:bg-wood-50 dark:hover:bg-slate-800"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with Avatar and Name */}
            <div className="relative overflow-hidden bg-gradient-to-br from-wood-50 to-amber-50 dark:from-slate-900 dark:to-slate-950 px-8 pt-12 pb-8">
              <div className="absolute top-0 right-0 h-40 w-40 bg-wood-100/40 dark:bg-wood-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 h-32 w-32 bg-forest/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
              
              <div className="relative flex items-end gap-6">
                <div className={`${avatarColors[team.findIndex((m) => m.name === selectedMember.name)]} flex h-32 w-32 items-center justify-center rounded-full shadow-[0_32px_80px_-30px_rgba(0,0,0,0.5)]`}>
                  <span className="text-5xl font-bold text-white">{getInitials(selectedMember.name)}</span>
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-wood-600 dark:text-wood-400 font-semibold mb-2">Craft Member</p>
                  <h1 className="text-4xl font-bold text-wood-900 dark:text-white mb-2">{selectedMember.name}</h1>
                  <p className="text-lg font-semibold text-wood-700 dark:text-wood-300">{selectedMember.role}</p>
                </div>
              </div>
            </div>

            {/* Info Pills */}
            <div className="flex flex-wrap gap-3 px-8 py-6 border-b border-wood-100 dark:border-white/10">
              <div className="rounded-full border border-wood-200 dark:border-white/20 bg-wood-50 dark:bg-slate-900/80 px-5 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-wood-600 dark:text-wood-400 font-semibold mb-1">Location</p>
                <p className="text-sm font-semibold text-wood-900 dark:text-white">{selectedMember.location}</p>
              </div>
              <div className="rounded-full border border-wood-200 dark:border-white/20 bg-wood-50 dark:bg-slate-900/80 px-5 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-wood-600 dark:text-wood-400 font-semibold mb-1">Joined</p>
                <p className="text-sm font-semibold text-wood-900 dark:text-white">{selectedMember.joined}</p>
              </div>
              <div className="rounded-full border border-amber-200 dark:border-amber-600/40 bg-amber-50 dark:bg-amber-950/30 px-5 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400 font-semibold mb-1">Signature Works</p>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{selectedMember.bestWorks.length} pieces</p>
              </div>
            </div>

            {/* Bio */}
            <div className="px-8 py-8 border-b border-wood-100 dark:border-white/10">
              <p className="text-base leading-8 text-wood-600 dark:text-white/80">{selectedMember.bio}</p>
            </div>

            {/* Best Works Section */}
            <div ref={worksRef} className="px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-wood-900 dark:text-white">Best Works</h2>
                  <p className="text-xs uppercase tracking-[0.24em] text-wood-600 dark:text-wood-400 font-semibold mt-1">Explore featured pieces</p>
                </div>
              </div>
              <div className="grid gap-3">
                {selectedMember.bestWorks.map((work) => {
                  const match = products.find(
                    (p) => p.name.toLowerCase() === work.toLowerCase()
                  );
                  return (
                    <button
                      key={work}
                      onClick={() => handleWorkClick(work)}
                      className="group relative overflow-hidden rounded-[20px] border border-wood-100 dark:border-white/10 bg-white dark:bg-slate-900/80 px-6 py-5 text-left transition hover:border-wood-300 dark:hover:border-white/20 hover:bg-wood-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-wood-900 dark:text-white text-lg">{work}</p>
                        </div>
                        {match ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-wood-100 dark:bg-wood-900/60 px-4 py-2 text-sm font-semibold text-wood-700 dark:text-wood-300 group-hover:bg-wood-200 dark:group-hover:bg-wood-800 transition">
                            View <span className="group-hover:translate-x-1 transition">→</span>
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-wood-400 dark:text-white/40">Unavailable</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scroll to Works Button */}
            <div className="sticky bottom-0 left-0 right-0 flex justify-center py-4 bg-gradient-to-t from-white dark:from-slate-950 to-transparent">
              <button
                onClick={scrollToWorks}
                className="flex items-center gap-2 rounded-full border border-wood-300 dark:border-white/20 bg-wood-50 dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-wood-700 dark:text-white shadow-md transition hover:border-wood-400 hover:bg-wood-100 dark:hover:border-white/40 dark:hover:bg-slate-800"
              >
                <span>Scroll to works</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default About;
