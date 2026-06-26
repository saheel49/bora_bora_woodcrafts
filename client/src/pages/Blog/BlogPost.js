import React from "react";
import { useParams, Link } from "react-router-dom";
import blogPosts from "../../data/blogPosts";

// ─── Blog Post Detail Page ────────────────────────────────────────────────────
function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">📄</p>
        <h2 className="text-2xl font-bold text-wood-700 dark:text-dark-text mb-2">Post not found</h2>
        <Link to="/blog" className="text-wood-600 underline">← Back to Blog</Link>
      </div>
    );
  }

  // Render simple markdown-style content:
  // ## Heading  →  <h2>
  // **bold**     →  <strong>
  // - item       →  <li>
  // blank line   →  paragraph break
  const renderContent = (text) => {
    return text.split("\n\n").map((block, i) => {
      // H2 heading
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-bold text-wood-700 dark:text-dark-text mt-8 mb-3">
            {block.replace("## ", "")}
          </h2>
        );
      }
      // H3 heading
      if (block.startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-semibold text-wood-700 dark:text-dark-text mt-6 mb-2">
            {block.replace("### ", "")}
          </h3>
        );
      }
      // Bullet list
      if (block.includes("\n- ") || block.startsWith("- ")) {
        const items = block.split("\n").filter((l) => l.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-1 my-3 text-wood-500 dark:text-dark-muted">
            {items.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: formatInline(item.replace("- ", "")) }} />
            ))}
          </ul>
        );
      }
      // Regular paragraph
      return (
        <p key={i} className="text-wood-500 dark:text-dark-muted leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: formatInline(block) }}
        />
      );
    });
  };

  // Bold: **text** → <strong>text</strong>
  // Italic: *text* → <em>text</em>
  const formatInline = (text) =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong class='text-wood-700 dark:text-dark-text font-semibold'>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Related posts (same category, exclude current)
  const related = blogPosts.filter((p) => p.category === post.category && p.slug !== post.slug);

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">

      {/* Back link */}
      <Link
        to="/blog"
        className="text-sm text-wood-500 dark:text-dark-muted hover:text-wood-700 dark:hover:text-dark-text transition flex items-center gap-1 mb-6"
      >
        ← Back to Blog
      </Link>

      {/* Category + read time */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-forest dark:text-forest-light uppercase tracking-wide">
          {post.category}
        </span>
        <span className="text-xs text-wood-400 dark:text-dark-muted">·</span>
        <span className="text-xs text-wood-400 dark:text-dark-muted">{post.readTime}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-wood-700 dark:text-dark-text leading-tight mb-4">
        {post.title}
      </h1>

      {/* Author + date */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-wood-100 dark:border-dark-border">
        <div className="w-9 h-9 rounded-full bg-wood-300 flex items-center justify-center text-wood-800 font-bold text-sm">
          {post.author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-wood-700 dark:text-dark-text">{post.author}</p>
          <time className="text-xs text-wood-400 dark:text-dark-muted" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-KE", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </time>
        </div>
      </div>

      {/* Cover image */}
      <div className="rounded-xl overflow-hidden mb-8 aspect-[16/7] bg-wood-50 dark:bg-dark-surface">
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="prose-content">
        {renderContent(post.content)}
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-14 pt-8 border-t border-wood-100 dark:border-dark-border">
          <h2 className="text-xl font-bold text-wood-700 dark:text-dark-text mb-5">More in {post.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/blog/${r.slug}`}
                className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className="h-36 overflow-hidden bg-wood-50 dark:bg-dark-surface">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-forest dark:text-forest-light font-medium uppercase mb-1">{r.category}</p>
                  <h3 className="font-semibold text-wood-700 dark:text-dark-text text-sm leading-snug">{r.title}</h3>
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
