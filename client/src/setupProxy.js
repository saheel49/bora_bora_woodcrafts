const { createProxyMiddleware } = require("http-proxy-middleware");

// ─── Dev Proxy Config ─────────────────────────────────────────────────────────
// Only proxy requests that start with /api to the backend.
// Everything else (favicon, static files, React routes) stays on port 3000.
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
