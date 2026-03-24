import { useState, useEffect } from "react";
import "./Admin.css";

const REPO = "suhang56/portfolio";
const API = "https://api.github.com";

// ── GitHub helpers ──────────────────────────────────────────────────────────

async function ghGet(token, path) {
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) throw new Error(`Cannot read ${path} (${res.status})`);
  const data = await res.json();
  const text = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
  return { content: JSON.parse(text), sha: data.sha };
}

async function ghPut(token, path, content, sha, message) {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({ message, content: encoded, sha }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `Failed to save ${path}`);
  }
  return res.json();
}

function slugify(title) {
  return title.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

// ── Admin App ───────────────────────────────────────────────────────────────

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("gh_token") || "");
  const [tokenInput, setTokenInput] = useState("");
  const [view, setView] = useState("posts");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data + SHAs
  const [posts, setPosts] = useState([]);
  const [postsSha, setPostsSha] = useState("");
  const [social, setSocial] = useState([]);
  const [socialSha, setSocialSha] = useState("");
  const [profile, setProfile] = useState({});
  const [profileSha, setProfileSha] = useState("");

  // Editing
  const [editingPost, setEditingPost] = useState(null);

  // ── Load data on login ────────────────────────────────────────────────────

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    Promise.all([
      ghGet(token, "src/data/posts.json"),
      ghGet(token, "src/data/social.json"),
      ghGet(token, "src/data/profile.json"),
    ])
      .then(([p, s, pr]) => {
        setPosts(p.content); setPostsSha(p.sha);
        setSocial(s.content); setSocialSha(s.sha);
        setProfile(pr.content); setProfileSha(pr.sha);
      })
      .catch((e) => { setError(e.message); setToken(""); sessionStorage.removeItem("gh_token"); })
      .finally(() => setLoading(false));
  }, [token]);

  function login() {
    if (!tokenInput.trim()) return;
    sessionStorage.setItem("gh_token", tokenInput.trim());
    setToken(tokenInput.trim());
    setTokenInput("");
  }

  function logout() {
    sessionStorage.removeItem("gh_token");
    setToken("");
    setPosts([]); setSocial([]); setProfile({});
  }

  function flash(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  // ── Save helpers ──────────────────────────────────────────────────────────

  async function savePosts(newPosts) {
    setSaving(true); setError("");
    try {
      const res = await ghPut(token, "src/data/posts.json", newPosts, postsSha, "Update blog posts");
      setPosts(newPosts);
      setPostsSha(res.content.sha);
      flash("Saved! Site will redeploy in ~1 minute.");
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function saveSocial() {
    setSaving(true); setError("");
    try {
      const res = await ghPut(token, "src/data/social.json", social, socialSha, "Update social links");
      setSocialSha(res.content.sha);
      flash("Social links saved!");
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function saveProfile() {
    setSaving(true); setError("");
    try {
      const res = await ghPut(token, "src/data/profile.json", profile, profileSha, "Update profile");
      setProfileSha(res.content.sha);
      flash("Profile saved!");
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!token) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <h1 className="admin-login-title">Admin Panel</h1>
          <p className="admin-login-sub">Enter your GitHub Personal Access Token to continue.</p>
          {error && <p className="admin-error">{error}</p>}
          <input
            className="admin-input"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            autoFocus
          />
          <button className="admin-btn-primary" onClick={login}>Sign In</button>
          <details className="admin-help">
            <summary>How to get a token?</summary>
            <ol>
              <li>Go to GitHub → Settings → Developer settings</li>
              <li>Personal access tokens → Tokens (classic) → Generate new token</li>
              <li>Check the <strong>repo</strong> scope</li>
              <li>Copy the token and paste it above</li>
            </ol>
          </details>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return <div className="admin-loading"><div className="admin-spinner" /><p>Loading your data…</p></div>;
  }

  // ── Main layout ───────────────────────────────────────────────────────────

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">Admin</div>
        <nav className="admin-nav">
          <button className={view === "posts" ? "active" : ""} onClick={() => { setView("posts"); setEditingPost(null); }}>📝 Blog Posts</button>
          <button className={view === "social" ? "active" : ""} onClick={() => setView("social")}>🔗 Social Links</button>
          <button className={view === "profile" ? "active" : ""} onClick={() => setView("profile")}>👤 Profile</button>
        </nav>
        <button className="admin-logout" onClick={logout}>Sign Out</button>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {error && <div className="admin-banner error">⚠ {error}</div>}
        {success && <div className="admin-banner success">✓ {success}</div>}

        {/* ── Posts list ── */}
        {view === "posts" && !editingPost && (
          <PostsList
            posts={posts}
            onNew={() => setEditingPost({ id: Date.now(), slug: "", title: "", date: new Date().toISOString().slice(0,10), readTime: "5 min read", tags: [], excerpt: "", content: "" })}
            onEdit={(p) => setEditingPost({ ...p, tagsStr: (p.tags || []).join(", ") })}
            onDelete={(id) => savePosts(posts.filter(p => p.id !== id))}
            saving={saving}
          />
        )}

        {/* ── Post editor ── */}
        {view === "posts" && editingPost && (
          <PostEditor
            post={editingPost}
            onChange={setEditingPost}
            onSave={() => {
              const updated = { ...editingPost, tags: editingPost.tagsStr ? editingPost.tagsStr.split(",").map(t => t.trim()).filter(Boolean) : [] };
              delete updated.tagsStr;
              if (!updated.slug) updated.slug = slugify(updated.title);
              const exists = posts.find(p => p.id === updated.id);
              const newPosts = exists ? posts.map(p => p.id === updated.id ? updated : p) : [...posts, updated];
              savePosts(newPosts).then(() => setEditingPost(null));
            }}
            onCancel={() => setEditingPost(null)}
            saving={saving}
          />
        )}

        {/* ── Social links ── */}
        {view === "social" && (
          <SocialEditor social={social} onChange={setSocial} onSave={saveSocial} saving={saving} />
        )}

        {/* ── Profile ── */}
        {view === "profile" && (
          <ProfileEditor profile={profile} onChange={setProfile} onSave={saveProfile} saving={saving} />
        )}
      </main>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function PostsList({ posts, onNew, onEdit, onDelete, saving }) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Blog Posts</h2>
        <button className="admin-btn-primary" onClick={onNew}>+ New Post</button>
      </div>
      {sorted.length === 0 && <p className="admin-empty">No posts yet. Create your first one!</p>}
      <div className="admin-posts-list">
        {sorted.map((post) => (
          <div key={post.id} className="admin-post-row">
            <div className="admin-post-info">
              <span className="admin-post-title">{post.title}</span>
              <span className="admin-post-date">{post.date}</span>
            </div>
            <div className="admin-post-actions">
              <button className="admin-btn-sm" onClick={() => onEdit(post)}>Edit</button>
              <button className="admin-btn-sm danger" onClick={() => { if (confirm(`Delete "${post.title}"?`)) onDelete(post.id); }} disabled={saving}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostEditor({ post, onChange, onSave, onCancel, saving }) {
  const set = (key, val) => onChange(p => ({ ...p, [key]: val }));
  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>{post.slug ? "Edit Post" : "New Post"}</h2>
        <button className="admin-btn-outline" onClick={onCancel}>← Back</button>
      </div>
      <div className="admin-form">
        <label>Title
          <input className="admin-input" value={post.title} onChange={e => set("title", e.target.value)} placeholder="My Japan Concert Experience" />
        </label>
        <div className="admin-form-row">
          <label>Date
            <input className="admin-input" type="date" value={post.date} onChange={e => set("date", e.target.value)} />
          </label>
          <label>Read time
            <input className="admin-input" value={post.readTime} onChange={e => set("readTime", e.target.value)} placeholder="5 min read" />
          </label>
        </div>
        <label>Tags <span className="admin-hint">(comma separated)</span>
          <input className="admin-input" value={post.tagsStr ?? (post.tags || []).join(", ")} onChange={e => set("tagsStr", e.target.value)} placeholder="Tokyo, Concert, YOASOBI" />
        </label>
        <label>Excerpt <span className="admin-hint">(shown on blog list)</span>
          <textarea className="admin-textarea" rows={3} value={post.excerpt} onChange={e => set("excerpt", e.target.value)} placeholder="A short summary of your post…" />
        </label>
        <label>Content <span className="admin-hint">(use ## for headings, blank line for paragraph break)</span>
          <textarea className="admin-textarea admin-content-area" rows={18} value={post.content} onChange={e => set("content", e.target.value)} placeholder={"Write your post here…\n\n## Heading\n\nParagraph text."} />
        </label>
        <div className="admin-form-actions">
          <button className="admin-btn-primary" onClick={onSave} disabled={saving || !post.title}>
            {saving ? "Saving…" : "Save Post"}
          </button>
          <button className="admin-btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function SocialEditor({ social, onChange, onSave, saving }) {
  const ICONS = ["x", "instagram", "youtube", "tiktok"];
  const set = (i, key, val) => onChange(s => s.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  const add = () => onChange(s => [...s, { name: "", url: "", icon: "x" }]);
  const remove = (i) => onChange(s => s.filter((_, idx) => idx !== i));

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Social Links</h2>
        <button className="admin-btn-primary" onClick={add}>+ Add Link</button>
      </div>
      <div className="admin-form">
        {social.map((s, i) => (
          <div key={i} className="admin-social-row">
            <select className="admin-select" value={s.icon} onChange={e => set(i, "icon", e.target.value)}>
              {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
            <input className="admin-input" value={s.name} onChange={e => set(i, "name", e.target.value)} placeholder="Display name" />
            <input className="admin-input flex-1" value={s.url} onChange={e => set(i, "url", e.target.value)} placeholder="https://..." />
            <button className="admin-btn-sm danger" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        <div className="admin-form-actions">
          <button className="admin-btn-primary" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save Social Links"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({ profile, onChange, onSave, saving }) {
  const set = (key, val) => onChange(p => ({ ...p, [key]: val }));
  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Profile</h2>
      <div className="admin-form">
        <label>Name
          <input className="admin-input" value={profile.name || ""} onChange={e => set("name", e.target.value)} />
        </label>
        <label>Initials <span className="admin-hint">(shown when no avatar image)</span>
          <input className="admin-input" value={profile.initials || ""} onChange={e => set("initials", e.target.value)} placeholder="YN" maxLength={4} />
        </label>
        <label>Role / Tagline
          <input className="admin-input" value={profile.role || ""} onChange={e => set("role", e.target.value)} placeholder="Travel & Concert Enthusiast" />
        </label>
        <label>Bio
          <textarea className="admin-textarea" rows={4} value={profile.bio || ""} onChange={e => set("bio", e.target.value)} />
        </label>
        <label>Email
          <input className="admin-input" type="email" value={profile.email || ""} onChange={e => set("email", e.target.value)} />
        </label>
        <div className="admin-form-actions">
          <button className="admin-btn-primary" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
