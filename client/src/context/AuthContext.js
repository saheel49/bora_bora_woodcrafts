import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on app start
  useEffect(() => {
    const token = localStorage.getItem("bb_access_token");
    if (token) {
      api.get("/auth/me/")
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token invalid or server down — clear tokens silently
          localStorage.removeItem("bb_access_token");
          localStorage.removeItem("bb_refresh_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login/", { username, password });
    localStorage.setItem("bb_access_token",  data.access);
    localStorage.setItem("bb_refresh_token", data.refresh);
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    await api.post("/auth/register/", formData);
    // Auto-login after register using username
    return login(formData.username, formData.password);
  };

  const logout = () => {
    localStorage.removeItem("bb_access_token");
    localStorage.removeItem("bb_refresh_token");
    setUser(null);
    window.location.href = "/";
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
