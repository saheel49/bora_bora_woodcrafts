import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

// ─── Blog List Page ───────────────────────────────────────────────────────────
function Blog() {
  const { user }              = useAuth();
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blog/")
      .then((r) => {
        const d = r.data;
        setPosts(Array.isArray(d) ? d : (d.results || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Ensure image URLs are absolute when backend returns a path like "/images/.."
  const normalizeImageUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const backend = api.defaults.baseURL.replace(/\/api\/?$/, "");
    return `${backend}${url}`;
  };

  const LOCAL_BLOG_IMAGES = {
    "art-of-hand-carving": "/images/hand-craving.jpg",
    "sustainable-timber": "/images/suitability.jpg",
    "care-for-wooden-kitchenware": "/images/protect-wooden-kitchenware.jpg",
  };

  const getBlogImageUrl = (post) => {
    if (post.image_url) return normalizeImageUrl(post.image_url);
    return LOCAL_BLOG_IMAGES[post.slug] || "/images/hand-crafted-wood-art.jpg";
  };

  // My posts: any post where author_id matches logged-in user
  const myPosts    = user ? posts.filter((p) => p.author_id === user.id) : [];
  // Others' posts: published only, not mine
  const otherPosts = posts.filter(
    (p) => p.is_published && (!user || p.author_id !== user.id)
  );

  const renderCard = (post) => (
    <article key={post.id}
      className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group flex flex-col relative">

      {/* Draft banner */}
      {!post.is_published && (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          ⏳ Draft — Awaiting Approval
        </div>
      )}

      {/* Cover image */}
          <Link to={`/blog/${post.slug}`} className="block overflow-hidden bg-wood-50 dark:bg-dark-surface">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={getBlogImageUrl(post)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-forest dark:text-forest-light uppercase tracking-wide">
            {post.category}
          </span>
          <time className="text-xs text-wood-400 dark:text-dark-muted" dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString("en-KE", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </time>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h2 className={`font-bold mb-2 leading-snug hover:text-wood-500 transition ${
            post.is_published ? "text-wood-700 dark:text-white" : "text-wood-500 dark:text-white/60"
          }`}>
            {post.title}
          </h2>
        </Link>

        <p className="text-wood-500 dark:text-dark-muted text-sm mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-wood-100 dark:border-dark-border">
          <span className="text-xs text-wood-400 dark:text-dark-muted">By {post.author_name}</span>
          <div className="flex items-center gap-2">
            {post.read_time && (
              <span className="text-xs text-wood-400 dark:text-dark-muted">{post.read_time}</span>
            )}
            {/* Only show "Read" for published posts */}
            {post.is_published && (
              <Link to={`/blog/${post.slug}`}
                className="text-xs font-medium text-wood-600 dark:text-wood-300 hover:text-wood-800 dark:hover:text-wood-200 transition">
                Read →
              </Link>
            )}
            {/* Draft: link to preview only if it's the author's own post */}
            {!post.is_published && user && post.author_id === user.id && (
              <Link to={`/blog/${post.slug}`}
                className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline transition">
                Preview →
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-wood-700 dark:text-white mb-2">The Woodcraft Journal</h1>
        <p className="text-wood-500 dark:text-dark-muted">Tips, stories, and inspiration from our workshop.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-white/5 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ── My Posts (visible only when logged in and have posts) ──────── */}
          {user && myPosts.length > 0 && (
            <section className="mb-12" aria-labelledby="my-posts-heading">
              <div className="flex items-center justify-between mb-5">
                <h2 id="my-posts-heading" className="text-xl font-bold text-wood-700 dark:text-white">
                  My Posts
                  <span className="ml-2 text-sm font-normal text-wood-400 dark:text-white/40">({myPosts.length})</span>
                </h2>
                <Link to="/account"
                  className="text-xs text-wood-500 dark:text-white/40 hover:text-wood-700 dark:hover:text-white underline transition">
                  Manage in Account →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPosts.map(renderCard)}
              </div>
            </section>
          )}

          {/* ── Published Posts from Others ───────────────────────────────── */}
          <section aria-labelledby="all-posts-heading">
            {user && myPosts.length > 0 && (
              <h2 id="all-posts-heading" className="text-xl font-bold text-wood-700 dark:text-white mb-5">
                From the Community
                <span className="ml-2 text-sm font-normal text-wood-400 dark:text-white/40">({otherPosts.length})</span>
              </h2>
            )}
            {otherPosts.length === 0 && myPosts.length === 0 && (
              <p className="text-wood-400 dark:text-white/40 text-center py-16">No blog posts published yet.</p>
            )}
            {otherPosts.length === 0 && myPosts.length > 0 && (
              <p className="text-wood-400 dark:text-white/40 text-sm">No other posts from the community yet.</p>
            )}
            {otherPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map(renderCard)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Blog;
