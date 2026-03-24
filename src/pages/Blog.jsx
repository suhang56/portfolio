import { Link } from "react-router-dom";
import { posts } from "../data/posts";
import "./Blog.css";

export default function Blog() {
  return (
    <main className="blog-page">
      <div className="section-inner">
        <h1 className="page-title">Japan Concert Diary 🇯🇵</h1>
        <p className="page-subtitle">Trips, shows, and memories from across Japan.</p>
        <div className="posts-list">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="post-card">
              <div className="post-meta">
                <span className="post-date">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span className="post-read-time">{post.readTime}</span>
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-excerpt">{post.excerpt}</p>
              {post.tags && (
                <div className="post-tags">
                  {post.tags.map((tag) => <span key={tag} className="post-tag">{tag}</span>)}
                </div>
              )}
              <span className="post-link">Read more →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
