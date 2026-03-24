import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        John Doe
      </Link>
      <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
      <ul className={`navbar-links ${open ? "open" : ""}`}>
        <li><NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink></li>
        <li><a href="/#about" onClick={() => setOpen(false)}>About</a></li>
        <li><a href="/#projects" onClick={() => setOpen(false)}>Projects</a></li>
        <li><NavLink to="/blog" onClick={() => setOpen(false)}>Blog</NavLink></li>
        <li><a href="/#contact" onClick={() => setOpen(false)}>Contact</a></li>
      </ul>
    </nav>
  );
}
