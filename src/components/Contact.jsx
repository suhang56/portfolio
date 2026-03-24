import socialsData from "../data/social.json";
import profile from "../data/profile.json";
import { SocialLink } from "./SocialIcons";
import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="contact section">
      <div className="section-inner section-narrow">
        <h2 className="section-title">Find Me Here</h2>
        <p className="contact-intro">
          Follow along for concert recaps, travel vlogs, and Japan adventures. 🇯🇵
        </p>
        <div className="contact-socials">
          {socialsData.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="contact-social-card">
              <SocialLink social={s} className="contact-social-icon" />
              <span className="contact-social-name">{s.name}</span>
            </a>
          ))}
        </div>
        <p className="contact-email">
          Or email me at <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>
    </section>
  );
}
