import React, { useState } from "react";

// ─── Contact Page ─────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to POST /api/contact on the backend
    console.log("Contact form submitted:", form);
    setSubmitted(true);
  };

  // Shared input class — dark mode: black bg, white text, white border
  const inputClass =
    "w-full border border-wood-200 dark:border-white/20 rounded px-3 py-2 text-sm " +
    "bg-white dark:bg-white/5 text-wood-700 dark:text-white placeholder-gray-400 dark:placeholder-white/30 " +
    "focus:outline-none focus:ring-1 focus:ring-wood-400 dark:focus:ring-white/40 transition";

  return (
    <div className="bg-cream dark:bg-black transition-colors duration-300 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Page heading */}
        <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-2">
          Get in Touch
        </h1>
        <p className="text-wood-500 dark:text-white/60 mb-10">
          Questions, custom orders, or just want to say hello — we'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ── Contact form ────────────────────────────────────────────── */}
          <section>
            {submitted ? (
              <div className="bg-green-50 dark:bg-white/5 dark:border dark:border-white/10 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-4xl mb-3">✅</p>
                <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-2">Message Sent!</h2>
                <p className="text-wood-500 dark:text-white/60">We'll get back to you within 1–2 business days.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm dark:shadow-none p-6 space-y-4"
              >
                {[
                  { name: "name",    label: "Your Name", type: "text",  placeholder: "Jane Wanjiku"       },
                  { name: "email",   label: "Email",     type: "email", placeholder: "jane@example.com"   },
                  { name: "subject", label: "Subject",   type: "text",  placeholder: "Custom order query" },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-wood-700 dark:text-white mb-1">
                      {label}
                    </label>
                    <input
                      id={name} name={name} type={type}
                      value={form[name]} onChange={handleChange}
                      required placeholder={placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-wood-700 dark:text-white mb-1">
                    Message
                  </label>
                  <textarea
                    id="message" name="message"
                    value={form.message} onChange={handleChange}
                    required rows={5} placeholder="Tell us more..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-wood-700 dark:bg-white text-cream dark:text-black py-2.5 rounded font-bold hover:bg-wood-600 dark:hover:bg-gray-200 transition"
                >
                  Send Message
                </button>
              </form>
            )}
          </section>

          {/* ── Contact info ────────────────────────────────────────────── */}
          <section className="space-y-6">

            {/* Details card */}
            <div className="bg-wood-50 dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6">
              <h2 className="font-bold text-wood-700 dark:text-white text-lg mb-4">Contact Details</h2>
              <ul className="space-y-4 text-sm">
                {[
                  {
                    icon: "📧",
                    label: "Email",
                    content: <a href="mailto:info@boraworkshop.co.ke" className="hover:underline dark:text-white/80">info@boraworkshop.co.ke</a>,
                  },
                  {
                    icon: "📞",
                    label: "Phone / WhatsApp",
                    content: <a href="tel:+254737979003" className="hover:underline dark:text-white/80">+254 737979003</a>,
                  },
                  {
                    icon: "📍",
                    label: "Workshop",
                    content: <span className="dark:text-white/80">CoastLands Area,<br />Mombasa, Kenya</span>,
                  },
                  {
                    icon: "🕐",
                    label: "Business Hours",
                    content: <span className="dark:text-white/80">Mon – Fri: 8am – 6pm<br />Sat: 9am – 3pm</span>,
                  },
                ].map(({ icon, label, content }) => (
                  <li key={label} className="flex items-start gap-3 text-wood-600 dark:text-white/70">
                    <span className="text-xl mt-0.5">{icon}</span>
                    <div>
                      <p className="font-medium text-wood-700 dark:text-white">{label}</p>
                      {content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social links */}
            <div className="bg-wood-50 dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6">
              <h2 className="font-bold text-wood-700 dark:text-white text-lg mb-3">Follow Us</h2>
              <div className="flex flex-wrap gap-3">
                {["📘 Facebook", "📸 Instagram", "🐦 Twitter"].map((s) => (
                  <span
                    key={s}
                    className="text-sm bg-white dark:bg-white/10 dark:text-white px-3 py-1.5 rounded-full shadow-sm dark:shadow-none text-wood-600 cursor-pointer hover:bg-wood-100 dark:hover:bg-white/20 transition"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}

export default Contact;
