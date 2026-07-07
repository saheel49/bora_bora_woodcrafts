import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const BLOG_CATEGORIES = [
  "Techniques",
  "Sustainability",
  "Product Care",
  "News",
  "Other",
];

function SubmitBlog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "Techniques",
    excerpt: "",
    content: "",
    read_time: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/account");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

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

      await api.post("/blog/create/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setForm({ title: "", category: "Techniques", excerpt: "", content: "", read_time: "" });
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to submit the article. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/blog" className="text-sm text-wood-500 dark:text-dark-muted hover:text-wood-700 dark:hover:text-white transition inline-flex items-center gap-1 mb-6">
        ← Back to Blog
      </Link>

      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-4">Submit a Blog Post</h1>
        <p className="text-wood-500 dark:text-dark-muted mb-6">
          Share your ideas, tips, or product stories. Your submission will be reviewed by our team before publication.
        </p>

        {error && <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3">{error}</div>}
        {success && <div className="mb-4 rounded-xl bg-forest-50 text-forest-700 px-4 py-3">Your post is submitted and pending approval.</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-wood-700 dark:text-white mb-2">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full rounded-2xl border border-wood-200 dark:border-white/20 bg-white dark:bg-dark-surface text-wood-700 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wood-400"
              placeholder="Enter your article title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wood-700 dark:text-white mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-2xl border border-wood-200 dark:border-white/20 bg-white dark:bg-dark-surface text-wood-700 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wood-400"
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-wood-700 dark:text-white mb-2">Read Time</label>
              <input
                value={form.read_time}
                onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                className="w-full rounded-2xl border border-wood-200 dark:border-white/20 bg-white dark:bg-dark-surface text-wood-700 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wood-400"
                placeholder="e.g. 4 min read"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-wood-700 dark:text-white mb-2">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-wood-200 dark:border-white/20 bg-white dark:bg-dark-surface text-wood-700 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wood-400"
              placeholder="Short summary for readers..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wood-700 dark:text-white mb-2">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8}
              required
              className="w-full rounded-2xl border border-wood-200 dark:border-white/20 bg-white dark:bg-dark-surface text-wood-700 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wood-400"
              placeholder="Write your article content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wood-700 dark:text-white mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
              className="w-full text-sm text-wood-700 dark:text-white"
            />
            {imageFile && (
              <p className="mt-2 text-sm text-wood-500 dark:text-dark-muted">Selected: {imageFile.name}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-wood-700 text-cream px-6 py-3 font-semibold hover:bg-wood-600 transition"
            >
              {saving ? "Submitting..." : "Submit for Review"}
            </button>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center rounded-2xl border border-wood-200 text-wood-700 px-6 py-3 hover:bg-wood-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitBlog;
