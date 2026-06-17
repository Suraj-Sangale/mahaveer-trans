"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { SITE_DATA } from "./data";

// ─── MahaveerTrans — Modern Logistics ─────────────────────────────────────────────────────────────
// Auto-converted from: landingPage.html
// by scripts/html-to-nextjs.js
//
// HOW TO COMPLETE THIS FILE:
// 1. Check the TODO comments — they mark elements that need dynamic data from SITE_DATA.
// 2. Replace empty JSX elements with data props (e.g., {d.hero.title}).
// 3. Remove or replace any {/* TODO: onclick */} with proper React event handlers.
// 4. Review the data.ts file and update SITE_DATA with your real content.

export default function LandingpagePage() {
  const d = SITE_DATA;
  
  // ── Theme (dark / light) ──────────────────────────────────────────
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = localStorage.getItem("vf-theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vf-theme", theme);
  }, [theme]);
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  // ── Mobile drawer ─────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => { setDrawerOpen(true); document.body.style.overflow = "hidden"; };
  const closeDrawer = () => { setDrawerOpen(false); document.body.style.overflow = ""; };

  // ── Font panel ────────────────────────────────────────────────────
  const [fontPanelOpen, setFontPanelOpen] = useState(false);
  const [displayFont, setDisplayFont] = useState("Cormorant Garamond");
  const [bodyFont, setBodyFont] = useState("Plus Jakarta Sans");
  useEffect(() => {
    document.documentElement.style.setProperty("--font-display", `'${displayFont}', serif`);
  }, [displayFont]);
  useEffect(() => {
    document.documentElement.style.setProperty("--font-body", `'${bodyFont}', sans-serif`);
  }, [bodyFont]);

  // ── Accent color picker ───────────────────────────────────────────
  const [accentColor, setAccentColor] = useState("#0ea5e9");
  useEffect(() => {
    const shade = (hex: string, pct: number) => {
      const n = parseInt(hex.slice(1), 16);
      const clamp = (v: number) => Math.min(255, Math.max(0, v));
      const r = clamp(((n >> 16) & 0xff) + pct);
      const g = clamp(((n >> 8) & 0xff) + pct);
      const b = clamp((n & 0xff) + pct);
      return "#" + (r << 16 | g << 8 | b).toString(16).padStart(6, "0");
    };
    const r = document.documentElement;
    r.style.setProperty("--accent", accentColor);
    r.style.setProperty("--accent-dk", shade(accentColor, -15));
  }, [accentColor]);

  // ── Navbar scroll shadow ──────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Scroll-reveal animations ──────────────────────────────────────
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal,.svc-card,.pstep,.tc").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Tracking / search form ────────────────────────────────────────
  const [trackValue, setTrackValue] = useState("");
  const [trackState, setTrackState] = useState<"idle" | "found" | "error">("idle");
  const handleTrack = () => {
    if (trackValue.trim()) {
      setTrackState("found");
      setTimeout(() => setTrackState("idle"), 2500);
    } else {
      setTrackState("error");
      setTimeout(() => setTrackState("idle"), 2000);
    }
  };
  
  /*
   * TODO: The following element IDs had empty inner content in the HTML.
   * They were originally filled via JS DOM manipulation.
   * Replace the content with data from SITE_DATA:
   *   mobileOverlay
   *   drawerLogoText
   *   drawerLinks
   *   themeToggleMobile
   *   drawerCta
   *   navBrand
   *   navLinks
   *   navLogin
   *   navCta
   *   hero-pill-text
   *   heroTitle
   *   heroDesc
   *   heroCta1
   *   heroCta2
   *   trustAvatars
   *   trustCount
   *   trustLabel
   *   hfStatLabel
   *   hfStatSub
   *   hfBadge
   *   hfOtLabel
   *   hfOtSub
   *   ticker
   *   clientsLabel
   *   clientLogos
   *   svcSectionTag
   *   svcHeading
   *   svcGrid
   *   numbers
   *   aboutTagStrip
   *   aboutRating
   *   aboutRatingTxt
   *   aboutSectionTag
   *   aboutTitle
   *   aboutP1
   *   aboutP2
   *   aboutFeats
   *   aboutCta
   *   procSectionTag
   *   procHeading
   *   procSteps
   *   fleetSectionTag
   *   fleetHeading
   *   fleetCta
   *   galGrid
   *   trackSectionTag
   *   trackHeading
   *   trackDesc
   *   trackBtn
   *   trackHints
   *   tcId
   *   tcStatus
   *   tcFrom
   *   tcFromCode
   *   tcTo
   *   tcToCode
   *   tcTimeline
   *   testSectionTag
   *   testHeading
   *   testGrid
   *   ctaSectionTag
   *   ctaTitle
   *   ctaDesc
   *   ctaCta1
   *   ctaPhone
   *   footerLogo
   *   footerTagline
   *   footerSocials
   *   footerCopy
   *   footerLegal
   *   fabBtn
   */

  return (
    <>
      {/* FONT PANEL */}
        <div className="font-panel" id="fontPanel">
          <div className="fp-header">
            <div className="fp-title" id="fpTitle">🎨 Design Settings</div>
            <button className="fp-close" id="fpClose">✕</button>
          </div>
          <div className="fp-body">
            <div className="fp-section">
              <div className="fp-section-label" id="fpColorLabel">Accent Color</div>
              <div className="fp-colors" id="colorPicker">
                <div className="fp-color active" data-color="#0ea5e9" data-shadow="rgba(14,165,233,0.25)"
                  style={{ background: "#0ea5e9" }} title="Sky Blue"></div>
                <div className="fp-color" data-color="#6366f1" data-shadow="rgba(99,102,241,0.25)" style={{ background: "#6366f1" }}
                  title="Indigo"></div>
                <div className="fp-color" data-color="#f97316" data-shadow="rgba(249,115,22,0.25)" style={{ background: "#f97316" }}
                  title="Orange"></div>
                <div className="fp-color" data-color="#10b981" data-shadow="rgba(16,185,129,0.25)" style={{ background: "#10b981" }}
                  title="Emerald"></div>
                <div className="fp-color" data-color="#ec4899" data-shadow="rgba(236,72,153,0.25)" style={{ background: "#ec4899" }}
                  title="Pink"></div>
                <div className="fp-color" data-color="#8b5cf6" data-shadow="rgba(139,92,246,0.25)" style={{ background: "#8b5cf6" }}
                  title="Violet"></div>
                <div className="fp-color" data-color="#ef4444" data-shadow="rgba(239,68,68,0.25)" style={{ background: "#ef4444" }}
                  title="Red"></div>
                <div className="fp-color" data-color="#14b8a6" data-shadow="rgba(20,184,166,0.25)" style={{ background: "#14b8a6" }}
                  title="Teal"></div>
              </div>
            </div>
            <div className="fp-section">
              <div className="fp-section-label" id="fpDisplayLabel">Display / Heading Font</div>
              <div id="displayFonts">
                <div className="fp-font-opt active" data-role="display" data-font="Syne">
                  <div className="fopt-name">Syne</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Syne',sans-serif", fontWeight: "800" }}>Global Logistics</div>
                  <div className="fopt-hint">💡 Great for tech brands — geometric, bold, very modern. Best paired with a humanist
                    body font like Instrument Sans or Plus Jakarta Sans.</div>
                </div>
                <div className="fp-font-opt" data-role="display" data-font="Playfair Display">
                  <div className="fopt-name">Playfair Display</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Playfair Display',serif", fontWeight: "700" }}>Global Logistics
                  </div>
                  <div className="fopt-hint">💡 Elegant serif — ideal for premium or luxury positioning. Gives a high-end,
                    editorial feel. Pairs well with Outfit or Nunito body fonts.</div>
                </div>
                <div className="fp-font-opt" data-role="display" data-font="Outfit">
                  <div className="fopt-name">Outfit</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: "700" }}>Global Logistics</div>
                  <div className="fopt-hint">💡 Clean, rounded, approachable. Perfect for SaaS or startup feel. Works great as
                    both display and body — use weight 700+ for headings.</div>
                </div>
                <div className="fp-font-opt" data-role="display" data-font="Josefin Sans">
                  <div className="fopt-name">Josefin Sans</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: "700" }}>Global Logistics
                  </div>
                  <div className="fopt-hint">💡 Narrow, art-deco inspired — very distinctive and stylish. Great for
                    logistics/industrial brands. Best with a neutral body font for contrast.</div>
                </div>
                <div className="fp-font-opt" data-role="display" data-font="Cormorant Garamond">
                  <div className="fopt-name">Cormorant Garamond</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: "700" }}>Global Logistics
                  </div>
                  <div className="fopt-hint">💡 Classic Roman serif — ultra-refined, almost fashion-magazine feel. Use large sizes
                    only (48px+). Best paired with a clean sans body like Space Grotesk.</div>
                </div>
                <div className="fp-font-opt" data-role="display" data-font="Space Grotesk">
                  <div className="fopt-name">Space Grotesk</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: "700" }}>Global Logistics
                  </div>
                  <div className="fopt-hint">💡 Techy, slightly quirky grotesque — loved in fintech and logistics apps. Maintains
                    readability at all sizes. Pairs naturally with Plus Jakarta Sans.</div>
                </div>
              </div>
            </div>
            <div className="fp-section">
              <div className="fp-section-label" id="fpBodyLabel">Body / UI Font</div>
              <div id="bodyFonts">
                <div className="fp-font-opt active" data-role="body" data-font="Instrument Sans">
                  <div className="fopt-name">Instrument Sans</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: ".95rem" }}>Fast, reliable,
                    global delivery solutions for every business.</div>
                  <div className="fopt-hint">💡 Humanist, warm, readable — excellent for body copy. Feels friendly yet
                    professional. Works at any size from 12px upward.</div>
                </div>
                <div className="fp-font-opt" data-role="body" data-font="Plus Jakarta Sans">
                  <div className="fopt-name">Plus Jakarta Sans</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: ".95rem" }}>Fast,
                    reliable, global delivery solutions for every business.</div>
                  <div className="fopt-hint">💡 Balanced, modern, slightly formal — a very safe UI font. Popular in dashboards and
                    B2B SaaS. Excellent legibility on screens.</div>
                </div>
                <div className="fp-font-opt" data-role="body" data-font="Outfit">
                  <div className="fopt-name">Outfit</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Outfit',sans-serif", fontSize: ".95rem" }}>Fast, reliable, global
                    delivery solutions for every business.</div>
                  <div className="fopt-hint">💡 Very smooth, even rhythm. Good for younger/consumer brands. Can serve as both
                    display and body for a unified look.</div>
                </div>
                <div className="fp-font-opt" data-role="body" data-font="Nunito">
                  <div className="fopt-name">Nunito</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Nunito',sans-serif", fontSize: ".95rem" }}>Fast, reliable, global
                    delivery solutions for every business.</div>
                  <div className="fopt-hint">💡 Rounded, friendly — best for consumer-facing products or brands emphasising care
                    and trust. Slightly informal; avoid in very corporate contexts.</div>
                </div>
                <div className="fp-font-opt" data-role="body" data-font="Space Grotesk">
                  <div className="fopt-name">Space Grotesk</div>
                  <div className="fopt-preview" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: ".95rem" }}>Fast, reliable,
                    global delivery solutions for every business.</div>
                  <div className="fopt-hint">💡 Pairs beautifully with itself as both display and body for a monofont site.
                    Slightly techy character shows through even in small sizes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* MOBILE OVERLAY */}
        {/* TODO: dynamic */}
        
        <div className="mobile-nav-overlay" id="mobileOverlay" ></div>
      
        {/* MOBILE DRAWER */}
        <div className="mobile-drawer" id="mobileDrawer">
          <div className="drawer-header">
            {/* TODO: dynamic */}
            <div className="drawer-logo" id="drawerLogoText" ></div>
            <button className="drawer-close" id="drawerClose">✕</button>
          </div>
          {/* TODO: dynamic */}
          <div className="drawer-links" id="drawerLinks" ></div>
          <div className="drawer-actions">
            <div className="drawer-settings">
              <span className="drawer-settings-lbl" id="drawerThemeLabel">☀️ / 🌙 Theme</span>
              <div className="drawer-theme-row">
                {/* TODO: dynamic */}
                <button className="theme-toggle" id="themeToggleMobile" ></button>
              </div>
            </div>
            <button className="drawer-font-btn" id="fontToggleBtnMobile">
              <span>Aa</span> <span id="drawerFontBtnText">Fonts & Accent Color</span>
            </button>
            {/* TODO: dynamic */}
            <button className="btn-cta" style={{ width: "100%", padding: ".75rem", justifyContent: "center", display: "flex" }}
              id="drawerCta" ></button>
          </div>
        </div>
      
        {/* NAV */}
        <nav id="navbar">
          <div className="nav-logo" id="navLogo">
            {/* TODO: dynamic */}
            <span id="navBrand" ></span>
            <div className="dot"></div>
          </div>
          {/* TODO: dynamic */}
          <div className="nav-links" id="navLinks" ></div>
          <div className="nav-right">
            <button className="font-btn" id="fontToggleBtn">
              <span className="font-btn-icon">Aa</span> <span id="fontBtnText">Fonts & Style</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: ".55rem" }}>
              <span className="theme-icon">☀️</span>
              {/* TODO: dynamic */}
              <button className="theme-toggle" id="themeToggle"  title="Toggle dark/light mode"></button>
              <span className="theme-icon">🌙</span>
            </div>
            {/* TODO: dynamic */}
            <button className="btn-ghost" id="navLogin" ></button>
            {/* TODO: dynamic */}
            <a href="/quote" className="btn-cta" id="navCta" ></a>
            <button className="hamburger" id="hamburger" aria-label="Open menu">
              <span className="ham-line"></span>
              <span className="ham-line"></span>
              <span className="ham-line"></span>
            </button>
          </div>
        </nav>
      
        {/* HERO */}
        <section id="hero">
          <div className="hero-grid-bg"></div>
          <div className="hero-glow"></div>
          <div className="hero-left">
            {/* TODO: dynamic */}
            <div className="hero-pill"><span className="live-dot"></span> <span id="hero-pill-text" ></span></div>
            {/* TODO: dynamic */}
            <h1 className="hero-h1" id="heroTitle" ></h1>
            {/* TODO: dynamic */}
            <p className="hero-desc" id="heroDesc" ></p>
              <div className="hero-actions">
                {/* TODO: dynamic */}
                <button className="btn-primary" id="heroCta1" ></button>
                {/* TODO: dynamic */}
                <button className="btn-outline" id="heroCta2" ></button>
              </div>
              <div className="hero-trust">
                {/* TODO: dynamic */}
                <div className="trust-avs" id="trustAvatars" ></div>
                {/* TODO: dynamic */}
                {/* TODO: dynamic */}
                <div className="trust-txt"><strong id="trustCount" ></strong> <span id="trustLabel" ></span></div>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-img-wrap">
                <img className="hero-main-img" id="heroImg" src="" alt="Operations" />
                <div className="hfloat hf1">
                  {/* TODO: dynamic */}
                  <div className="hf-tag" id="hfStatLabel" ></div>
                  <div className="hf-val" id="hfCount">0</div>
                  {/* TODO: dynamic */}
                  <div className="hf-sub" id="hfStatSub" ></div>
                  {/* TODO: dynamic */}
                  <div className="hf-badge" id="hfBadge" ></div>
                  <div className="hf-bar-wrap">
                    {/* TODO: dynamic */}
                    <div className="hf-tag" id="hfCapLabel"  style={{ marginTop: ".55rem" }}></div>
                    <div className="hf-bar">
                      <div className="hf-fill"></div>
                    </div>
                  </div>
                </div>
                <div className="hfloat hf2">
                  {/* TODO: dynamic */}
                  <div className="hf-tag" id="hfOtLabel" ></div>
                  <div className="hf-val" id="hfPct">0%</div>
                  {/* TODO: dynamic */}
                  <div className="hf-sub" id="hfOtSub" ></div>
                </div>
              </div>
            </div>
        </section>
      
        {/* TICKER */}
        <div className="ticker-wrap">
          {/* TODO: dynamic */}
          <div className="ticker" id="ticker" ></div>
        </div>
      
        {/* CLIENTS */}
        <div id="clients">
          <div className="clients-inner">
            {/* TODO: dynamic */}
            <span className="clients-lbl" id="clientsLabel" ></span>
            {/* TODO: dynamic */}
            <div className="clients-logos" id="clientLogos" ></div>
          </div>
        </div>
      
        {/* SERVICES */}
        <section id="services">
          <div className="svc-top reveal">
            <div>
              {/* TODO: dynamic */}
              <div className="sec-tag" id="svcSectionTag" ></div>
              {/* TODO: dynamic */}
              <h2 className="sec-h" id="svcHeading" ></h2>
              {/* TODO: dynamic */}
              <p className="svc-top-desc" id="svcDesc"  style={{ marginTop: "0.8rem", maxWidth: "500px" }}></p>
            </div>
            <a href="/services" className="btn-outline">All Services →</a>
          </div>
          {/* TODO: dynamic */}
          <div className="svc-grid" id="svcGrid" ></div>
        </section>
      
        {/* NUMBERS */}
        {/* TODO: dynamic */}
        <div id="numbers" ></div>
      
        {/* ABOUT */}
        <section id="about">
          <div className="about-img-col">
            {/* TODO: dynamic */}
            <div className="about-tag-strip" id="aboutTagStrip" ></div>
            <img className="about-main-img" id="aboutImg" src="" alt="About" />
            <div className="about-badge">
              {/* TODO: dynamic */}
              <div className="ab-num" id="aboutRating" ></div>
              {/* TODO: dynamic */}
              <div className="ab-txt" id="aboutRatingTxt" ></div>
            </div>
          </div>
          <div className="about-content">
            {/* TODO: dynamic */}
            <div className="sec-tag reveal" id="aboutSectionTag" ></div>
            {/* TODO: dynamic */}
            <h2 className="sec-h reveal" style={{ transitionDelay: ".1s" }} id="aboutTitle" ></h2>
            {/* TODO: dynamic */}
            <p className="desc reveal" style={{ transitionDelay: ".2s" }} id="aboutP1" ></p>
            {/* TODO: dynamic */}
            <p className="desc reveal" style={{ transitionDelay: ".25s" }} id="aboutP2" ></p>
            {/* TODO: dynamic */}
            <div className="about-feats reveal" style={{ transitionDelay: ".3s" }} id="aboutFeats" ></div>
            <div className="reveal" style={{ transitionDelay: ".35s" }}>
              {/* TODO: dynamic */}
              <a href="/about" className="btn-primary" id="aboutCta" ></a>
            </div>
          </div>
        </section>
      
        {/* PROCESS */}
        <section id="process">
          <div className="proc-head reveal">
            {/* TODO: dynamic */}
            <div className="sec-tag" id="procSectionTag" ></div>
            {/* TODO: dynamic */}
            <h2 className="sec-h" id="procHeading" ></h2>
          </div>
          {/* TODO: dynamic */}
          <div className="proc-steps" id="procSteps" ></div>
        </section>
      
        {/* FLEET */}
        <section id="fleet">
          <div className="fleet-head reveal">
            <div>
              {/* TODO: dynamic */}
              <div className="sec-tag" id="fleetSectionTag" ></div>
              {/* TODO: dynamic */}
              <h2 className="sec-h" id="fleetHeading" ></h2>
            </div>
            {/* TODO: dynamic */}
            <button className="btn-outline" id="fleetCta" ></button>
          </div>
          {/* TODO: dynamic */}
          <div className="gal-grid" id="galGrid" ></div>
        </section>
      
        {/* TRACKING */}
        <section id="tracking">
          <div className="track-grid">
            <div className="track-left reveal">
              {/* TODO: dynamic */}
              <div className="sec-tag" id="trackSectionTag" ></div>
              {/* TODO: dynamic */}
              <h2 className="sec-h" id="trackHeading" ></h2>
              {/* TODO: dynamic */}
              <p id="trackDesc" ></p>
              <div className="track-form">
                <div className="t-input-row">
                  <input className="t-input" id="trackInput" type="text" />
                  {/* TODO: dynamic */}
                  <button className="t-btn" id="trackBtn" ></button>
                </div>
                {/* TODO: dynamic */}
                <div className="t-hints" id="trackHints" ></div>
              </div>
            </div>
            <div className="track-right reveal" style={{ transitionDelay: ".2s" }}>
              <div className="tc-hdr">
                {/* TODO: dynamic */}
                <div className="tc-id" id="tcId" ></div>
                {/* TODO: dynamic */}
                <div className="tc-status" id="tcStatus" ></div>
              </div>
              <div className="tc-route">
                <div className="tc-city">
                  {/* TODO: dynamic */}
                  <div className="tc-city-name" id="tcFrom" ></div>
                  {/* TODO: dynamic */}
                  <div className="tc-city-code" id="tcFromCode" ></div>
                </div>
                <div className="tc-arrow">→</div>
                <div className="tc-city" style={{ textAlign: "right" }}>
                  {/* TODO: dynamic */}
                  <div className="tc-city-name" id="tcTo" ></div>
                  {/* TODO: dynamic */}
                  <div className="tc-city-code" id="tcToCode" ></div>
                </div>
              </div>
              {/* TODO: dynamic */}
              <div className="tc-tl" id="tcTimeline" ></div>
            </div>
          </div>
        </section>
      
        {/* TESTIMONIALS */}
        <section id="testimonials">
          <div className="test-head reveal">
            {/* TODO: dynamic */}
            <div className="sec-tag" id="testSectionTag" ></div>
            {/* TODO: dynamic */}
            <h2 className="sec-h" id="testHeading" ></h2>
          </div>
          {/* TODO: dynamic */}
          <div className="test-grid" id="testGrid" ></div>
        </section>
      
        {/* CTA */}
        <section id="cta">
          <div className="cta-inner reveal">
            {/* TODO: dynamic */}
            <div className="sec-tag" id="ctaSectionTag" ></div>
            {/* TODO: dynamic */}
            <h2 className="sec-h" id="ctaTitle" ></h2>
            {/* TODO: dynamic */}
            <p id="ctaDesc" ></p>
            <div className="cta-btns">
              {/* TODO: dynamic */}
              <button className="btn-w" id="ctaCta1" ></button>
              {/* TODO: dynamic */}
              <button className="btn-wg" id="ctaPhone" ></button>
            </div>
          </div>
        </section>
      
        {/* FOOTER */}
        <footer>
          <div className="f-top" id="footerTop">
            <div className="f-brand">
              {/* TODO: dynamic */}
              <span className="f-brand-logo" id="footerLogo" ></span>
              {/* TODO: dynamic */}
              <p id="footerTagline" ></p>
              {/* TODO: dynamic */}
              <div className="f-socs" id="footerSocials" ></div>
            </div>
          </div>
          <div className="f-bottom">
            {/* TODO: dynamic */}
            <p id="footerCopy" ></p>
            {/* TODO: dynamic */}
            <p id="footerLegal" ></p>
          </div>
        </footer>
      
      {/* TODO: dynamic */}
        <button className="fab" id="fabBtn" ></button>
    </>
  );
}
