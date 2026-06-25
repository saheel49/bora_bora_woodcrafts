import React from "react";
import { Link } from "react-router-dom";
import blogPosts from "../../data/blogPosts";

// ─── Blog List Page ───────────────────────────────────────────────────────────
function Blog() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-wood-700 dark:text-dark-text mb-2">
          The Woodcraft Journal
        </h1>
        <p className="text-wood-500 dark:text-dark-muted">
          Tips, stories, and inspiration from our workshop.
        </p>
      </header>

      {/* Blog grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group flex flex-col"
          >
            {/* Cover image */}
            <Link to={`/blog/${post.slug}`} className="block overflow-hidden bg-wood-50 dark:bg-dark-surface">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              {/* Category + date */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-forest dark:text-forest-light uppercase tracking-wide">
                  {post.category}
                </span>
                <time className="text-xs text-wood-400 dark:text-dark-muted" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-KE", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </time>
              </div>

              <Link to={`/blog/${post.slug}`}>
                <h2 className="font-bold text-wood-700 dark:text-dark-text mb-2 leading-snug hover:text-wood-500 transition">
                  {post.title}
                </h2>
              </Link>

              <p className="text-wood-500 dark:text-dark-muted text-sm mb-4 line-clamp-3 flex-1">
                {post.excerpt}
              </p>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-wood-100 dark:border-dark-border">
                <span className="text-xs text-wood-400 dark:text-dark-muted">By {post.author}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-wood-400 dark:text-dark-muted">{post.readTime}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-medium text-wood-600 dark:text-wood-300 hover:text-wood-800 dark:hover:text-wood-200 transition"
                  >
                    Read →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Blog;
