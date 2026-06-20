import React, { useEffect, useRef, useState } from "react";
const d = {
  meta: {
    pageTitle: "MahaveerTrans — Modern Logistics",
    fpTitle: "🎨 Design Settings",
    fpColorLabel: "Accent Color",
    fpDisplayLabel: "Display / Heading Font",
    fpBodyLabel: "Body / UI Font",
    themeLabel: "☀️ / 🌙 Theme",
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
      { label: "Fleet", href: "#fleet" },
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
/* ─── ACCENT COLORS ─── */
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
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current?.classList.toggle("scrolled", window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* FONT PANEL */}
      <div className={`font-panel ${fontPanelOpen ? "open" : ""}`}>
        <div className="fp-header">
          <div className="fp-title">{d.meta.fpTitle}</div>
          <button className="fp-close" onClick={() => setFontPanelOpen(false)}>
            ✕
          </button>
        </div>
        <div className="fp-body">
          <div>
            <div className="fp-section-label">{d.meta.fpColorLabel}</div>
            <div className="fp-colors">
              {ACCENT_COLORS.map((ac, i) => (
                <div
                  key={i}
                  className={`fp-color ${activeAccent === i ? "active" : ""}`}
                  style={{ background: ac.color }}
                  title={ac.title}
                  onClick={() => setActiveAccent(i)}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="fp-section-label">{d.meta.fpDisplayLabel}</div>
            {DISPLAY_FONTS.map((f, i) => (
              <div
                key={i}
                className={`fp-font-opt ${activeDisplayFont === i ? "active" : ""}`}
                onClick={() => setActiveDisplayFont(i)}
              >
                <div className="fopt-name">{f.font}</div>
                <div
                  className="fopt-preview"
                  style={{
                    fontFamily: `'${f.font}', sans-serif`,
                    fontWeight: 800,
                  }}
                >
                  Global Logistics
                </div>
                <div className="fopt-hint">{f.hint}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="fp-section-label">{d.meta.fpBodyLabel}</div>
            {BODY_FONTS.map((f, i) => (
              <div
                key={i}
                className={`fp-font-opt ${activeBodyFont === i ? "active" : ""}`}
                onClick={() => setActiveBodyFont(i)}
              >
                <div className="fopt-name">{f.font}</div>
                <div
                  className="fopt-preview"
                  style={{
                    fontFamily: `'${f.font}', sans-serif`,
                    fontSize: ".9rem",
                    fontWeight: 400,
                  }}
                >
                  Fast, reliable, global delivery solutions for every business.
                </div>
                <div className="fopt-hint">{f.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`mobile-overlay ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-logo">
            {d.nav.brandShort}
            <span style={{ opacity: 0.45 }}> Solutions</span>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
            ✕
          </button>
        </div>
        <div className="drawer-links">
          {d.nav.drawerLinks.map((l, i) => (
            <a key={i} href={l.href} onClick={() => setDrawerOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="drawer-actions">
          <div className="drawer-settings">
            <span className="drawer-settings-lbl">{d.meta.themeLabel}</span>
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            />
          </div>
          <button
            className="drawer-font-btn"
            onClick={() => {
              setFontPanelOpen(true);
              setDrawerOpen(false);
            }}
          >
            <span>Aa</span> <span>{d.meta.drawerFontBtnText}</span>
          </button>
          <button
            className="btn-cta"
            style={{
              width: "100%",
              padding: ".75rem",
              justifyContent: "center",
              display: "flex",
            }}
          >
            {d.nav.drawerCta}
          </button>
        </div>
      </div>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} ref={headerRef}>
        <a href="#" className="nav-logo">
          <span>{d.nav.brand}</span>
          <div className="dot"></div>
        </a>
        <div className="nav-links">
          {d.nav.links.map((l, i) => (
            <a key={i} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <button
            className="font-btn"
            onClick={() => setFontPanelOpen((p) => !p)}
          >
            <span>Aa</span> <span>{d.meta.fontBtnText}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: ".55rem" }}>
            <span className="theme-icon">☀️</span>
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            />
            <span className="theme-icon">🌙</span>
          </div>
          <button className="btn-ghost">{d.nav.login}</button>
          {/* <a href="#cta" className="btn-cta">
            {d.nav.cta}
          </a> */}
          <button
            className={`hamburger ${drawerOpen ? "open" : ""}`}
            onClick={() => setDrawerOpen(true)}
          >
            <span className="ham-line" />
            <span className="ham-line" />
            <span className="ham-line" />
          </button>
        </div>
        <style>{style}</style>
      </nav>
    </>
  );
}
const style = `


/* MOBILE DRAWER */
.mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 950; }
.mobile-overlay.open { display: block; }
.mobile-drawer { position: fixed; top: 0; right: 0; width: 300px; height: 100vh; background: var(--bg2); z-index: 1000; transform: translateX(100%); transition: transform .3s; display: flex; flex-direction: column; overflow-y: auto; }
.mobile-drawer.open { transform: none; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.drawer-logo { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; }
.drawer-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--fg2); }
.drawer-links { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: .25rem; flex: 1; }
.drawer-links a { color: var(--ink); text-decoration: none; padding: .65rem 0; font-weight: 500; border-bottom: 1px solid var(--border); transition: color .2s; }
.drawer-links a:hover { color: var(--accent); }
.drawer-actions { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: .75rem; border-top: 1px solid var(--border); }
.drawer-settings { display: flex; align-items: center; justify-content: space-between; }
.drawer-settings-lbl { font-size: .85rem; color: var(--fg2); }
.drawer-font-btn { background: var(--bg3); border: 1px solid var(--border); color: var(--fg2); padding: .7rem 1rem; border-radius: 8px; cursor: pointer; font-size: .85rem; display: flex; align-items: center; gap: .5rem; font-family: var(--font-body); }

/* FONT PANEL */
.font-panel { position: fixed; top: 0; right: 0; width: 360px; height: 100vh; background: var(--bg2); z-index: 1100; transform: translateX(100%); transition: transform .35s; border-left: 1px solid var(--border); display: flex; flex-direction: column; }
.font-panel.open { transform: none; }
.fp-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.fp-title { font-family: var(--font-display); font-weight: 700; font-size: 1rem; }
.fp-close { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: var(--fg2); }
.fp-body { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
.fp-section-label { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--fg3); margin-bottom: .75rem; }
.fp-colors { display: flex; gap: .5rem; flex-wrap: wrap; }
.fp-color { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: border-color .2s, transform .15s; }
.fp-color:hover { transform: scale(1.15); }
.fp-color.active { border-color: var(--ink); }
.fp-font-opt { padding: .75rem; border: 1.5px solid var(--border); border-radius: 10px; cursor: pointer; margin-bottom: .5rem; transition: border-color .2s, background .2s; }
.fp-font-opt.active { border-color: var(--accent); background: var(--accent-lt); }
.fp-font-opt:hover { border-color: var(--accent); }
.fopt-name { font-size: .78rem; font-weight: 700; color: var(--fg3); margin-bottom: .3rem; }
.fopt-preview { font-size: 1.1rem; font-weight: 700; color: var(--ink); margin-bottom: .4rem; }
.fopt-hint { font-size: .72rem; color: var(--fg3); line-height: 1.5; }


/* NAV */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 900;
  display: flex; align-items: center; justify-content: space-between;
  padding: .85rem 2rem; background: var(--nav-bg);
  backdrop-filter: blur(16px); border-bottom: 1px solid transparent;
  transition: border-color .3s, box-shadow .3s;

}
.navbar.scrolled { border-color: var(--border); box-shadow: 0 2px 20px rgba(0,0,0,.08); }
.nav-logo { display: flex; align-items: center; gap: .35rem; font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; cursor: pointer; color: var(--ink); text-decoration: none; }
.nav-logo .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.nav-links { display: flex; gap: 2rem; }
.nav-links a { color: var(--fg2); text-decoration: none; font-size: .9rem; font-weight: 500; transition: color .2s; }
.nav-links a:hover { color: var(--accent); }
.nav-right { display: flex; align-items: center; gap: .75rem; }
.font-btn { background: var(--bg3); border: 1px solid var(--border); color: var(--fg2); padding: .4rem .8rem; border-radius: 6px; cursor: pointer; font-size: .8rem; display: flex; align-items: center; gap: .4rem; font-family: var(--font-body); transition: all .2s; }
.font-btn:hover { color: var(--accent); border-color: var(--accent); }
.theme-icon { font-size: .9rem; }
.theme-toggle { width: 44px; height: 24px; border-radius: 12px; background: var(--bg3); border: 1px solid var(--border); cursor: pointer; position: relative; transition: background .3s; }
.theme-toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); transition: transform .3s; }
[data-theme="dark"] .theme-toggle::after { transform: translateX(20px); }
.btn-ghost { background: none; border: 1px solid var(--border); color: var(--fg2); padding: .4rem .9rem; border-radius: 8px; cursor: pointer; font-size: .85rem; font-family: var(--font-body); transition: all .2s; }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
.btn-cta { background: var(--accent); color: #fff; padding: .45rem 1.1rem; border-radius: 8px; border: none; cursor: pointer; font-size: .85rem; font-weight: 600; font-family: var(--font-body); text-decoration: none; display: inline-flex; align-items: center; transition: background .2s, transform .15s; }
.btn-cta:hover { background: var(--accent-dk); transform: translateY(-1px); }
.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: .3rem; }
.ham-line { display: block; width: 22px; height: 2px; background: var(--ink); border-radius: 2px; transition: transform .3s, opacity .3s; }
.hamburger.open .ham-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open .ham-line:nth-child(2) { opacity: 0; }
.hamburger.open .ham-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.navbar {
  margin: 0;
  border-radius: 0;
  border: 0.01px solid transparent;
  transition:
    margin 0.4s ease,
    border-radius 0.4s ease,
    border-color 0.4s ease,
    box-shadow 0.4s ease,
    background-color 0.4s ease;
}

.navbar.scrolled {
  margin: 1rem 4rem 0 4rem;
  border-radius: 50px;
  // border-color: #0ea5e9;
//   width: 420px;
// height: 280px;
border-radius: 40px;
background: rgba(255, 255, 255, 0.12);
backdrop-filter: blur(8px) saturate(1.8) brightness(1.15) contrast(1.05);
  -webkit-backdrop-filter: blur(8px) saturate(1.8) brightness(1.15) contrast(1.05);

  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.15),
    inset 1.5px 1.5px 0 rgba(255, 255, 255, 0.5),
    inset 0 0 12px rgba(255, 255, 255, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.2);
}
}

.glassCard {
  position: relative;
  overflow: hidden;

  padding: 24px;
  border-radius: 32px;

  /* Glass */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);

  /* Glass Border */
  border: 1px solid rgba(255, 255, 255, 0.18);

  /* Depth */
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.35),
    inset 0 -1px 1px rgba(255, 255, 255, 0.05);

  transition: all 0.4s ease;
}


@media(max-width:640px) {


      nav {
        padding: 0 4%;
        height: 60px;
      }
         .nav-logo {
        font-size: 1.1rem;
      }
        
  .font-panel {
        width: 100%;
        border-left: none;
        border-top: 1px solid var(--border);
      }

}
`;
