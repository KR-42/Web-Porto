"use client";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { ThemeToggle } from "./theme-toggle";
const links = ["Home", "About", "Expertise", "Experience", "Projects", "Education", "Contact"];
export function Navbar() {
  const [open, setOpen] = useState(false); const [active, setActive] = useState("Home");
  useEffect(() => { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id === "home" ? "Home" : entry.target.id[0].toUpperCase() + entry.target.id.slice(1)); }), { rootMargin: "-35% 0px -55%" }); links.forEach((link) => { const element = document.getElementById(link.toLowerCase()); if (element) observer.observe(element); }); return () => observer.disconnect(); }, []);
  return <header className="navbar"><a className="brand" href="#home" aria-label={`${profile.siteName} home`}><b>{profile.siteName}</b></a><nav className="desktop-nav" aria-label="Primary navigation">{links.map((link) => <a key={link} href={`#${link.toLowerCase()}`} className={active === link ? "active" : ""}>{link}</a>)}</nav><div className="nav-actions"><ThemeToggle /><Link className="nav-cv" href={profile.cvPath} download="Rafly-Athallah-CV-2026.pdf"><Download /> CV</Link><button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button></div>{open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{links.map((link) => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)}>{link}</a>)}</nav>}</header>;
}
