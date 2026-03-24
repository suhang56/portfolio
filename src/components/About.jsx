import "./About.css";

const skills = [
  "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Express", "PostgreSQL", "MongoDB",
  "Git", "Docker", "AWS", "Figma",
];

export default function About() {
  return (
    <section id="about" className="about section">
      <div className="section-inner">
        <h2 className="section-title">About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I'm a full stack developer with a passion for building products that live on the internet. I care deeply about performance, accessibility, and developer experience.
            </p>
            <p>
              When I'm not coding, you'll find me writing about tech on my blog, exploring open source projects, or brewing a good cup of coffee.
            </p>
            <p>
              I'm currently open to new opportunities — feel free to reach out!
            </p>
          </div>
          <div className="about-skills">
            <h3>Skills & Technologies</h3>
            <ul className="skills-list">
              {skills.map((skill) => (
                <li key={skill} className="skill-tag">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
