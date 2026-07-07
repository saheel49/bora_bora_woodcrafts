import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart }  from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth }  from "../../context/AuthContext";
// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems }          = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();

  const navLinks = [
    { to: "/",        label: "Home"    },
    { to: "/blog",    label: "Blog"    },
    { to: "/about",   label: "About"   },
    { to: "/contact", label: "Contact" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="bg-wood-700 dark:bg-dark-surface text-cream sticky top-0 z-50 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="text-wood-300 font-bold text-xl tracking-wide hover:text-wood-200 transition">
          BoraBora Woodcrafts
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-wood-300 ${
                  isActive ? "text-wood-300 border-b border-wood-300" : "text-cream"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="text-cream hover:text-wood-300 transition text-lg"
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Cart icon with badge */}
          {!isAdmin && (
            <Link to="/cart" className="relative text-cream hover:text-wood-300 transition" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M17 21a1 1 0 100-2 1 1 0 000 2zm-10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-wood-300 text-wood-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Account icon */}
          <Link to="/account" className="text-cream hover:text-wood-300 transition" aria-label="Account">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Logout button — only shown when logged in */}
          {user && (
            <button
              onClick={logout}
              className="hidden md:flex items-center gap-2 text-xs text-cream/80 hover:text-red-400 transition border border-cream/20 hover:border-red-400/50 rounded px-3 py-1.5"
              aria-label="Log out"
            >
              <span>👤 {user.username}</span>
              <span className="border-l border-cream/20 pl-2 text-red-400">Logout</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-cream focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-wood-800 dark:bg-dark-bg px-4 pb-4 flex flex-col gap-3">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium py-1 transition ${isActive ? "text-wood-300" : "text-cream"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
