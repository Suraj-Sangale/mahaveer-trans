"use client";
import { useEffect, useState } from "react";
import { DATA } from "@/constants/data";
import useIsMobile from "@/hooks/useIsMobile";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("mt-theme", next);
  }

  function openDrawer() {
    setDrawerOpen(!drawerOpen);
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    setDrawerOpen(false);
    document.body.style.overflow = "";
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo">
          <span>{DATA.nav.logoPrefix}</span>
          {DATA.nav.logoSuffix}
          <div className="dot" />
        </div>
        <div className="nav-links">
          {DATA.nav.links.map((l) => (
            <a key={l.label} href={l.href} className={l.active ? "active" : ""}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <div style={{ display: "flex", alignItems: "center", gap: ".55rem" }}>
            <span className="theme-icon">☀️</span>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            />
            <span className="theme-icon">🌙</span>
          </div>
          <button className="btn-ghost">{DATA.nav.loginBtn}</button>
          <button className="btn-cta-nav">{DATA.nav.quoteBtn}</button>
          <button
            className={`hamburger${drawerOpen ? " open" : ""}`}
            onClick={openDrawer}
            aria-label="Open menu"
          >
            <span className="ham-line" />
            <span className="ham-line" />
            <span className="ham-line" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobile && (
        <>
          <div
            className={`mob-overlay ${drawerOpen ? " open" : ""}`}
            onClick={closeDrawer}
          />
          <div className={`mob-drawer${drawerOpen ? " open" : ""}`}>
            <div className="dr-header">
              <div className="dr-logo">
                {DATA.nav.logoPrefix}
                {DATA.nav.logoSuffix}
              </div>
              <button className="dr-close" onClick={closeDrawer}>
                ✕
              </button>
            </div>
            <div className="dr-links">
              {DATA.nav.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className={l.active ? "active" : ""}
                  onClick={closeDrawer}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="dr-foot">
              <div className="dr-theme-row">
                <span className="dr-theme-lbl">{DATA.nav.themeLabel}</span>
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                />
              </div>
              <button className="dr-cta-btn">{DATA.nav.drawerCta}</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
