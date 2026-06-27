"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import CtaSection from "./home/ctaSection";
import Header from "./layout/header";
import styles from './homeWrapper.module.css';

const cx = (...args) => {
  return args.flat().filter(Boolean).map(str => String(str).trim().split(/\s+/).map(c => styles[c] || c).join(' ')).join(' ');
};


/* ─── SITE DATA ─── */
const SITE_DATA = {
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
  company: {
    name: "MahaveerTrans",
    tagline:
      "Delivering the world's goods with precision, speed, and care — your trusted partner in global logistics since 1999.",
    founded: "2010",
    phone: "+91 22 4001 8000",
    email: "hello@MahaveerTrans.com",
    website: "MahaveerTrans.com",
    address: "Mumbai, India",
    rating: "4.9★",
    ratingLabel: "Average rating across 1,200+ reviews",
  },
  hero: {
    pill: "Live tracking across 180+ countries",
    titleLine1: "Logistics",
    titleLine2Hl: "Redefined",
    titleLine3: "For Modern",
    chip: "2025",
    description:
      "End-to-end freight solutions powered by real-time AI routing, live shipment tracking, and a global carrier network built for speed and reliability.",
    cta1: "Start Shipping →",
    cta2: "▶ Watch Demo",
    image:
      "https://autobahntrucking.com/storage/app/vehicles/images/Bharatbenz-truck-5528TT.jpg",
    statCard1: {
      label: "Monthly Deliveries",
      sub: "shipments this month",
      badge: "↑ 18% vs last month",
      capacityLabel: "Capacity used",
    },
    statCard2: { label: "On-time Rate", sub: "last 200 days" },
    trust: {
      count: "4,800+",
      label: "businesses trust MahaveerTrans",
      avatars: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop&crop=face",
      ],
    },
    stats: { shipments: 12400, onTime: 99 },
  },
  ticker: [
    "Air Freight",
    "Ocean Shipping",
    "Road Transport",
    "Cold Chain",
    "Customs Clearance",
    "Warehousing & 3PL",
    "Last Mile Delivery",
    "Project Cargo",
    "Express Courier",
    "Reverse Logistics",
  ],
  clients: {
    label: "Trusted by",
    logos: [
      "MAHINDRA",
      "RELIANCE",
      "INFOSYS",
      "WIPRO",
      "ADANI",
      "GODREJ",
      "TATA",
    ],
  },
  services: {
    sectionTag: "What We Do",
    heading: "Complete Logistics Under One Roof",
    headingHl: "Logistics",
    description:
      "From a single parcel to a full container — we handle every mode, every route, with zero compromise on visibility.",
    learnMoreText: "Learn more →",
    items: [
      {
        tag: "Express",
        tagClass: "tp-sky",
        icon: "",
        title: "Air Freight",
        description:
          "Priority air cargo with door-to-door tracking. Partnered with 40+ airlines for daily worldwide departures.",
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80&auto=format&fit=crop",
      },
      {
        tag: "FCL / LCL",
        tagClass: "tp-blue",
        icon: "",
        title: "Sea Freight",
        description:
          "Cost-effective ocean freight across all major trade lanes. Full container or groupage — we handle it all.",
        image:
          "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80&auto=format&fit=crop",
      },
      {
        tag: "FTL / LTL",
        tagClass: "tp-amber",
        icon: "",
        title: "Road Transport",
        description:
          "GPS-tracked trucks across the full road network. Temperature-controlled options available nationwide.",
        image:
          "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80&auto=format&fit=crop",
      },
      {
        tag: "3PL",
        tagClass: "tp-green",
        icon: "",
        title: "Warehousing & 3PL",
        description:
          "Smart fulfillment centers with WMS integration, pick & pack, kitting, and same-day dispatch capability.",
        image:
          "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80&auto=format&fit=crop",
      },
    ],
  },
  numbers: [
    {
      value: 12400,
      suffix: "+",
      label: "Monthly shipments processed globally",
    },
    { value: 99, suffix: "%", label: "On-time delivery rate, 90-day avg" },
    { value: 180, suffix: "+", label: "Countries in active network" },
    { value: 25, suffix: " yrs", label: "Years of logistics experience" },
  ],
  about: {
    sectionTag: "Our Story",
    tagStrip: "Since 1999",
    title: "Built for Scale.",
    titleHl: "Trusted by All.",
    p1: "MahaveerTrans was founded in 1999 with a single idea: logistics should be transparent, fast, and accessible to every business. Today we operate in 40+ countries with 3,200 specialists and a proprietary TMS platform that gives clients full supply chain visibility.",
    p2: "Our AI-powered routing engine selects the best combination of speed, cost, and carbon efficiency for every shipment — automatically optimised in real time.",
    cta: "Meet The Team →",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=80&auto=format&fit=crop",
    features: [
      "ISO 9001 Certified",
      "IATA Accredited",
      "24/7 Control Tower",
      "AI-Powered Routing",
      "Carbon Neutral 2030",
      "Real-time Visibility",
    ],
  },
  process: {
    sectionTag: "Simple Process",
    heading: "Ship in",
    headingHl: "4 Steps",
    steps: [
      {
        num: "01",
        title: "Get a Quote",
        desc: "Fill our form in under 60 seconds. Our AI returns an instant, competitive quote for your route.",
      },
      {
        num: "02",
        title: "We Plan the Route",
        desc: "Our team designs the optimal path using AI routing, carrier rates, and customs intelligence.",
      },
      {
        num: "03",
        title: "Pickup & Transit",
        desc: "Your cargo is collected on schedule and moves through our vetted, insured carrier network.",
      },
      {
        num: "04",
        title: "Delivered ✓",
        desc: "Track in real time. Receive photo proof of delivery and full digital documentation.",
      },
    ],
  },
  fleet: {
    sectionTag: "Our Fleet",
    heading: "Built to",
    headingHl: "Deliver",
    cta: "View All Fleet →",
    items: [
      {
        title: "Heavy Haulage Fleet",
        sub: "200+ trucks across India",
        tag: "Road",
        tall: true,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
      },
      {
        title: "Container Vessels",
        sub: "40,000+ TEU capacity",
        tag: "Ocean",
        tall: false,
        image:
          "https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&q=80&auto=format&fit=crop",
      },
      {
        title: "Air Cargo Network",
        sub: "40+ airline partners",
        tag: "Air",
        tall: false,
        image:
          "https://images.unsplash.com/photo-1627579809897-38afb36a8b4c?w=500&q=80&auto=format&fit=crop",
      },
      {
        title: "Smart Warehouses",
        sub: "3M sq.ft managed",
        tag: "Storage",
        tall: false,
        image:
          "https://images.unsplash.com/photo-1553413077-190dd305871c?w=500&q=80&auto=format&fit=crop",
      },
      {
        title: "Urban Delivery Tech",
        sub: "EV fleet + drones",
        tag: "Last Mile",
        tall: false,
        image:
          "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80&auto=format&fit=crop",
      },
    ],
  },
  tracking: {
    sectionTag: "Real-Time",
    heading: "Track Your",
    headingHl: "Shipment",
    description:
      "Enter your tracking ID for instant live updates — location, status, customs clearance, and ETA all in one view.",
    inputPlaceholder: "e.g. VF-2025-00812",
    btnText: "Track Now",
    btnFound: "✓ Found!",
    hints: ["No login needed", "Live map view", "SMS alerts"],
    demo: {
      id: "#VF-2025-00812",
      status: "● In Transit",
      from: "Mumbai",
      fromCode: "BOM · Origin",
      to: "Frankfurt",
      toCode: "FRA · Destination",
      timeline: [
        {
          status: "done",
          title: "Picked up from sender",
          time: "May 28 · 09:14 AM",
        },
        {
          status: "done",
          title: "Departed Mumbai Airport",
          time: "May 28 · 11:40 PM",
        },
        {
          status: "now",
          title: "In transit — Dubai layover",
          time: "May 29 · 04:22 AM · Now",
        },
        {
          status: "pending",
          title: "Arriving Frankfurt",
          time: "May 30 · Est. 08:00 AM",
        },
      ],
    },
  },
  testimonials: {
    sectionTag: "Client Stories",
    heading: "What They",
    headingHl: "Say",
    items: [
      {
        stars: "★★★★★",
        text: "MahaveerTrans cut our import lead time from 3 weeks to 9 days. The tracking platform is genuinely world-class — our ops team loves it.",
        name: "Rajesh Mehta",
        role: "Supply Chain Director, Tata Consumer",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "We handle 500+ shipments monthly across 30 countries. Zero-exception customs handling and brilliant account support sets MahaveerTrans apart.",
        name: "Priya Sharma",
        role: "Head of Operations, GlobalMed",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "Cold chain precision is non-negotiable for us. MahaveerTrans's refrigerated fleet and monitoring gave us confidence to expand into five new markets.",
        name: "Arjun Kapoor",
        role: "CEO, FreshRoute Agri",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop&crop=face",
      },
    ],
  },
  cta: {
    sectionTag: "Get Started",
    title: "Ready to Ship",
    titleHl: "Smarter?",
    description:
      "Get a free consultation with our experts. No commitment, no hidden fees — just the best logistics solution for your business.",
    cta1: "Get Free Quote →",
    cta2: "📞 Call us",
  },
  footer: {
    logo: "MahaveerTrans",
    tagline:
      "Delivering the world's goods with precision and care. Your trusted logistics partner since 1999.",
    socials: [
      { label: "in", url: "#" },
      { label: "tw", url: "#" },
      { label: "yt", url: "#" },
      { label: "ig", url: "#" },
    ],
    columns: [
      {
        heading: "Services",
        links: [
          ["Air Freight", "#"],
          ["Sea Freight", "#"],
          ["Road Transport", "#"],
          ["Warehousing", "#"],
          ["Cold Chain", "#"],
          ["Customs", "#"],
        ],
      },
      {
        heading: "Company",
        links: [
          ["About Us", "#"],
          ["Careers", "#"],
          ["Sustainability", "#"],
          ["Press", "#"],
          ["Contact", "#"],
        ],
      },
      {
        heading: "Contact",
        links: [
          ["📍 Mumbai, India", "#"],
          ["📞 +91 22 4001 8000", "#"],
          ["✉️ hello@MahaveerTrans.com", "#"],
          ["🌐 MahaveerTrans.com", "#"],
        ],
      },
    ],
    copyright: "© 2025 MahaveerTrans Logistics Pvt. Ltd. All rights reserved.",
    legal: "Privacy · Terms · Sitemap",
  },
};

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

/* ─── HELPERS ─── */
function shadeColor(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 0xff) + pct));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + pct));
  const b = Math.min(255, Math.max(0, (n & 0xff) + pct));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function useCountUp(target, active, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(prog * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── COUNT UP NUMBER ─── */
function AnimatedNumber({ target, suffix }) {
  const [ref, inView] = useInView(0.4);
  const val = useCountUp(target, inView);
  return (
    <div className={cx("num-val")} ref={ref}>
      {val.toLocaleString()}
      <span className={cx("suf")}>{suffix}</span>
    </div>
  );
}

/* ─── REVEAL WRAPPER ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`${cx(`reveal ${inView ? "vis" : ""}`)} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ─── ANIMATED CARD ─── */
function AnimCard({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={cx(`${className} ${inView ? "vis" : ""}`)}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function HomeWrapper() {
  const d = SITE_DATA;
  const [theme, setTheme] = useState("light");
  const [fontPanelOpen, setFontPanelOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAccent, setActiveAccent] = useState(0);
  const [activeDisplayFont, setActiveDisplayFont] = useState(0);
  const [activeBodyFont, setActiveBodyFont] = useState(0);
  const [trackVal, setTrackVal] = useState("");
  const [trackState, setTrackState] = useState("idle");

  /* Theme & font CSS variables */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage?.getItem("vf-theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vf-theme", theme);
  }, [theme]);

  useEffect(() => {
    const a = ACCENT_COLORS[activeAccent];
    const r = document.documentElement;
    r.style.setProperty("--accent", a.color);
    r.style.setProperty("--accent-dk", shadeColor(a.color, -15));
    r.style.setProperty("--accent-lt", shadeColor(a.color, 90) + "22");
    r.style.setProperty("--shadow-bl", `0 8px 32px ${a.shadow}`);
    r.style.setProperty("--blue", a.color);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTrack = () => {
    if (!trackVal.trim()) {
      return;
    }
    setTrackState("found");
    setTimeout(() => setTrackState("idle"), 2500);
  };

  const heroCountRef = useRef(null);
  const [heroActive, setHeroActive] = useState(false);
  const shipVal = useCountUp(d.hero.stats.shipments, heroActive, 1800);
  const pctVal = useCountUp(d.hero.stats.onTime, heroActive, 1400);

  useEffect(() => {
    const el = document.getElementById("hero-section");
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeroActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tickerItems = d.ticker.map((t, i) => (
    <span className={cx("t-item")} key={i}>
      <span className={cx("t-dot")}></span>
      {t}
    </span>
  ));

  return (
    <>
      

      {/* FONT PANEL */}
      {/* <div className={cx(`font-panel ${fontPanelOpen ? "open" : "")}`}>
        <div className={cx("fp-header")}>
          <div className={cx("fp-title")}>{d.meta.fpTitle}</div>
          <button className={cx("fp-close")} onClick={() => setFontPanelOpen(false)}>
            ✕
          </button>
        </div>
        <div className={cx("fp-body")}>
          <div>
            <div className={cx("fp-section-label")}>{d.meta.fpColorLabel}</div>
            <div className={cx("fp-colors")}>
              {ACCENT_COLORS.map((ac, i) => (
                <div
                  key={i}
                  className={cx(`fp-color ${activeAccent === i ? "active" : "")}`}
                  style={{ background: ac.color }}
                  title={ac.title}
                  onClick={() => setActiveAccent(i)}
                />
              ))}
            </div>
          </div>
          <div>
            <div className={cx("fp-section-label")}>{d.meta.fpDisplayLabel}</div>
            {DISPLAY_FONTS.map((f, i) => (
              <div
                key={i}
                className={cx(`fp-font-opt ${activeDisplayFont === i ? "active" : "")}`}
                onClick={() => setActiveDisplayFont(i)}
              >
                <div className={cx("fopt-name")}>{f.font}</div>
                <div
                  className={cx("fopt-preview")}
                  style={{
                    fontFamily: `'${f.font}', sans-serif`,
                    fontWeight: 800,
                  }}
                >
                  Global Logistics
                </div>
                <div className={cx("fopt-hint")}>{f.hint}</div>
              </div>
            ))}
          </div>
          <div>
            <div className={cx("fp-section-label")}>{d.meta.fpBodyLabel}</div>
            {BODY_FONTS.map((f, i) => (
              <div
                key={i}
                className={cx(`fp-font-opt ${activeBodyFont === i ? "active" : "")}`}
                onClick={() => setActiveBodyFont(i)}
              >
                <div className={cx("fopt-name")}>{f.font}</div>
                <div
                  className={cx("fopt-preview")}
                  style={{
                    fontFamily: `'${f.font}', sans-serif`,
                    fontSize: ".9rem",
                    fontWeight: 400,
                  }}
                >
                  Fast, reliable, global delivery solutions for every business.
                </div>
                <div className={cx("fopt-hint")}>{f.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* MOBILE OVERLAY */}
      {/* <div
        className={cx(`mobile-overlay ${drawerOpen ? "open" : "")}`}
        onClick={() => setDrawerOpen(false)}
      /> */}

      {/* MOBILE DRAWER */}
      {/* <div className={cx(`mobile-drawer ${drawerOpen ? "open" : "")}`}>
        <div className={cx("drawer-header")}>
          <div className={cx("drawer-logo")}>
            {d.nav.brandShort}
            <span style={{ opacity: 0.45 }}> Solutions</span>
          </div>
          <button className={cx("drawer-close")} onClick={() => setDrawerOpen(false)}>
            ✕
          </button>
        </div>
        <div className={cx("drawer-links")}>
          {d.nav.drawerLinks.map((l, i) => (
            <a key={i} href={l.href} onClick={() => setDrawerOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <div className={cx("drawer-actions")}>
          <div className={cx("drawer-settings")}>
            <span className={cx("drawer-settings-lbl")}>{d.meta.themeLabel}</span>
            <button
              className={cx("theme-toggle")}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            />
          </div>
          <button
            className={cx("drawer-font-btn")}
            onClick={() => {
              setFontPanelOpen(true);
              setDrawerOpen(false);
            }}
          >
            <span>Aa</span> <span>{d.meta.drawerFontBtnText}</span>
          </button>
          <button
            className={cx("btn-cta")}
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
      </div> */}

      {/* NAV */}
      {/* <nav className={cx(`navbar ${scrolled ? "scrolled" : "")}`}>
        <a href="#" className={cx("nav-logo")}>
          <span>{d.nav.brand}</span>
          <div className={cx("dot")}></div>
        </a>
        <div className={cx("nav-links")}>
          {d.nav.links.map((l, i) => (
            <a key={i} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className={cx("nav-right")}>
          <button
            className={cx("font-btn")}
            onClick={() => setFontPanelOpen((p) => !p)}
          >
            <span>Aa</span> <span>{d.meta.fontBtnText}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: ".55rem" }}>
            <span className={cx("theme-icon")}>☀️</span>
            <button
              className={cx("theme-toggle")}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            />
            <span className={cx("theme-icon")}>🌙</span>
          </div>
          <button className={cx("btn-ghost")}>{d.nav.login}</button>
          <a href="#cta" className={cx("btn-cta")}>
            {d.nav.cta}
          </a>
          <button
            className={cx(`hamburger ${drawerOpen ? "open" : "")}`}
            onClick={() => setDrawerOpen(true)}
          >
            <span className={cx("ham-line")} />
            <span className={cx("ham-line")} />
            <span className={cx("ham-line")} />
          </button>
        </div>
      </nav> */}
      <Header />

      {/* HERO */}
      <section className={cx("hero")} id="hero-section">
        <div className={cx("hero-grid-bg")} />
        <div className={cx("hero-glow")} />
        <div className={cx("hero-inner")}>
          <div className={cx("hero-left")}>
            <div className={cx("hero-pill")}>
              <span className={cx("live-dot")} />
              {d.hero.pill}
            </div>
            <h1 className={cx("hero-h1")}>
              {d.hero.titleLine1}
              <br />
              <span className={cx("hl")}>{d.hero.titleLine2Hl}</span>
              <br />
              {d.hero.titleLine3}
              <span className={cx("hero-chip")}>{d.hero.chip}</span>
            </h1>
            <p className={cx("hero-desc")}>{d.hero.description}</p>
            <div className={cx("hero-actions")}>
              <button className={cx("btn-primary")}>{d.hero.cta1}</button>
              <button className={cx("btn-outline")}>{d.hero.cta2}</button>
            </div>
            <div className={cx("hero-trust")}>
              <div className={cx("trust-avs")}>
                {d.hero.trust.avatars.map((src, i) => (
                  <img key={i} className={cx("t-av")} src={src} alt="" />
                ))}
              </div>
              <div className={cx("trust-txt")}>
                <strong>{d.hero.trust.count}</strong> {d.hero.trust.label}
              </div>
            </div>
          </div>
          <div className={cx("hero-right")}>
            <div className={cx("hero-img-wrap")}>
              <img
                className={cx("hero-main-img")}
                src={d.hero.image}
                alt="Operations"
              />
              <div className={cx("hfloat hf1")}>
                <div className={cx("hf-tag")}>{d.hero.statCard1.label}</div>
                <div className={cx("hf-val")}>
                  {heroActive ? shipVal.toLocaleString() : "0"}
                </div>
                <div className={cx("hf-sub")}>{d.hero.statCard1.sub}</div>
                <div className={cx("hf-badge")}>{d.hero.statCard1.badge}</div>
                <div className={cx("hf-bar-wrap")}>
                  <div className={cx("hf-tag")} style={{ marginTop: ".55rem" }}>
                    {d.hero.statCard1.capacityLabel}
                  </div>
                  <div className={cx("hf-bar")}>
                    <div className={cx("hf-fill")} />
                  </div>
                </div>
              </div>
              <div className={cx("hfloat hf2")}>
                <div className={cx("hf-tag")}>{d.hero.statCard2.label}</div>
                <div className={cx("hf-val")}>{heroActive ? pctVal + "%" : "0%"}</div>
                <div className={cx("hf-sub")}>{d.hero.statCard2.sub}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className={cx("ticker-wrap")}>
        <div className={cx("ticker")}>
          {tickerItems}
          {tickerItems}
        </div>
      </div>

      {/* CLIENTS */}
      <div className={cx("clients")}>
        <div className={cx("clients-inner")}>
          <span className={cx("clients-lbl")}>{d.clients.label}</span>
          <div className={cx("clients-logos")}>
            {d.clients.logos.map((l, i) => (
              <div key={i} className={cx("clogo")}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className={cx("services")}>
        <div className={cx("svc-top reveal")}>
          <div>
            <div className={cx("sec-tag")}>{d.services.sectionTag}</div>
            <h2 className={cx("sec-h")}>
              {d.services.heading
                .replace(
                  d.services.headingHl,
                  `<HL>${d.services.headingHl}</HL>`,
                )
                .split("<HL>")
                .map((part, i) =>
                  i === 0
                    ? part
                    : part.split("</HL>").map((p, j) =>
                        j === 0 ? (
                          <span key={j} className={cx("hl")}>
                            {p}
                          </span>
                        ) : (
                          p
                        ),
                      ),
                )}
            </h2>
            <p className={cx("svc-top-desc")}>{d.services.description}</p>
          </div>
          <a href="#" className={cx("btn-outline")}>
            All Services →
          </a>
        </div>
        <div className={cx("svc-grid")}>
          {d.services.items.map((s, i) => (
            <AnimCard key={i} className={cx("svc-card")} delay={i * 0.07}>
              <img className={cx("svc-img")} src={s.image} alt={s.title} />
              <span className={cx(`svc-tag-pill ${s.tagClass}`)}>{s.tag}</span>
              {s.icon && <div className={cx("svc-icon")}>{s.icon}</div>}
              <h3 className={cx("svc-title")}>{s.title}</h3>
              <p className={cx("svc-desc")}>{s.description}</p>
              <a href="#" className={cx("svc-link")}>
                {d.services.learnMoreText}
              </a>
            </AnimCard>
          ))}
        </div>
      </section>

      {/* NUMBERS */}
      <div className={cx("numbers")} id="numbers">
        {d.numbers.map((n, i) => (
          <div key={i} className={cx("num-item")}>
            <AnimatedNumber target={n.value} suffix={n.suffix} />
            <div className={cx("num-lbl")}>{n.label}</div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      {/* <section id="about" className={cx("about")}>
        <div className={cx("section-wrap")}>
          <div className={cx("about-grid")}>
            <div className={cx("about-img-col")}>
              <div className={cx("about-tag-strip")}>{d.about.tagStrip}</div>
              <img className={cx("about-main-img")} src={d.about.image} alt="About" />
              <div className={cx("about-badge")}>
                <div className={cx("ab-num")}>{d.company.rating}</div>
                <div className={cx("ab-txt")}>{d.company.ratingLabel}</div>
              </div>
            </div>
            <div className={cx("about-content")}>
              <Reveal>
                <div className={cx("sec-tag")}>{d.about.sectionTag}</div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className={cx("sec-h")}>
                  {d.about.title}
                  <br />
                  <span className={cx("hl")}>{d.about.titleHl}</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className={cx("desc")} style={{ marginBottom: ".75rem" }}>
                  {d.about.p1}
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <p className={cx("desc")}>{d.about.p2}</p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className={cx("about-feats")}>
                  {d.about.features.map((f, i) => (
                    <div key={i} className={cx("feat")}>
                      {f}
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.35}>
                <a href="#" className={cx("btn-primary")}>
                  {d.about.cta}
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section> */}

      {/* PROCESS */}
      <div id="process" className={cx("process")}>
        <div className={cx("section-wrap")}>
          <Reveal className={cx("proc-head")}>
            <div className={cx("sec-tag")}>{d.process.sectionTag}</div>
            <h2 className={cx("sec-h")}>
              {d.process.heading}{" "}
              <span className={cx("hl")}>{d.process.headingHl}</span>
            </h2>
          </Reveal>
          <div className={cx("proc-steps")}>
            {d.process.steps.map((p, i) => (
              <AnimCard key={i} className={cx("pstep")} delay={i * 0.1}>
                <div className={cx("pstep-n")}>{p.num}</div>
                <h3 className={cx("pstep-title")}>{p.title}</h3>
                <p className={cx("pstep-desc")}>{p.desc}</p>
              </AnimCard>
            ))}
          </div>
        </div>
      </div>

      {/* FLEET */}
      <section id="fleet" className={cx("fleet")}>
        <div className={cx("section-wrap")}>
          <div className={cx("fleet-head")}>
            <div>
              <div className={cx("sec-tag")}>{d.fleet.sectionTag}</div>
              <h2 className={cx("sec-h")}>
                {d.fleet.heading}{" "}
                <span className={cx("hl")}>{d.fleet.headingHl}</span>
              </h2>
            </div>
            <button className={cx("btn-outline")}>{d.fleet.cta}</button>
          </div>
          <div className={cx("gal-grid")}>
            {d.fleet.items.map((f, i) => (
              <div key={i} className={`${cx(`gi ${f.tall ? "tall" : ""}`)}`}>
                <img src={f.image} alt={f.title} />
                <div className={cx("gi-tag")}>{f.tag}</div>
                <div className={cx("gi-label")}>
                  <h4>{f.title}</h4>
                  <p>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKING */}
      <section id="tracking" className={cx("tracking")}>
        <div className={cx("section-wrap")}>
          <div className={cx("track-grid")}>
            <Reveal>
              <div className={cx("sec-tag")}>{d.tracking.sectionTag}</div>
              <h2 className={cx("sec-h")}>
                {d.tracking.heading}
                <br />
                <span className={cx("hl")}>{d.tracking.headingHl}</span>
              </h2>
              <p style={{ color: "var(--fg2)", marginTop: ".75rem" }}>
                {d.tracking.description}
              </p>
              <div className={cx("track-form")}>
                <div className={cx("t-input-row")}>
                  <input
                    className={cx("t-input")}
                    type="text"
                    placeholder={d.tracking.inputPlaceholder}
                    value={trackVal}
                    onChange={(e) => setTrackVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  />
                  <button
                    className={cx("t-btn")}
                    style={
                      trackState === "found" ? { background: "#16a34a" } : {}
                    }
                    onClick={handleTrack}
                  >
                    {trackState === "found"
                      ? d.tracking.btnFound
                      : d.tracking.btnText}
                  </button>
                </div>
                <div className={cx("t-hints")}>
                  {d.tracking.hints.map((h, i) => (
                    <span key={i} className={cx("t-hint")}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className={cx("track-card")}>
                <div className={cx("tc-hdr")}>
                  <div className={cx("tc-id")}>{d.tracking.demo.id}</div>
                  <div className={cx("tc-status")}>{d.tracking.demo.status}</div>
                </div>
                <div className={cx("tc-route")}>
                  <div className={cx("tc-city")}>
                    <div className={cx("tc-city-name")}>{d.tracking.demo.from}</div>
                    <div className={cx("tc-city-code")}>
                      {d.tracking.demo.fromCode}
                    </div>
                  </div>
                  <div className={cx("tc-arrow")}>→</div>
                  <div className={cx("tc-city")} style={{ textAlign: "right" }}>
                    <div className={cx("tc-city-name")}>{d.tracking.demo.to}</div>
                    <div className={cx("tc-city-code")}>{d.tracking.demo.toCode}</div>
                  </div>
                </div>
                <div>
                  {d.tracking.demo.timeline.map((t, i) => (
                    <div key={i} className={cx("tl-row")}>
                      <div className={cx(`tl-d tl-${t.status}`)} />
                      <div>
                        <div className={cx("tl-title")}>{t.title}</div>
                        <div className={cx("tl-time")}>{t.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className={cx("testimonials")}>
        <div className={cx("section-wrap")}>
          <Reveal className={cx("test-head")}>
            <div className={cx("sec-tag")}>{d.testimonials.sectionTag}</div>
            <h2 className={cx("sec-h")}>
              {d.testimonials.heading}{" "}
              <span className={cx("hl")}>{d.testimonials.headingHl}</span>
            </h2>
          </Reveal>
          <div className={cx("test-grid")}>
            {d.testimonials.items.map((t, i) => (
              <AnimCard key={i} className={cx("tc-card")} delay={i * 0.1}>
                <div className={cx("tc-stars")}>{t.stars}</div>
                <p className={cx("tc-text")}>"{t.text}"</p>
                <div className={cx("tc-author")}>
                  <img className={cx("tc-av")} src={t.avatar} alt={t.name} />
                  <div>
                    <div className={cx("tc-name")}>{t.name}</div>
                    <div className={cx("tc-role")}>{t.role}</div>
                  </div>
                </div>
              </AnimCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaSection />
      {/* <section id="cta" className={cx("cta-section")}>
        <div className={cx("cta-inner")}>
          <div className={cx("sec-tag")}>{d.cta.sectionTag}</div>
          <h2 className={cx("sec-h")}>{d.cta.title}<br /><span style={{ opacity: .85 }}>{d.cta.titleHl}</span></h2>
          <p>{d.cta.description}</p>
          <div className={cx("cta-btns")}>
            <button className={cx("btn-w")}>{d.cta.cta1}</button>
            <button className={cx("btn-wg")}>{d.cta.cta2} {d.company.phone}</button>
          </div>
        </div>
      </section> */}

      {/* FOOTER */}
      <footer>
        <div className={cx("f-top")}>
          <div className={cx("f-brand")}>
            <span className={cx("f-brand-logo")}>{d.footer.logo}</span>
            <p>{d.footer.tagline}</p>
            <div className={cx("f-socs")}>
              {d.footer.socials.map((s, i) => (
                <a key={i} href={s.url} className={cx("f-soc")}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {d.footer.columns.map((col, i) => (
            <div key={i} className={cx("f-col")}>
              <h4>{col.heading}</h4>
              <ul className={cx("f-links")}>
                {col.links.map(([label, url], j) => (
                  <li key={j}>
                    <a href={url}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={cx("f-bottom")}>
          <p>{d.footer.copyright}</p>
          <p>{d.footer.legal}</p>
        </div>
      </footer>

      {/* FAB */}
      <button className={cx("fab")}>{d.meta.fabIcon}</button>
    </>
  );
}
