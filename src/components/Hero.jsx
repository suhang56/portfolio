import { useState } from "react";
import profile from "../data/profile.json";
import socialsData from "../data/social.json";
import { SocialLink } from "./SocialIcons";
import "./Hero.css";

export default function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-greeting">Hi, I'm</p>
        <h1 className="hero-name">{profile.name}</h1>
        <h2 className="hero-role">{profile.role}</h2>
        <p className="hero-desc">{profile.bio}</p>
        <div className="hero-socials">
          {socialsData.map((s) => (
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
          <div className="avatar-fallback">{profile.initials}</div>
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
