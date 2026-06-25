/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // "class" strategy — dark mode toggled by adding class="dark" to <html>
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        wood: {
          50:  "#fdf8f2",
          100: "#f5e9d8",
          200: "#e8ccaa",
          300: "#d4a96a",
          400: "#c49050",
          500: "#a87040",
          600: "#6b4c2a",
          700: "#3b2a1a",
          800: "#2a1e12",
          900: "#1a1209",
        },
        forest: {
          light: "#6b8f5e",
          DEFAULT: "#4a7c42",
          dark: "#2d5a27",
        },
        cream: "#f9f5f0",
        // Dark mode surface colors — true black base, white text
        dark: {
          bg:      "#000000",
          surface: "#0d0d0d",
          card:    "#141414",
          border:  "#2a2a2a",
          text:    "#ffffff",
          muted:   "#a0a0a0",
        },
      },
      fontFamily: {
        sans: ["'Segoe UI'", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
