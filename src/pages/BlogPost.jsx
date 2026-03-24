import { useParams, Link, Navigate } from "react-router-dom";
import { posts } from "../data/posts";
import "./BlogPost.css";

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <main className="blogpost-page">
      <div className="blogpost-inner">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
        <div className="blogpost-meta">
          <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="blogpost-title">{post.title}</h1>
        {post.tags && (
          <div className="blogpost-tags">
            {post.tags.map((tag) => <span key={tag} className="post-tag">{tag}</span>)}
          </div>
        )}
        <div className="blogpost-content">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
            if (line.startsWith("# ")) return <h1 key={i}>{line.slice(2)}</h1>;
            if (line.startsWith("```")) return null;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i}>{line}</p>;
          })}
        </div>
      </div>
    </main>
  );
}
