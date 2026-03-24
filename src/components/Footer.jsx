import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>Designed & built by John Doe · {new Date().getFullYear()}</p>
    </footer>
  );
}
