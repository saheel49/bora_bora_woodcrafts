import React from "react";
import { Link } from "react-router-dom";

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-wood-700 dark:bg-dark-surface text-cream mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand column */}
        <div>
          <h3 className="text-wood-300 font-bold text-lg mb-3">🪵 BoraBora Woodcrafts</h3>
          <p className="text-sm text-wood-100 leading-relaxed">
            Handcrafted wooden products made with love and sustainable timber from East Africa.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-semibold mb-3 text-wood-200">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["/shop", "/about", "/blog", "/contact"].map((path) => (
              <li key={path}>
                <Link to={path} className="hover:text-wood-300 transition capitalize">
                  {path.replace("/", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-semibold mb-3 text-wood-200">Get in Touch</h4>
          <ul className="text-sm space-y-2 text-wood-100">
            <li>📧 info@boraworkshop.co.ke</li>
            <li>📞 +254745678901</li>
            <li>📍 Mombasa, Kenya</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-wood-600 text-center py-4 text-xs text-wood-200">
        © {new Date().getFullYear()} BoraBora Woodcrafts. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
