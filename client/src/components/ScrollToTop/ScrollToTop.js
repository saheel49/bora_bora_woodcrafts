import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ─── ScrollToTop ──────────────────────────────────────────────────────────────
// Scrolls to the top of the page on every route change.
// Place this once inside <Router> and it covers the entire app.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
