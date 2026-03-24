import { useState } from "react";
import { socials } from "../data/social";
import { SocialLink } from "./SocialIcons";
import "./Hero.css";

// To change your avatar: replace public/avatar.jpg with your photo
export default function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-greeting">Hi, I'm</p>
        <h1 className="hero-name">Your Name</h1>
        <h2 className="hero-role">Travel & Concert Enthusiast ✈️ 🎵</h2>
        <p className="hero-desc">
          Chasing music and memories across Japan. Documenting concerts, cities, and everything in between.
        </p>
        <div className="hero-socials">
          {socials.map((s) => (
            <SocialLink key={s.name} social={s} className="hero-social-link" />
          ))}
        </div>
        <div className="hero-actions">
          <a href="/blog" className="btn btn-primary">Read My Blog</a>
          <a href="#about" className="btn btn-outline">About Me</a>
        </div>
      </div>
      <div className="hero-avatar">
        {imgError ? (
          <div className="avatar-fallback">YOU</div>
        ) : (
          <img
            src="/avatar.jpg"
            alt="Avatar"
            className="avatar-img"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    </section>
  );
}
