import profile from "../data/profile.json";
import "./About.css";

export default function About() {
  return (
    <section id="about" className="about section">
      <div className="section-inner">
        <h2 className="section-title">About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>{profile.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
