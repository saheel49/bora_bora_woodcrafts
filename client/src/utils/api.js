import axios from "axios";

// ─── Axios instance pointing at Django backend ────────────────────────────────
const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    // If backend is completely offline (network error) just reject quietly
    if (!err.response) {
      return Promise.reject(err);
    }
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("bb_refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(
            "http://localhost:8000/api/token/refresh/",
            { refresh }
          );
          localStorage.setItem("bb_access_token", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem("bb_access_token");
          localStorage.removeItem("bb_refresh_token");
          window.location.href = "/account";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
