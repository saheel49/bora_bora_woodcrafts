import React from "react";

// ─── Error Boundary ───────────────────────────────────────────────────────────
// Catches any JavaScript error in the component tree and shows a readable message
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ color: "#c0392b" }}>Something went wrong</h1>
          <p style={{ color: "#555", marginBottom: "1rem" }}>
            The app crashed. Open the browser console (F12) for details.
          </p>
          <pre style={{
            background: "#f8f8f8", padding: "1rem", borderRadius: "4px",
            overflow: "auto", fontSize: "0.8rem", color: "#c0392b", border: "1px solid #eee"
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem", padding: "0.5rem 1.5rem",
              background: "#3b2a1a", color: "white", border: "none",
              borderRadius: "4px", cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
