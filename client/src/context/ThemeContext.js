import React, { createContext, useContext, useEffect, useState } from "react";

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Read saved preference or default to light
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("bb-theme") === "dark";
  });

  // Apply/remove "dark" class on <html> — Tailwind dark mode reads this
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("bb-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("bb-theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
