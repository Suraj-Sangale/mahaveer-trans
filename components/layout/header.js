import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/header.module.css";
import { applyCSS } from "../../utilities/utils";

const d = {
  meta: {
    pageTitle: "MahaveerTrans — Modern Logistics",
    fpTitle: "🎨 Design Settings",
    fpColorLabel: "Accent Color",
    fpDisplayLabel: "Display / Heading Font",
    fpBodyLabel: "Body / UI Font",
    themeLabel: "Theme",
    fontBtnText: "Fonts & Style",
    drawerFontBtnText: "Fonts & Accent Color",
    fabIcon: "💬",
  },
  nav: {
    brand: "MahaveerTrans Solutions",
    brandShort: "MahaveerTrans",
    login: "Log in",
    cta: "Get Quote →",
    links: [
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Fleet", href: "/fleet" },
      { label: "Track", href: "#tracking" },
      { label: "Reviews", href: "#testimonials" },
    ],
    drawerLinks: [
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Fleet", href: "#fleet" },
      { label: "Track Shipment", href: "#tracking" },
      { label: "Client Reviews", href: "#testimonials" },
      { label: "Get a Quote", href: "#cta" },
    ],
    drawerCta: "Get Free Quote →",
  },
};

const DISPLAY_FONTS = [
  {
    font: "Cormorant Garamond",
    hint: "💡 Classic Roman serif — ultra-refined, almost fashion-magazine feel.",
  },
  {
    font: "Syne",
    hint: "💡 Great for tech brands — geometric, bold, very modern.",
  },
  {
    font: "Playfair Display",
    hint: "💡 Elegant serif — ideal for premium or luxury positioning.",
  },
  {
    font: "Outfit",
    hint: "💡 Clean, rounded, approachable. Perfect for SaaS or startup feel.",
  },
  {
    font: "Josefin Sans",
    hint: "💡 Narrow, art-deco inspired — very distinctive and stylish.",
  },
  {
    font: "Space Grotesk",
    hint: "💡 Techy, slightly quirky grotesque — loved in fintech and logistics apps.",
  },
];

const BODY_FONTS = [
  {
    font: "Instrument Sans",
    hint: "💡 Humanist, warm, readable — excellent for body copy.",
  },
  {
    font: "Plus Jakarta Sans",
    hint: "💡 Balanced, modern, slightly formal — a very safe UI font.",
  },
  {
    font: "Outfit",
    hint: "💡 Very smooth, even rhythm. Good for younger/consumer brands.",
  },
  {
    font: "Nunito",
    hint: "💡 Rounded, friendly — best for consumer-facing products.",
  },
  {
    font: "Space Grotesk",
    hint: "💡 Pairs beautifully with itself for a monofont site.",
  },
];

const ACCENT_COLORS = [
  { color: "#0ea5e9", shadow: "rgba(14,165,233,0.25)", title: "Sky Blue" },
  { color: "#6366f1", shadow: "rgba(99,102,241,0.25)", title: "Indigo" },
  { color: "#f97316", shadow: "rgba(249,115,22,0.25)", title: "Orange" },
  { color: "#10b981", shadow: "rgba(16,185,129,0.25)", title: "Emerald" },
  { color: "#ec4899", shadow: "rgba(236,72,153,0.25)", title: "Pink" },
  { color: "#8b5cf6", shadow: "rgba(139,92,246,0.25)", title: "Violet" },
  { color: "#ef4444", shadow: "rgba(239,68,68,0.25)", title: "Red" },
  { color: "#14b8a6", shadow: "rgba(20,184,166,0.25)", title: "Teal" },
];

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [fontPanelOpen, setFontPanelOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeAccent, setActiveAccent] = useState(0);
  const [activeDisplayFont, setActiveDisplayFont] = useState(0);
  const [activeBodyFont, setActiveBodyFont] = useState(0);
  const [scrolled, setScrolled] = useState(false); // ← React state, not DOM class

  // ── sync theme + accent + fonts to <html> CSS vars ──────────────────────
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const ac = ACCENT_COLORS[activeAccent];
    document.documentElement.style.setProperty("--accent", ac.color);
    document.documentElement.style.setProperty("--accent-shadow", ac.shadow);
  }, [activeAccent]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-display",
      `'${DISPLAY_FONTS[activeDisplayFont].font}', sans-serif`,
    );
  }, [activeDisplayFont]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-body",
      `'${BODY_FONTS[activeBodyFont].font}', sans-serif`,
    );
  }, [activeBodyFont]);

  // ── scroll listener — drives React state, not DOM class ─────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── lock body scroll when drawer / panel open ────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerOpen || fontPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, fontPanelOpen]);

  const css = (className, mainStyles = styles, style2 = {}) => {
    return applyCSS(className, mainStyles, style2);
  };

  return (
    <>
      <style>{CSS}</style>

      {/* ── FONT PANEL ──────────────────────────────────────── */}
      {fontPanelOpen && (
        <div
          className={css("fp-overlay")}
          onClick={() => setFontPanelOpen(false)}
        />
      )}
      <div
        className={`${css("font-panel")} ${fontPanelOpen ? css("open") : ""}`}
      >
        <div className={css("fp-header")}>
          <div className={css("fp-title")}>{d.meta.fpTitle}</div>
          <button
            className={css("fp-close")}
            onClick={() => setFontPanelOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className={css("fp-body")}>
          {/* Accent colours */}
          <div>
            <div className={css("fp-section-label")}>{d.meta.fpColorLabel}</div>
            <div className={css("fp-colors")}>
              {ACCENT_COLORS.map((ac, i) => (
                <div
                  key={i}
                  className={`${css("fp-color")} ${activeAccent === i ?  css("active") : ""}`}
                  style={{ background: ac.color }}
                  title={ac.title}
                  onClick={() => setActiveAccent(i)}
                />
              ))}
            </div>
          </div>
          {/* Display fonts */}
          <div>
            <div className={css("fp-section-label")}>
              {d.meta.fpDisplayLabel}
            </div>
            {DISPLAY_FONTS.map((f, i) => (
              <div
                key={i}
                className={`${css("fp-font-opt")} ${activeDisplayFont === i ? css("active") : ""}`}
                onClick={() => setActiveDisplayFont(i)}
              >
                <div className={css("fopt-name")}>{f.font}</div>
                <div
                  className={css("fopt-preview")}
                  style={{
                    fontFamily: `'${f.font}', sans-serif`,
                    fontWeight: 800,
                  }}
                >
                  Global Logistics
                </div>
                <div className={css("fopt-hint")}>{f.hint}</div>
              </div>
            ))}
          </div>
          {/* Body fonts */}
          <div>
            <div className={css("fp-section-label")}>{d.meta.fpBodyLabel}</div>
            {BODY_FONTS.map((f, i) => (
              <div
                key={i}
                className={`${css("fp-font-opt")} ${activeBodyFont === i ? css("active") : ""}`}
                onClick={() => setActiveBodyFont(i)}
              >
                <div className={css("fopt-name")}>{f.font}</div>
                <div
                  className={css("fopt-preview")}
                  style={{
                    fontFamily: `'${f.font}', sans-serif`,
                    fontSize: ".9rem",
                    fontWeight: 400,
                  }}
                >
                  Fast, reliable, global delivery solutions for every business.
                </div>
                <div className={css("fopt-hint")}>{f.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE OVERLAY ──────────────────────────────────── */}
      <div
        className={`${css("mobile-overlay")} ${drawerOpen ? css("open") : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── MOBILE DRAWER ───────────────────────────────────── */}
      <div
        className={`${css("mobile-drawer")} ${drawerOpen ? css("open") : ""}`}
      >
        <div className={css("drawer-header")}>
          <div className={css("drawer-logo")}>
            {d.nav.brandShort}
            <span style={{ opacity: 0.45 }}> Solutions</span>
          </div>
          <button
            className={css("drawer-close")}
            onClick={() => setDrawerOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className={css("drawer-links")}>
          {d.nav.drawerLinks.map((l, i) => (
            <a key={i} href={l.href} onClick={() => setDrawerOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>

        <div className={css("drawer-actions")}>
          {/* Theme toggle */}
          <div className={css("drawer-settings")}>
            <span className={css("drawer-settings-lbl")}>
              {theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
            </span>
            <button
              className={`${css("theme-toggle")} ${theme === "dark" ? css("dark") : ""}`}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            />
          </div>
          {/* Font button */}
          <button
            className={css("drawer-font-btn")}
            onClick={() => {
              setFontPanelOpen(true);
              setDrawerOpen(false);
            }}
          >
            <span>Aa</span> <span>{d.meta.drawerFontBtnText}</span>
          </button>
          {/* CTA */}
          <a
            href="#cta"
            className={css("btn-cta")}
            style={{
              width: "100%",
              padding: ".75rem",
              justifyContent: "center",
            }}
            onClick={() => setDrawerOpen(false)}
          >
            {d.nav.drawerCta}
          </a>
        </div>
      </div>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className={`${css("navbar")} ${scrolled ? css("scrolled") : ""}`}>
        {/* Logo */}
        <a href="#" className={css("nav-logo")}>
          <span>{d.nav.brand}</span>
          <div className={css("dot")} />
        </a>

        {/* Desktop links */}
        <div className={css("nav-links")}>
          {d.nav.links.map((l, i) => (
            <a key={i} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div className={css("nav-right")}>
          {/* Font btn — desktop only */}
          <button
            className={css("font-btn")}
            onClick={() => setFontPanelOpen((p) => !p)}
          >
            <span>Aa</span> <span>{d.meta.fontBtnText}</span>
          </button>

          {/* Theme toggle — desktop only */}
          <div className={css("theme-row")}>
            <span className={css("theme-icon")}>☀️</span>
            <button
              className={`${css("theme-toggle")} ${theme === "dark" ? css("dark") : css("light")}`}
              onClick={() =>
                setTheme((t) =>
                  t === "dark" ? css("light") : css("dark"),
                )
              }
              aria-label="Toggle theme"
            />
            <span className={css("theme-icon")}>🌙</span>
          </div>

          {/* Login — desktop only */}
          <button className={css("btn-ghost,desktop-only")}>
            {d.nav.login}
          </button>

          {/* Get Quote — desktop only */}
          <a href="#cta" className={css("btn-cta,desktop-only")}>
            {d.nav.cta}
          </a>

          {/* Hamburger — tablet + mobile */}
          <button
            className={`hamburger ${drawerOpen ? css("open") : ""}`}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span className={css("ham-line")} />
            <span className={css("ham-line")} />
            <span className={css("ham-line")} />
          </button>
        </div>
      </nav>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
`;
