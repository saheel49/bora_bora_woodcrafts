import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/currency";
import api from "../../utils/api";

const BLOG_CATEGORIES = [
  "Techniques",
  "Sustainability",
  "Product Care",
  "News",
  "Other",
];

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !isAdmin) navigate("/");
  }, [user, isAdmin, navigate]);

  const loadData = useCallback(() => {
    if (!isAdmin) return;
    setLoading(true);
    Promise.all([
      api.get("/admin/stats/"),
      api.get("/products/inventory/"),
    ])
      .then(([s, inv]) => {
        setStats(s.data.stats);
        setOrders(s.data.recent_orders);
        // Handle paginated or plain array
        const invData = inv.data;
        setInventory(Array.isArray(invData) ? invData : (invData.results || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!isAdmin) return null;

  const STATUS_COLORS = {
    Delivered: "text-green-600 bg-green-50 dark:bg-green-900/20",
    Processing: "text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20",
    Shipped: "text-blue-700 bg-blue-50 dark:bg-blue-900/20",
    Confirmed: "text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20",
    Pending: "text-gray-600 bg-gray-100 dark:bg-gray-800",
    Cancelled: "text-red-600 bg-red-50 dark:bg-red-900/20",
    "Out for Delivery": "text-orange-700 bg-orange-50 dark:bg-orange-900/20",
  };

  const TABS = ["overview", "orders", "inventory", "messages", "customers", "blogs", "revenue"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-wood-700 dark:text-white">Admin Dashboard</h1>
          <p className="text-wood-500 dark:text-white/50 text-sm mt-1">Welcome back, {user?.first_name}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="text-sm border border-wood-300 dark:border-white/20 text-wood-600 dark:text-white/70 px-3 py-2 rounded hover:bg-wood-50 dark:hover:bg-white/5 transition">
            ↻ Refresh
          </button>
          <Link to="/shop" className="text-sm bg-wood-700 dark:bg-white text-cream dark:text-black px-4 py-2 rounded hover:bg-wood-600 transition">
            View Store →
          </Link>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-wood-200 dark:border-white/10 mb-8">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium capitalize transition border-b-2 -mb-px ${
              tab === t ? "border-wood-600 text-wood-700 dark:text-white"
                        : "border-transparent text-wood-400 dark:text-white/40 hover:text-wood-600 dark:hover:text-white"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-wood-400 dark:text-white/40 text-center py-20">Loading...</p>
      ) : (
        <>
          {tab === "overview"   && <OverviewTab stats={stats} setTab={setTab} />}
          {tab === "orders"    && <OrdersTab orders={orders} setOrders={setOrders} STATUS_COLORS={STATUS_COLORS} />}
          {tab === "inventory" && <InventoryTab inventory={inventory} setInventory={setInventory} reload={loadData} />}
          {tab === "messages"  && <MessagesTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "blogs"     && <BlogsAdminTab />}
          {tab === "revenue"   && <RevenueTab orders={orders} />}
        </>
      )}
    </div>
  );
}


// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ stats, setTab }) {
  if (!stats) return null;
  const cards = [
    { label: "Total Orders",    value: stats.total_orders,    tab: "orders"    },
    { label: "Pending Orders",  value: stats.pending_orders,  tab: "orders",    alert: stats.pending_orders > 0 },
    { label: "Total Revenue",   value: formatPrice(stats.total_revenue), tab: "revenue" },
    { label: "Total Products",  value: stats.total_products,  tab: "inventory" },
    { label: "Total Customers", value: stats.total_users,     tab: "customers" },
    { label: "Blog Posts",      value: stats.total_blog_posts, tab: "blogs"     },
    { label: "Low Stock",       value: stats.low_stock_count, tab: "inventory", alert: stats.low_stock_count > 0 },
    { label: "Unread Messages", value: stats.unread_messages, tab: "messages",  alert: stats.unread_messages > 0 },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, tab, alert }) => (
          <button key={label} onClick={() => tab && setTab(tab)}
            className={`text-left bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-5 shadow-sm transition
              ${tab ? "hover:shadow-md hover:scale-105 cursor-pointer" : "cursor-default"}
              ${alert ? "border-l-4 border-amber-400" : ""}`}
          >
            <p className="text-2xl font-bold text-wood-700 dark:text-white">{value}</p>
            <p className="text-xs text-wood-400 dark:text-white/40 mt-1">{label}</p>
            {tab && <p className="text-xs text-wood-300 dark:text-white/20 mt-1">Click to view →</p>}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-bold text-wood-700 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Add New Product", tab: "inventory" },
          { label: "View All Orders", tab: "orders"    },
          { label: "Check Inventory", tab: "inventory" },
          { label: "Read Messages",   tab: "messages"  },
        ].map(({ label, tab }) => (
          <button key={label} onClick={() => setTab(tab)}
            className="bg-wood-700 dark:bg-white/10 text-cream dark:text-white rounded-xl p-4 text-sm font-medium hover:bg-wood-600 dark:hover:bg-white/20 transition text-left">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}


// ─── Orders Tab ───────────────────────────────────────────────────────────────
const ORDER_STATUSES = ["Pending","Confirmed","Processing","Shipped","Out for Delivery","Delivered","Cancelled"];

function OrdersTab({ orders, setOrders, STATUS_COLORS }) {
  const [updating, setUpdating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status/`, { status: newStatus });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert("Failed to update status.");
    }
    setUpdating(null);
  };

  const loadOrderDetails = async (orderId) => {
    setOrderDetailLoading(true);
    try {
      const { data } = await api.get(`/orders/${orderId}/`);
      setSelectedOrder(data);
    } catch {
      alert("Failed to load order details.");
    } finally {
      setOrderDetailLoading(false);
    }
  };

  const closeOrderDetails = () => setSelectedOrder(null);

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-5">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-wood-400 dark:text-white/40">No orders yet.</p>
      ) : (
        <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-wood-100 dark:border-white/10 text-left">
                {["Order #","Customer","Email","Total","Status","Update Status","Date","Details"].map((h) => (
                  <th key={h} className="px-4 py-3 text-wood-500 dark:text-white/50 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-wood-50 dark:border-white/5 hover:bg-wood-50 dark:hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-medium text-wood-700 dark:text-white">#{order.id}</td>
                    <td className="px-4 py-3 text-wood-600 dark:text-white/70 whitespace-nowrap">{order.first_name} {order.last_name}</td>
                    <td className="px-4 py-3 text-wood-500 dark:text-white/50">{order.email}</td>
                    <td className="px-4 py-3 font-medium text-wood-700 dark:text-white whitespace-nowrap">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={order.status} disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-2 py-1 focus:outline-none">
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-wood-400 dark:text-white/40 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-KE")}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => loadOrderDetails(order.id)}
                        className="text-xs bg-wood-700 dark:bg-white text-cream dark:text-black px-3 py-1 rounded hover:bg-wood-600 transition">
                        View
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-wood-50 dark:border-white/5 bg-wood-50/70 dark:bg-white/5">
                    <td colSpan="8" className="px-4 py-3">
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-wood-500 dark:text-white/50">Items</p>
                        <ul className="space-y-1 text-sm text-wood-600 dark:text-white/70">
                          {(order.items || []).map((item) => (
                            <li key={item.id || `${order.id}-${item.name}`} className="flex justify-between gap-3">
                              <span>{item.name} × {item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              loading={orderDetailLoading}
              onClose={closeOrderDetails}
              STATUS_COLORS={STATUS_COLORS}
            />
          )}
        </div>
      )}
    </div>
  );
}


// ─── Inventory Tab ────────────────────────────────────────────────────────────
function InventoryTab({ inventory, setInventory, reload }) {
  const [editStock, setEditStock]       = useState({});   // { [id]: newStock }
  const [editDiscount, setEditDiscount] = useState({});   // { [id]: oldPrice }
  const [deleting, setDeleting]         = useState(null);
  const [saving, setSaving]             = useState(null);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  const loadProductDetails = async (id) => {
    setProductLoading(true);
    try {
      const { data } = await api.get(`/products/${id}/`);
      setSelectedProduct(data);
    } catch {
      alert("Failed to load product details.");
    } finally {
      setProductLoading(false);
    }
  };

  const closeProductDetails = () => setSelectedProduct(null);

  const saveStock = async (id) => {
    setSaving(`stock-${id}`);
    try {
      await api.put(`/products/${id}/stock/`, { stock: parseInt(editStock[id]) });
      setInventory((prev) => prev.map((p) => p.id === id ? { ...p, stock: parseInt(editStock[id]) } : p));
      setEditStock((prev) => { const n = {...prev}; delete n[id]; return n; });
    } catch { alert("Failed to update stock."); }
    setSaving(null);
  };

  const saveDiscount = async (id) => {
    setSaving(`disc-${id}`);
    const val = editDiscount[id];
    try {
      await api.put(`/products/${id}/discount/`, { old_price: val === "" ? null : parseFloat(val) });
      setInventory((prev) => prev.map((p) => p.id === id ? { ...p, old_price: val === "" ? null : parseFloat(val) } : p));
      setEditDiscount((prev) => { const n = {...prev}; delete n[id]; return n; });
    } catch { alert("Failed to update discount."); }
    setSaving(null);
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}/`);
      setInventory((prev) => prev.filter((p) => p.id !== id));
    } catch { alert("Failed to delete product."); }
    setDeleting(null);
  };

  const handleEditProduct = async (id) => {
    setLoadingEdit(true);
    try {
      const { data } = await api.get(`/products/${id}/`);
      setEditingProduct(data);
      setShowAddForm(true);
    } catch {
      alert("Failed to load product details for editing.");
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-wood-700 dark:text-white">Inventory Management</h2>
        <button onClick={() => setShowAddForm(true)}
          className="bg-wood-700 dark:bg-white text-cream dark:text-black text-sm px-4 py-2 rounded font-medium hover:bg-wood-600 transition">
          + Add Product
        </button>
      </div>

      {showAddForm && <AddProductForm
        initialProduct={editingProduct}
        onClose={() => { setShowAddForm(false); setEditingProduct(null); }}
        onSaved={() => { reload(); setEditingProduct(null); }}
      />}

      <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wood-100 dark:border-white/10 text-left">
              {["Product","Category","Price","Stock","Set Stock","Old Price (Discount)","Status","Actions"].map((h) => (
                <th key={h} className="px-3 py-3 text-wood-500 dark:text-white/50 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-wood-50 dark:border-white/5 hover:bg-wood-50 dark:hover:bg-white/5 transition">
                <td className="px-3 py-3 font-medium text-wood-700 dark:text-white">
                  <button onClick={() => loadProductDetails(item.id)}
                    className="text-left text-wood-700 dark:text-white hover:underline focus:outline-none">
                    {item.name}
                  </button>
                </td>
                <td className="px-3 py-3 text-wood-500 dark:text-white/50">{item.category}</td>
                <td className="px-3 py-3 text-wood-700 dark:text-white whitespace-nowrap">{formatPrice(item.price)}</td>
                <td className="px-3 py-3 font-medium">
                  <span className={item.stock === 0 ? "text-red-500" : item.low_stock ? "text-amber-500" : "text-forest"}>{item.stock}</span>
                </td>
                {/* Edit stock */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <input type="number" min="0" placeholder={item.stock}
                      value={editStock[item.id] ?? ""}
                      onChange={(e) => setEditStock((p) => ({ ...p, [item.id]: e.target.value }))}
                      className="w-16 border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-2 py-1 text-xs focus:outline-none" />
                    {editStock[item.id] !== undefined && (
                      <button onClick={() => saveStock(item.id)} disabled={saving === `stock-${item.id}`}
                        className="text-xs bg-forest text-white px-2 py-1 rounded hover:opacity-80 transition">
                        {saving === `stock-${item.id}` ? "..." : "Save"}
                      </button>
                    )}
                  </div>
                </td>
                {/* Discount */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <input type="number" min="0" placeholder={item.old_price || "No discount"}
                      value={editDiscount[item.id] ?? ""}
                      onChange={(e) => setEditDiscount((p) => ({ ...p, [item.id]: e.target.value }))}
                      className="w-24 border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-2 py-1 text-xs focus:outline-none" />
                    {editDiscount[item.id] !== undefined && (
                      <button onClick={() => saveDiscount(item.id)} disabled={saving === `disc-${item.id}`}
                        className="text-xs bg-wood-500 text-white px-2 py-1 rounded hover:opacity-80 transition">
                        {saving === `disc-${item.id}` ? "..." : "Save"}
                      </button>
                    )}
                  </div>
                  {item.old_price && <p className="text-xs text-red-400 mt-0.5">Was {formatPrice(item.old_price)}</p>}
                </td>
                <td className="px-3 py-3">
                  {item.stock === 0
                    ? <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Out of Stock</span>
                    : item.low_stock
                    ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Low Stock</span>
                    : <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">In Stock</span>}
                </td>
                <td className="px-3 py-3 flex gap-2 items-center">
                  <button onClick={() => handleEditProduct(item.id)} disabled={loadingEdit === item.id}
                    className="text-xs bg-wood-700 dark:bg-white text-cream dark:text-black px-2 py-1 rounded hover:bg-wood-600 transition">
                    {loadingEdit === item.id ? "..." : "Edit"}
                  </button>
                  <button onClick={() => deleteProduct(item.id, item.name)} disabled={deleting === item.id}
                    className="text-xs text-red-400 hover:text-red-600 transition font-medium">
                    {deleting === item.id ? "..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={closeProductDetails}
          loading={productLoading}
        />
      )}
    </div>
  );
}


// ─── Add Product Form ─────────────────────────────────────────────────────────
function AddProductForm({ initialProduct, onClose, onSaved }) {
  const isEditing = Boolean(initialProduct);
  const [form, setForm] = useState({
    name: "", category_id: "", price: "", old_price: "",
    short_description: "", description: "", stock: "", is_featured: false, is_best_seller: false,
  });
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products/categories/")
      .then((r) => {
        const data = r.data;
        setCategories(Array.isArray(data) ? data : (data.results || []));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialProduct) {
      setForm({
        name: "", category_id: "", price: "", old_price: "",
        short_description: "", description: "", stock: "", is_featured: false, is_best_seller: false,
      });
      setImageFile(null);
      setError("");
      setCategoryMessage("");
      return;
    }

    setForm({
      name: initialProduct.name || "",
      category_id: initialProduct.category?.id || "",
      price: initialProduct.price || "",
      old_price: initialProduct.old_price || "",
      short_description: initialProduct.short_description || "",
      description: initialProduct.description || "",
      stock: initialProduct.stock || 0,
      is_featured: initialProduct.is_featured || false,
      is_best_seller: initialProduct.is_best_seller || false,
    });
    setImageFile(null);
    setError("");
    setCategoryMessage("");
  }, [initialProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price:     parseFloat(form.price),
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      stock:     parseInt(form.stock),
    };

    try {
      let product;
      if (isEditing) {
        const { data } = await api.put(`/products/${initialProduct.id}/`, payload);
        product = data;
      } else {
        const { data } = await api.post("/products/", payload);
        product = data;
      }

      if (imageFile) {
        const imagePayload = new FormData();
        imagePayload.append("images", imageFile);
        await api.post(`/products/${product.id}/images/`, imagePayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save product.");
    }
    setSaving(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    setCategorySaving(true);
    setCategoryMessage("");

    try {
      const slug = newCategory.trim().toLowerCase().replace(/\s+/g, "-");
      const { data } = await api.post("/products/categories/", { name: newCategory.trim(), slug });
      setCategories((prev) => [...prev, data]);
      setForm((prev) => ({ ...prev, category_id: data.id }));
      setNewCategory("");
      setCategoryMessage(`Created category "${data.name}".`);
    } catch (err) {
      setCategoryMessage(err.response?.data?.slug?.[0] || err.response?.data?.name?.[0] || "Could not create category.");
    }
    setCategorySaving(false);
  };

  const field = "w-full border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400";

  return (
    <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="font-bold text-wood-700 dark:text-white text-lg">{isEditing ? "Edit Product" : "Add New Product"}</h3>
          <p className="text-sm text-wood-500 dark:text-dark-muted">You can optionally upload an image or create a new category while adding the product.</p>
        </div>
        <button onClick={onClose} className="text-wood-400 hover:text-wood-700 dark:hover:text-white text-xl">✕</button>
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Product Name *</label>
          <input className={field} required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. Carved Wall Panel" />
        </div>

        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Category *</label>
          <select className={field} required value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">New category</label>
          <div className="flex gap-2">
            <input className={`${field} flex-1`} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Create new category" />
            <button type="button" onClick={handleCreateCategory} disabled={categorySaving}
              className="rounded-xl bg-wood-700 text-cream px-3 py-2 text-sm hover:bg-wood-600 transition">
              {categorySaving ? "..." : "Add"}
            </button>
          </div>
          {categoryMessage && <p className="text-xs text-wood-500 dark:text-dark-muted">{categoryMessage}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Price (KSh) *</label>
          <input className={field} type="number" required value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="e.g. 5000" />
        </div>
        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Old Price / Discount (KSh)</label>
          <input className={field} type="number" value={form.old_price} onChange={(e) => setForm({...form, old_price: e.target.value})} placeholder="Leave blank for no discount" />
        </div>
        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Stock *</label>
          <input className={field} type="number" required value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="e.g. 10" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Short Description</label>
          <input className={field} value={form.short_description} onChange={(e) => setForm({...form, short_description: e.target.value})} placeholder="One line summary" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Full Description</label>
          <textarea className={`${field} resize-none`} rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Full product details..." />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-2">
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
            className="w-full text-sm text-wood-700 dark:text-white"
          />
          {imageFile && <p className="text-xs text-wood-500 dark:text-dark-muted">Selected: {imageFile.name}</p>}
        </div>

        <div className="flex gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-wood-600 dark:text-white/70 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({...form, is_featured: e.target.checked})} className="accent-wood-600" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-wood-600 dark:text-white/70 cursor-pointer">
            <input type="checkbox" checked={form.is_best_seller} onChange={(e) => setForm({...form, is_best_seller: e.target.checked})} className="accent-wood-600" />
            Best Seller
          </label>
        </div>

        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-wood-700 dark:bg-white text-cream dark:text-black px-6 py-2 rounded font-bold hover:bg-wood-600 transition text-sm">
            {saving ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
          </button>
          <button type="button" onClick={onClose} className="border border-wood-200 dark:border-white/20 text-wood-600 dark:text-white/70 px-6 py-2 rounded text-sm hover:bg-wood-50 dark:hover:bg-white/5 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


// ─── Messages Tab ─────────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    api.get("/contact/")
      .then((r) => setMessages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-wood-400 dark:text-white/40 py-10 text-center">Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-5">
        Contact Messages
        {messages.filter((m) => !m.is_read).length > 0 && (
          <span className="ml-2 text-sm bg-wood-400 text-white px-2 py-0.5 rounded-full">
            {messages.filter((m) => !m.is_read).length} new
          </span>
        )}
      </h2>
      {messages.length === 0 ? (
        <p className="text-wood-400 dark:text-white/40">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id}
              className={`bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-5 shadow-sm ${!msg.is_read ? "border-l-4 border-wood-400" : ""}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-wood-700 dark:text-white">{msg.name}</p>
                  <p className="text-xs text-wood-400 dark:text-white/40">
                    {msg.email} · {new Date(msg.created_at).toLocaleDateString("en-KE")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!msg.is_read && <span className="text-xs bg-wood-400 text-white px-2 py-0.5 rounded-full">New</span>}
                  <button onClick={() => setSelectedMessage(msg)}
                    className="text-xs underline text-wood-600 dark:text-white/70 hover:text-wood-700 dark:hover:text-white focus:outline-none">
                    View
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-wood-600 dark:text-white/70 mb-1">{msg.subject}</p>
              <p className="text-sm text-wood-500 dark:text-white/60 line-clamp-3">{msg.message}</p>
              <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                className="inline-block mt-3 text-xs text-wood-500 dark:text-white/50 underline hover:text-wood-700 dark:hover:text-white transition">
                Reply via Email →
              </a>
            </div>
          ))}
        </div>
      )}
      {selectedMessage && (
        <MessageDetailsModal message={selectedMessage} onClose={() => setSelectedMessage(null)} />
      )}
    </div>
  );
}


// ─── Customers Tab ────────────────────────────────────────────────────────────
function CustomersTab() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [allOrders, setAllOrders] = useState(null);

  useEffect(() => {
    api.get("/auth/customers/")
      .then((r) => {
        const d = r.data;
        setCustomers(Array.isArray(d) ? d : (d.results || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadCustomerOrders = async (customer) => {
    setSelectedCustomer(customer);
    if (allOrders) {
      setCustomerOrders(allOrders.filter((order) => order.user_email === customer.email));
      return;
    }

    setOrdersLoading(true);
    try {
      const { data } = await api.get("/orders/all/");
      setAllOrders(data);
      setCustomerOrders(data.filter((order) => order.user_email === customer.email));
    } catch {
      alert("Failed to load customer orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
    setCustomerOrders([]);
  };

  if (loading) return <p className="text-wood-400 dark:text-white/40 text-center py-20">Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-5">
        All Customers <span className="text-sm font-normal text-wood-400 dark:text-white/40">({customers.length})</span>
      </h2>
      {customers.length === 0 ? (
        <p className="text-wood-400 dark:text-white/40">No customers yet.</p>
      ) : (
        <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-wood-100 dark:border-white/10 text-left">
                {["#","Username","Name","Email","Phone","Joined","Details"].map((h) => (
                  <th key={h} className="px-4 py-3 text-wood-500 dark:text-white/50 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className="border-b border-wood-50 dark:border-white/5 hover:bg-wood-50 dark:hover:bg-white/5 transition">
                  <td className="px-4 py-3 text-wood-400 dark:text-white/30 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-wood-700 dark:text-white">{c.username}</td>
                  <td className="px-4 py-3 text-wood-600 dark:text-white/70">{c.first_name} {c.last_name}</td>
                  <td className="px-4 py-3 text-wood-500 dark:text-white/50">{c.email}</td>
                  <td className="px-4 py-3 text-wood-500 dark:text-white/50">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-wood-400 dark:text-white/40">
                    {new Date(c.created_at).toLocaleDateString("en-KE")}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => loadCustomerOrders(c)}
                      className="text-xs bg-wood-700 dark:bg-white text-cream dark:text-black px-3 py-1 rounded hover:bg-wood-600 transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          orders={customerOrders}
          loading={ordersLoading}
          onClose={closeCustomerDetails}
        />
      )}
    </div>
  );
}

// ─── Blogs Admin Tab ──────────────────────────────────────────────────────────
function BlogsAdminTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);

  const loadPosts = () => {
    setLoading(true);
    api.get("/blog/")
      .then((r) => {
        const d = r.data;
        const list = Array.isArray(d) ? d : (d.results || []);
        setPosts(list.sort((a, b) => Number(a.is_published) - Number(b.is_published)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPosts(); }, []);

  const publish = async (id) => {
    try {
      await api.put(`/blog/${id}/publish/`);
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, is_published: true } : p));
    } catch { alert("Failed to publish."); }
  };

  const deletePost = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/blog/${id}/`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (viewingPost?.id === id) setViewingPost(null);
    } catch { alert("Failed to delete."); }
  };

  const startEditing = (post) => {
    setEditingPost(post);
  };

  const closeEditor = () => {
    setEditingPost(null);
  };

  const updatePost = (updated) => {
    setPosts((prev) => prev.map((post) => post.id === updated.id ? updated : post));
    if (viewingPost?.id === updated.id) setViewingPost(updated);
  };

  if (loading) return <p className="text-wood-400 dark:text-white/40 text-center py-20">Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-5">
        Blog Posts <span className="text-sm font-normal text-wood-400 dark:text-white/40">({posts.length})</span>
      </h2>
      {editingPost ? (
        <BlogEditForm
          post={editingPost}
          onClose={closeEditor}
          onSaved={(updated) => { updatePost(updated); closeEditor(); }}
        />
      ) : posts.length === 0 ? (
        <p className="text-wood-400 dark:text-white/40">No blog posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <button onClick={() => setViewingPost(post)} className="text-left w-full">
                  <p className="font-semibold text-wood-700 dark:text-white truncate">{post.title}</p>
                  <p className="text-xs text-wood-400 dark:text-white/40 mt-0.5">
                    By {post.author_name} · {post.category} · {new Date(post.created_at).toLocaleDateString("en-KE")}
                  </p>
                </button>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  post.is_published
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                }`}>
                  {post.is_published ? "Published" : "Draft"}
                </span>
                {!post.is_published && (
                  <button onClick={() => publish(post.id)}
                    className="text-xs bg-wood-700 dark:bg-white text-cream dark:text-black px-3 py-1 rounded hover:bg-wood-600 transition">
                    Publish
                  </button>
                )}
                <button onClick={() => startEditing(post)}
                  className="text-xs bg-forest text-white px-3 py-1 rounded hover:bg-forest/90 transition">
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
      {viewingPost && (
        <BlogDetailsModal
          post={viewingPost}
          onClose={() => setViewingPost(null)}
          onEdit={() => { setEditingPost(viewingPost); setViewingPost(null); }}
          onPublish={() => publish(viewingPost.id)}
          onDelete={() => deletePost(viewingPost.id, viewingPost.title)}
        />
      )}
    </div>
  );
}

function BlogEditForm({ post, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: post.title || "",
    category: post.category || "",
    excerpt: post.excerpt || "",
    content: post.content || "",
    read_time: post.read_time || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

      const { data } = await api.put(`/blog/${post.id}/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-wood-700 dark:text-white text-lg">Edit Blog Post</h3>
          <p className="text-sm text-wood-500 dark:text-dark-muted">Make updates and save changes for review or republish.</p>
        </div>
        <button onClick={onClose} className="text-wood-400 hover:text-wood-700 dark:hover:text-white text-xl">✕</button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Title</label>
          <input className="w-full border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Category</label>
          <select className="w-full border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Excerpt</label>
          <textarea className="w-full border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400" rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Content</label>
          <textarea className="w-full border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400" rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Read Time</label>
          <input className="w-full border border-wood-200 dark:border-white/20 dark:bg-dark-surface dark:text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-wood-400"
            value={form.read_time}
            onChange={(e) => setForm({ ...form, read_time: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-wood-600 dark:text-white/60 mb-1">Cover Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0] || null)}
            className="w-full text-sm text-wood-700 dark:text-white"
          />
          {imageFile && <p className="text-xs text-wood-500 dark:text-dark-muted">Selected: {imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-wood-700 dark:bg-white text-cream dark:text-black px-6 py-2 rounded font-bold hover:bg-wood-600 transition text-sm">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={onClose}
            className="border border-wood-200 dark:border-white/20 text-wood-600 dark:text-white/70 px-6 py-2 rounded text-sm hover:bg-wood-50 dark:hover:bg-white/5 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-4xl max-h-[calc(100vh-4rem)] overflow-y-auto rounded-3xl bg-white dark:bg-dark-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-wood-100 dark:border-white/10 px-6 py-4">
          <h3 className="text-lg font-bold text-wood-700 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-wood-500 dark:text-white/60 text-xl">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function OrderDetailsModal({ order, loading, onClose, STATUS_COLORS }) {
  if (loading) {
    return (
      <ModalShell title="Loading order details..." onClose={onClose}>
        <p className="text-wood-500 dark:text-white/60">Please wait while the order loads.</p>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={`Order #${order.id}`} onClose={onClose}>
      <div className="space-y-6 text-sm text-wood-700 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Customer</p>
            <p className="mt-2 font-semibold">{order.first_name} {order.last_name}</p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Delivery</p>
            <p className="mt-2">{order.address}</p>
            <p>{order.city}, {order.country}</p>
            <p className="mt-2">Payment: {order.payment_method}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-wood-50 dark:bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Subtotal</p>
            <p className="text-lg font-semibold mt-2">{formatPrice(order.subtotal)}</p>
          </div>
          <div className="rounded-2xl bg-wood-50 dark:bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Shipping</p>
            <p className="text-lg font-semibold mt-2">{formatPrice(order.shipping_cost)}</p>
          </div>
          <div className="rounded-2xl bg-wood-50 dark:bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Total</p>
            <p className="text-lg font-semibold mt-2">{formatPrice(order.total)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Status</p>
          <span className={`inline-flex items-center rounded-full px-3 py-1 mt-2 text-xs font-semibold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
            {order.status}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40 mb-2">Order items</p>
          <div className="space-y-3">
            {(order.items || []).map((item) => (
              <div key={item.id || `${order.id}-${item.name}`} className="rounded-2xl bg-wood-50 dark:bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-wood-500 dark:text-white/40">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.status_history && order.status_history.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40 mb-2">Status history</p>
            <div className="space-y-2">
              {order.status_history.map((history, index) => (
                <div key={index} className="rounded-2xl bg-wood-50 dark:bg-white/5 p-3">
                  <p className="text-sm font-semibold">{history.status}</p>
                  <p className="text-xs text-wood-500 dark:text-white/40">{new Date(history.timestamp).toLocaleString()}</p>
                  {history.note && <p className="text-xs mt-1 text-wood-500 dark:text-white/40">Note: {history.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function ProductDetailsModal({ product, loading, onClose }) {
  if (loading) {
    return (
      <ModalShell title="Loading product..." onClose={onClose}>
        <p className="text-wood-500 dark:text-white/60">Please wait while product details load.</p>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={product.name || "Product details"} onClose={onClose}>
      <div className="space-y-6 text-wood-700 dark:text-white text-sm">
        {product.images?.length > 0 && (
          <img src={product.images[0]} alt={product.name} className="w-full rounded-3xl object-cover max-h-72" />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Category</p>
            <p className="mt-2 font-semibold">{product.category?.name || product.category || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Price</p>
            <p className="mt-2 font-semibold">{formatPrice(product.price)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Stock</p>
            <p className={`mt-2 font-semibold ${product.stock === 0 ? "text-red-500" : product.stock <= 3 ? "text-amber-500" : "text-forest"}`}>
              {product.stock} {product.stock === 0 ? "(Out of Stock)" : product.stock <= 3 ? "(Low Stock)" : ""}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Status</p>
            <p className="mt-2">{product.low_stock ? "Low stock" : "In stock"}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40 mb-2">Description</p>
          <p className="text-sm text-wood-600 dark:text-white/70 whitespace-pre-line">{product.description || "No description available."}</p>
        </div>
      </div>
    </ModalShell>
  );
}

function MessageDetailsModal({ message, onClose }) {
  return (
    <ModalShell title={`Message from ${message.name}`} onClose={onClose}>
      <div className="space-y-4 text-sm text-wood-700 dark:text-white">
        <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">From</p>
        <p>{message.name} · {message.email}</p>
        <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Subject</p>
        <p className="font-semibold">{message.subject}</p>
        <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Received</p>
        <p>{new Date(message.created_at).toLocaleString()}</p>
        <div className="rounded-3xl bg-wood-50 dark:bg-white/5 p-4">
          <p className="text-sm text-wood-600 dark:text-white/70 whitespace-pre-line">{message.message}</p>
        </div>
        <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-wood-700 dark:text-white hover:underline">
          Reply by email
        </a>
      </div>
    </ModalShell>
  );
}

function CustomerDetailsModal({ customer, orders, loading, onClose }) {
  return (
    <ModalShell title={`Customer: ${customer.username}`} onClose={onClose}>
      <div className="space-y-6 text-sm text-wood-700 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Name</p>
            <p className="mt-2 font-semibold">{customer.first_name} {customer.last_name}</p>
            <p className="mt-1">{customer.username}</p>
            <p className="mt-1">{customer.email}</p>
            <p className="mt-1">{customer.phone || "No phone provided"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Joined</p>
            <p className="mt-2">{new Date(customer.created_at).toLocaleDateString("en-KE")}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Order history</p>
            {loading && <span className="text-xs text-wood-500 dark:text-white/50">Loading...</span>}
          </div>
          {orders.length === 0 ? (
            <p className="text-wood-500 dark:text-white/50">No orders for this customer yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl bg-wood-50 dark:bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-xs text-wood-500 dark:text-white/40">{new Date(order.created_at).toLocaleDateString("en-KE")}</p>
                    </div>
                    <p className="font-semibold text-wood-700 dark:text-white">{formatPrice(order.total)}</p>
                  </div>
                  <p className="text-xs mt-2 text-wood-500 dark:text-white/40">Status: {order.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function BlogDetailsModal({ post, onClose, onEdit, onPublish, onDelete }) {
  return (
    <ModalShell title={post.title} onClose={onClose}>
      <div className="space-y-5 text-wood-700 dark:text-white text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Author</p>
            <p className="mt-2 font-semibold">{post.author_name || "Unknown"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Category</p>
            <p className="mt-2">{post.category}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Excerpt</p>
          <p className="mt-2 text-wood-600 dark:text-white/70">{post.excerpt}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-wood-500 dark:text-white/40">Content</p>
          <p className="mt-2 whitespace-pre-line text-wood-600 dark:text-white/70">{post.content}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onEdit} className="text-xs bg-forest text-white px-3 py-1 rounded hover:bg-forest/90 transition">Edit</button>
          {!post.is_published && (
            <button onClick={onPublish} className="text-xs bg-wood-700 dark:bg-white text-cream dark:text-black px-3 py-1 rounded hover:bg-wood-600 transition">Publish</button>
          )}
          <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 transition">Delete</button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Revenue Tab ──────────────────────────────────────────────────────────────
function RevenueTab({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);

  const delivered = orders.filter((o) => o.status === "Delivered");
  const total     = delivered.reduce((s, o) => s + parseFloat(o.total || 0), 0);
  const pending   = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
  const pendingVal = pending.reduce((s, o) => s + parseFloat(o.total || 0), 0);

  const loadOrderDetails = async (orderId) => {
    setOrderDetailLoading(true);
    try {
      const { data } = await api.get(`/orders/${orderId}/`);
      setSelectedOrder(data);
    } catch {
      alert("Failed to load order details.");
    } finally {
      setOrderDetailLoading(false);
    }
  };

  const closeOrderDetails = () => setSelectedOrder(null);

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-6">Revenue Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Confirmed Revenue",  value: formatPrice(total),      desc: "From delivered orders" },
          { label: "Pending Revenue",    value: formatPrice(pendingVal), desc: "From active orders"    },
          { label: "Delivered Orders",   value: delivered.length,        desc: "Completed orders"      },
        ].map(({ label, value, desc }) => (
          <div key={label} className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl p-5 shadow-sm">
            <p className="text-2xl font-bold text-wood-700 dark:text-white">{value}</p>
            <p className="text-xs font-medium text-wood-600 dark:text-white/70 mt-1">{label}</p>
            <p className="text-xs text-wood-400 dark:text-white/30">{desc}</p>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-bold text-wood-700 dark:text-white mb-4">Delivered Orders Breakdown</h3>
      {delivered.length === 0 ? (
        <p className="text-wood-400 dark:text-white/40">No delivered orders yet.</p>
      ) : (
        <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-wood-100 dark:border-white/10 text-left">
                {["Order #","Customer","City","Amount","Date","Details"].map((h) => (
                  <th key={h} className="px-4 py-3 text-wood-500 dark:text-white/50 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {delivered.map((o) => (
                <tr key={o.id} className="border-b border-wood-50 dark:border-white/5 hover:bg-wood-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-wood-700 dark:text-white">#{o.id}</td>
                  <td className="px-4 py-3 text-wood-600 dark:text-white/70">{o.first_name} {o.last_name}</td>
                  <td className="px-4 py-3 text-wood-500 dark:text-white/50">{o.city}</td>
                  <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 text-wood-400 dark:text-white/40">{new Date(o.created_at).toLocaleDateString("en-KE")}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => loadOrderDetails(o.id)}
                      className="text-xs bg-wood-700 dark:bg-white text-cream dark:text-black px-3 py-1 rounded hover:bg-wood-600 transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              loading={orderDetailLoading}
              onClose={closeOrderDetails}
              STATUS_COLORS={{}}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
