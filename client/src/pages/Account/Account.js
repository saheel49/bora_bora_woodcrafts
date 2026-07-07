import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/currency";
import api from "../../utils/api";

// ─── Account Page ─────────────────────────────────────────────────────────────
function Account() {
  const { user, login, register, logout, loading } = useAuth();
  const nav  = useNavigate();
  const from = useLocation().state?.from || "/";

  const [tab, setTab]       = useState("login");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", first_name: "", last_name: "", email: "", phone: "", password: "" });
  const [forgotEmail, setForgotEmail]   = useState("");
  const [forgotSent, setForgotSent]     = useState(false);
  const [error, setError]               = useState("");

  // Fetch orders + wishlist when logged in
  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      api.get("/orders/my/")
        .then((res) => setOrders(res.data))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));

      api.get("/wishlist/")
        .then((res) => setWishlist(res.data))
        .catch(() => {});
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(loginForm.username, loginForm.password);
      nav(from);
    } catch {
      setError("Invalid username or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(registerForm);
      nav(from);
    } catch (err) {
      setError(err.response?.data?.email?.[0] || "Registration failed. Try again.");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    await api.post("/auth/forgot-password/", { email: forgotEmail });
    setForgotSent(true);
  };

  const statusColor = {
    Delivered:        "text-forest bg-green-50 dark:bg-green-900/20",
    Processing:       "text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20",
    Shipped:          "text-blue-700 bg-blue-50 dark:bg-blue-900/20",
    Confirmed:        "text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20",
    "Out for Delivery":"text-orange-700 bg-orange-50 dark:bg-orange-900/20",
    Cancelled:        "text-red-600 bg-red-50 dark:bg-red-900/20",
    Pending:          "text-gray-600 bg-gray-100 dark:bg-gray-800",
  };

  const fieldClass = "w-full border border-wood-200 dark:border-white/20 dark:bg-white/5 dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400";

  if (loading) return <div className="text-center py-20 text-wood-500 dark:text-white/60">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-8">My Account</h1>

      {/* ── Logged in view ─────────────────────────────────────────────── */}
      {user ? (
        <>
          {/* Tab nav */}
          <div className="flex gap-1 border-b border-wood-200 dark:border-white/10 mb-8">
            {["orders", "wishlist", "blog"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                  tab === t ? "border-wood-600 text-wood-700 dark:text-white" : "border-transparent text-wood-400 dark:text-white/40 hover:text-wood-600"
                }`}>
                {t === "orders" ? "My Orders" : t === "wishlist" ? "Wishlist" : "My Blog Posts"}
              </button>
            ))}
            <button onClick={logout}
              className="ml-auto text-xs text-wood-400 hover:text-red-500 transition px-3">
              Log Out
            </button>
          </div>

          {/* Welcome */}
          <p className="text-wood-500 dark:text-white/60 text-sm mb-6">
            Welcome back, <strong className="text-wood-700 dark:text-white">{user.first_name}</strong> · {user.email}
          </p>

          {/* Orders */}
          {tab === "orders" && (
            <div>
              <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-5">Order History & Tracking</h2>
              {ordersLoading ? (
                <p className="text-wood-400 dark:text-white/40 text-sm">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-wood-400 dark:text-white/40 mb-4">No orders yet.</p>
                  <Link to="/shop" className="bg-wood-700 text-cream px-6 py-2 rounded font-medium hover:bg-wood-600 transition text-sm">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const history = order.status_history || [];
                    const stages  = ["Pending","Confirmed","Processing","Shipped","Out for Delivery","Delivered"];
                    const isActive = !["Delivered","Cancelled"].includes(order.status);
                    return (
                      <div key={order.id} className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-wood-700 dark:text-white">Order #{order.id}</span>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-600"}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-wood-400 dark:text-white/40 mb-1">
                          {new Date(order.created_at).toLocaleDateString("en-KE", { day:"numeric", month:"long", year:"numeric" })}
                        </p>
                        <p className="text-sm text-wood-500 dark:text-white/60 mb-1">
                          {order.city}, {order.country}
                        </p>
                        <p className="font-bold text-wood-700 dark:text-white mb-4">
                          {formatPrice(order.total)}
                        </p>

                        {/* Live tracking timeline */}
                        {order.status !== "Cancelled" && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-wood-500 dark:text-white/50 uppercase tracking-wide mb-2">
                              {isActive ? "Live Tracking" : "Delivery Timeline"}
                            </p>
                            <div className="flex items-start gap-0">
                              {stages.map((stage, i) => {
                                const done    = history.some((h) => h.status === stage);
                                const current = order.status === stage;
                                const ts      = history.find((h) => h.status === stage)?.timestamp;
                                return (
                                  <div key={stage} className="flex-1 flex flex-col items-center">
                                    {/* Connector line + dot */}
                                    <div className="flex items-center w-full">
                                      <div className={`flex-1 h-0.5 ${i === 0 ? "invisible" : done ? "bg-forest" : "bg-wood-100 dark:bg-white/10"}`} />
                                      <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                                        current ? "border-wood-500 bg-wood-400 scale-125" :
                                        done    ? "border-forest bg-forest" :
                                                  "border-wood-200 dark:border-white/20 bg-white dark:bg-black"
                                      }`} />
                                      <div className={`flex-1 h-0.5 ${i === stages.length-1 ? "invisible" : done ? "bg-forest" : "bg-wood-100 dark:bg-white/10"}`} />
                                    </div>
                                    {/* Label */}
                                    <p className={`text-center mt-1 leading-tight ${
                                      current ? "text-wood-700 dark:text-white font-semibold" :
                                      done    ? "text-forest dark:text-green-400" :
                                                "text-wood-300 dark:text-white/20"
                                    }`} style={{ fontSize: "9px" }}>
                                      {stage}
                                    </p>
                                    {ts && (
                                      <p className="text-center text-wood-300 dark:text-white/20" style={{ fontSize: "8px" }}>
                                        {new Date(ts).toLocaleDateString("en-KE", { day:"numeric", month:"short" })}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Items */}
                        <div className="mt-3 pt-3 border-t border-wood-100 dark:border-white/10">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs text-wood-500 dark:text-white/50 py-0.5">
                              <span>{item.name} × {item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          {tab === "wishlist" && (
            <div>
              <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-5">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <p className="text-wood-400 dark:text-white/40">Your wishlist is empty.</p>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-wood-700 dark:text-white">{item.product.name}</p>
                        <p className="text-wood-500 dark:text-white/50 text-sm">{formatPrice(item.product.price)}</p>
                      </div>
                      <Link to={`/product/${item.product.id}`}
                        className="text-sm bg-wood-700 text-cream px-4 py-1.5 rounded hover:bg-wood-600 transition">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Blog Posts */}
          {tab === "blog" && <MyBlogPostsTab />}
        </>

      ) : (
        /* ── Logged out view ──────────────────────────────────────────── */
        <>
          <div className="flex gap-1 border-b border-wood-200 dark:border-white/10 mb-8">
            {["login", "register", "forgot"].map((t) => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                className={`px-5 py-2 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                  tab === t ? "border-wood-600 text-wood-700 dark:text-white" : "border-transparent text-wood-400 dark:text-white/40 hover:text-wood-600"
                }`}>
                {t === "forgot" ? "Forgot Password" : t === "login" ? "Log In" : "Register"}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {/* Login */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm p-8 max-w-sm mx-auto space-y-4">
              <h2 className="text-xl font-bold text-wood-700 dark:text-white">Welcome Back</h2>
              <div>
                <label className="block text-sm font-medium text-wood-700 dark:text-white mb-1">Username</label>
                <input type="text" required value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  placeholder="Your username" className={fieldClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-wood-700 dark:text-white mb-1">Password</label>
                <input type="password" required value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="••••••••" className={fieldClass} />
              </div>
              <button type="submit" className="w-full bg-wood-700 dark:bg-white text-cream dark:text-black py-2.5 rounded font-bold hover:bg-wood-600 transition">
                Log In
              </button>
              <p className="text-center text-sm text-wood-400 dark:text-white/40">
                No account?{" "}
                <button type="button" onClick={() => setTab("register")} className="text-wood-600 dark:text-white underline">Register</button>
              </p>
            </form>
          )}

          {/* Register */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm p-8 max-w-sm mx-auto space-y-4">
              <h2 className="text-xl font-bold text-wood-700 dark:text-white">Create Account</h2>
              {[
                { key: "username",   label: "Username",    type: "text",     placeholder: "e.g. jane_wanjiku"  },
                { key: "first_name", label: "First Name",  type: "text",     placeholder: "Jane"               },
                { key: "last_name",  label: "Last Name",   type: "text",     placeholder: "Wanjiku"            },
                { key: "email",      label: "Email",       type: "email",    placeholder: "jane@email.com"     },
                { key: "phone",      label: "Phone",       type: "tel",      placeholder: "+254 700 000 000"   },
                { key: "password",   label: "Password",    type: "password", placeholder: "••••••••"           },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-wood-700 dark:text-white mb-1">{label}</label>
                  <input type={type} required value={registerForm[key]}
                    onChange={(e) => setRegisterForm({...registerForm, [key]: e.target.value})}
                    placeholder={placeholder} className={fieldClass} />
                </div>
              ))}
              <button type="submit" className="w-full bg-wood-700 dark:bg-white text-cream dark:text-black py-2.5 rounded font-bold hover:bg-wood-600 transition">
                Create Account
              </button>
            </form>
          )}

          {/* Forgot Password */}
          {tab === "forgot" && (
            <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm p-8 max-w-sm mx-auto">
              <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-2">Reset Password</h2>
              {forgotSent ? (
                <p className="text-forest dark:text-green-400 text-sm">
                  ✅ If that email exists, a reset link has been sent. Check your inbox.
                </p>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-wood-700 dark:text-white mb-1">Email</label>
                    <input type="email" required value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com" className={fieldClass} />
                  </div>
                  <button type="submit" className="w-full bg-wood-700 dark:bg-white text-cream dark:text-black py-2.5 rounded font-bold hover:bg-wood-600 transition">
                    Send Reset Link
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}


// ─── My Blog Posts Tab ────────────────────────────────────────────────────────
function MyBlogPostsTab() {
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [newPostOpen, setNewPostOpen] = useState(false);

  const CATEGORIES = ["Techniques","Sustainability","Product Care","News","Other"];

  const loadPosts = () => {
    setLoading(true);
    api.get("/blog/mine/")
      .then((r) => {
        const d = r.data;
        setPosts(Array.isArray(d) ? d : (d.results || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPosts(); }, []);

  const deletePost = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/blog/${id}/`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch { alert("Failed to delete."); }
  };

  const fieldClass = "w-full border border-wood-200 dark:border-white/20 dark:bg-white/5 dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400";

  if (loading) return <p className="text-wood-400 dark:text-white/40 py-10 text-center">Loading...</p>;

  // ── Inline edit form ───────────────────────────────────────────────────────
  const PostForm = ({ post, onClose, onSaved, isNew }) => {
    const [form, setForm] = useState({
      title:    post?.title    || "",
      category: post?.category || "Techniques",
      excerpt:  post?.excerpt  || "",
      content:  post?.content  || "",
      read_time:post?.read_time|| "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      setError("");
      try {
        const payload = new FormData();
        payload.append("title", form.title);
        payload.append("category", form.category);
        payload.append("excerpt", form.excerpt);
        payload.append("content", form.content);
        payload.append("read_time", form.read_time);
        if (imageFile) {
          payload.append("image", imageFile);
        }
        if (removeImage) {
          payload.append("remove_image", "true");
        }

        let res;
        if (isNew) {
          res = await api.post("/blog/create/", payload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          res = await api.put(`/blog/${post.id}/`, payload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        const data = res.data;
        onSaved(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to save post.");
      }
      setSaving(false);
    };

    return (
      <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-wood-700 dark:text-white text-lg">
            {isNew ? "Write New Blog Post" : "Edit Blog Post"}
          </h3>
          <button onClick={onClose} className="text-wood-400 hover:text-wood-700 dark:hover:text-white text-xl">✕</button>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {!isNew && (
          <div className={`mb-4 text-xs px-3 py-2 rounded-lg ${
            post?.is_published
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
          }`}>
            {post?.is_published
              ? "✅ This post is live. Edits will update immediately."
              : "⏳ This post is a draft. Admin must approve before it goes live."}
          </div>
        )}
        {isNew && (
          <div className="mb-4 text-xs px-3 py-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            ℹ️ Your post will be saved as a draft. Admin will review and publish it.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Title *</label>
            <input className={fieldClass} required value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="e.g. My Wood Carving Tips" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Category *</label>
              <select className={fieldClass} value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Read Time</label>
              <input className={fieldClass} value={form.read_time}
                onChange={(e) => setForm({...form, read_time: e.target.value})}
                placeholder="e.g. 5 min read" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Excerpt</label>
            <input className={fieldClass} value={form.excerpt}
              onChange={(e) => setForm({...form, excerpt: e.target.value})}
              placeholder="Short summary (shown in blog list)" />
          </div>
          <div>
            <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Content *</label>
            <textarea className={`${fieldClass} resize-none`} rows={10} required
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              placeholder="Write your blog post here. Use ## for headings, **bold**, - for bullet points." />
          </div>
          <div>
            <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Cover Image</label>
            {post?.image_url && (
              <div className="mb-3 flex items-center gap-3">
                <img src={(function(u){ if(!u) return u; if(/^https?:\/\//i.test(u)) return u; const backend = api.defaults.baseURL.replace(/\/(?:(?:api)\/?$)/,""); return `${backend}${u}`; })(post.image_url)} alt="Current cover" className="w-28 h-16 object-cover rounded-md border" />
                <div className="text-xs text-wood-500 dark:text-dark-muted">
                  Current cover image. Choose a new photo to replace it, or leave unchanged to keep it.
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 mb-2">
              <input id={`remove-${post?.id || 'new'}`} type="checkbox" checked={removeImage} onChange={(e) => { setRemoveImage(e.target.checked); if(e.target.checked) setImageFile(null); }} />
              <label htmlFor={`remove-${post?.id || 'new'}`} className="text-xs text-wood-500 dark:text-dark-muted">Remove current image</label>
            </div>

            <input type="file" accept="image/*" disabled={removeImage}
              onChange={(e) => setImageFile(e.target.files[0] || null)}
              className="w-full text-sm text-wood-700 dark:text-white" />
            {imageFile && (
              <p className="mt-2 text-xs text-wood-500 dark:text-dark-muted">Selected: {imageFile.name}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-wood-700 dark:bg-white text-cream dark:text-black px-6 py-2 rounded font-bold hover:bg-wood-600 transition text-sm">
              {saving ? "Saving..." : isNew ? "Submit for Review" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose}
              className="border border-wood-200 dark:border-white/20 text-wood-600 dark:text-white/70 px-6 py-2 rounded text-sm hover:bg-wood-50 dark:hover:bg-white/5 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-wood-700 dark:text-white">
          My Blog Posts
          <span className="ml-2 text-sm font-normal text-wood-400 dark:text-white/40">({posts.length})</span>
        </h2>
        {!newPostOpen && !editingPost && (
          <button onClick={() => setNewPostOpen(true)}
            className="text-sm bg-wood-700 dark:bg-white text-cream dark:text-black px-4 py-2 rounded font-medium hover:bg-wood-600 transition">
            + Write New Post
          </button>
        )}
      </div>

      {/* New post form */}
      {newPostOpen && (
        <PostForm
          isNew
          onClose={() => setNewPostOpen(false)}
          onSaved={(created) => {
            setPosts((prev) => [created, ...prev]);
            setNewPostOpen(false);
          }}
        />
      )}

      {/* Edit form */}
      {editingPost && (
        <PostForm
          post={editingPost}
          isNew={false}
          onClose={() => setEditingPost(null)}
          onSaved={(updated) => {
            setPosts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
            setEditingPost(null);
          }}
        />
      )}

      {/* Posts list */}
      {!newPostOpen && !editingPost && (
        <>
          {posts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-wood-400 dark:text-white/40 mb-4">
                You haven't written any blog posts yet.
              </p>
              <button onClick={() => setNewPostOpen(true)}
                className="text-sm bg-wood-700 text-cream px-5 py-2 rounded hover:bg-wood-600 transition">
                Write Your First Post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id}
                  className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-wood-700 dark:text-white truncate">{post.title}</p>
                    <p className="text-xs text-wood-400 dark:text-white/40 mt-0.5">
                      {post.category} · {new Date(post.created_at).toLocaleDateString("en-KE")}
                    </p>
                    {post.excerpt && (
                      <p className="text-xs text-wood-500 dark:text-white/50 mt-1 line-clamp-1">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      post.is_published
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    }`}>
                      {post.is_published ? "Live" : "Draft"}
                    </span>
                    <button onClick={() => setEditingPost(post)}
                      className="text-xs bg-forest text-white px-3 py-1 rounded hover:opacity-90 transition">
                      Edit
                    </button>
                    <button onClick={() => deletePost(post.id, post.title)}
                      className="text-xs text-red-400 hover:text-red-600 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Account;
