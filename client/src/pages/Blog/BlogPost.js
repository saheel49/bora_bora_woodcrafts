import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";

const LOCAL_BLOG_IMAGES = {
  "art-of-hand-carving": "/images/hand-craving.jpg",
  "sustainable-timber": "/images/suitability.jpg",
  "care-for-wooden-kitchenware": "/images/protect-wooden-kitchenware.jpg",
};

const getBlogImageUrl = (post) => {
  const url = post.image_url || LOCAL_BLOG_IMAGES[post.slug] || "/images/hand-crafted-wood-art.jpg";
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const backend = api.defaults.baseURL.replace(/\/api\/?$/, "");
  return `${backend}${url}`;
};

// ─── Blog Post Detail — data from Django API ─────────────────────────────────
function BlogPost() {
  const { slug } = useParams();
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    api.get(`/blog/${slug}/`)
      .then((r) => {
        setPost(r.data);
        // Fetch related: same category
        return api.get("/blog/");
      })
      .then((r) => {
        const all = Array.isArray(r.data) ? r.data : (r.data.results || []);
        setRelated(all.filter((p) => p.slug !== slug).slice(0, 2));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-wood-100 dark:bg-white/10 rounded w-1/3" />
          <div className="h-10 bg-wood-100 dark:bg-white/10 rounded w-3/4" />
          <div className="h-64 bg-wood-100 dark:bg-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">📄</p>
        <h2 className="text-2xl font-bold text-wood-700 dark:text-white mb-2">Post not found</h2>
        <Link to="/blog" className="text-wood-600 underline">← Back to Blog</Link>
      </div>
    );
  }

  // Simple markdown-ish renderer — robust to CRLF and single newlines
  const renderContent = (text) => {
    if (!text) return null;
    // Normalize CRLF to LF and split on one-or-more blank lines
    const normalized = text.replace(/\r\n/g, "\n");
    const blocks = normalized.split(/\n\s*\n/);

    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-bold text-wood-700 dark:text-white mt-8 mb-3">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-semibold text-wood-700 dark:text-white mt-6 mb-2">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      // Detect lists: any line starting with `- `
      const lines = block.split(/\n/);
      const listItems = lines.filter((l) => l.trim().startsWith("- "));
      if (listItems.length > 0) {
        return (
          <ul key={i} className="list-disc list-inside space-y-1 my-3 text-wood-500 dark:text-dark-muted">
            {listItems.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: fmt(item.replace(/^-\s*/, "").trim()) }} />
            ))}
          </ul>
        );
      }

      // Preserve single newlines as <br/> inside paragraphs
      const html = fmt(block).replace(/\n/g, "<br/>");
      return (
        <p key={i} className="text-wood-500 dark:text-dark-muted leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
  };

  const fmt = (t) => t
    .replace(/\*\*(.+?)\*\*/g, "<strong class='text-wood-700 dark:text-white font-semibold'>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/blog" className="text-sm text-wood-500 dark:text-dark-muted hover:text-wood-700 dark:hover:text-white transition flex items-center gap-1 mb-6">
        ← Back to Blog
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-forest dark:text-forest-light uppercase tracking-wide">{post.category}</span>
        {post.read_time && <>
          <span className="text-xs text-wood-400 dark:text-dark-muted">·</span>
          <span className="text-xs text-wood-400 dark:text-dark-muted">{post.read_time}</span>
        </>}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-wood-700 dark:text-white leading-tight mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-wood-100 dark:border-dark-border">
        <div className="w-9 h-9 rounded-full bg-wood-300 flex items-center justify-center text-wood-800 font-bold text-sm">
          {(post.author_name || "A").charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-wood-700 dark:text-white">{post.author_name}</p>
          <time className="text-xs text-wood-400 dark:text-dark-muted" dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
          </time>
        </div>
      </div>

      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-8 aspect-[16/7] bg-wood-50 dark:bg-dark-surface">
          <img src={getBlogImageUrl(post)} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Draft notice */}
      {!post.is_published && (
        <div className="mb-6 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
          ⏳ <strong>This post is a draft.</strong> It is only visible to you. An admin will review and publish it.
        </div>
      )}

      <div>{renderContent(post.content)}</div>

      {related.length > 0 && (
        <section className="mt-14 pt-8 border-t border-wood-100 dark:border-dark-border">
          <h2 className="text-xl font-bold text-wood-700 dark:text-white mb-5">More Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {related.map((r) => (
              <Link key={r.id} to={`/blog/${r.slug}`}
                className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="h-36 overflow-hidden bg-wood-50 dark:bg-dark-surface">
                  <img src={getBlogImageUrl(r)} alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-forest dark:text-forest-light font-medium uppercase mb-1">{r.category}</p>
                  <h3 className="font-semibold text-wood-700 dark:text-white text-sm leading-snug">{r.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export default BlogPost;
