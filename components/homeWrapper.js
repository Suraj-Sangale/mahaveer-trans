"use client"
import { useState, useEffect, useRef, useCallback } from "react";

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
    tagline: "Delivering the world's goods with precision, speed, and care — your trusted partner in global logistics since 1999.",
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
    description: "End-to-end freight solutions powered by real-time AI routing, live shipment tracking, and a global carrier network built for speed and reliability.",
    cta1: "Start Shipping →",
    cta2: "▶ Watch Demo",
    image: "https://autobahntrucking.com/storage/app/vehicles/images/Bharatbenz-truck-5528TT.jpg",
    statCard1: { label: "Monthly Deliveries", sub: "shipments this month", badge: "↑ 18% vs last month", capacityLabel: "Capacity used" },
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
  ticker: ["Air Freight", "Ocean Shipping", "Road Transport", "Cold Chain", "Customs Clearance", "Warehousing & 3PL", "Last Mile Delivery", "Project Cargo", "Express Courier", "Reverse Logistics"],
  clients: {
    label: "Trusted by",
    logos: ["MAHINDRA", "RELIANCE", "INFOSYS", "WIPRO", "ADANI", "GODREJ", "TATA"],
  },
  services: {
    sectionTag: "What We Do",
    heading: "Complete Logistics Under One Roof",
    headingHl: "Logistics",
    description: "From a single parcel to a full container — we handle every mode, every route, with zero compromise on visibility.",
    learnMoreText: "Learn more →",
    items: [
      { tag: "Express", tagClass: "tp-sky", icon: "✈️", title: "Air Freight", description: "Priority air cargo with door-to-door tracking. Partnered with 40+ airlines for daily worldwide departures.", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80&auto=format&fit=crop" },
      { tag: "FCL / LCL", tagClass: "tp-blue", icon: "🚢", title: "Sea Freight", description: "Cost-effective ocean freight across all major trade lanes. Full container or groupage — we handle it all.", image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80&auto=format&fit=crop" },
      { tag: "FTL / LTL", tagClass: "tp-amber", icon: "🚛", title: "Road Transport", description: "GPS-tracked trucks across the full road network. Temperature-controlled options available nationwide.", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80&auto=format&fit=crop" },
      { tag: "3PL", tagClass: "tp-green", icon: "🏭", title: "Warehousing & 3PL", description: "Smart fulfillment centers with WMS integration, pick & pack, kitting, and same-day dispatch capability.", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80&auto=format&fit=crop" },
    ],
  },
  numbers: [
    { value: 12400, suffix: "+", label: "Monthly shipments processed globally" },
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
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=80&auto=format&fit=crop",
    features: ["ISO 9001 Certified", "IATA Accredited", "24/7 Control Tower", "AI-Powered Routing", "Carbon Neutral 2030", "Real-time Visibility"],
  },
  process: {
    sectionTag: "Simple Process",
    heading: "Ship in",
    headingHl: "4 Steps",
    steps: [
      { num: "01", title: "Get a Quote", desc: "Fill our form in under 60 seconds. Our AI returns an instant, competitive quote for your route." },
      { num: "02", title: "We Plan the Route", desc: "Our team designs the optimal path using AI routing, carrier rates, and customs intelligence." },
      { num: "03", title: "Pickup & Transit", desc: "Your cargo is collected on schedule and moves through our vetted, insured carrier network." },
      { num: "04", title: "Delivered ✓", desc: "Track in real time. Receive photo proof of delivery and full digital documentation." },
    ],
  },
  fleet: {
    sectionTag: "Our Fleet",
    heading: "Built to",
    headingHl: "Deliver",
    cta: "View All Fleet →",
    items: [
      { title: "Heavy Haulage Fleet", sub: "200+ trucks across India", tag: "Road", tall: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop" },
      { title: "Container Vessels", sub: "40,000+ TEU capacity", tag: "Ocean", tall: false, image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&q=80&auto=format&fit=crop" },
      { title: "Air Cargo Network", sub: "40+ airline partners", tag: "Air", tall: false, image: "https://images.unsplash.com/photo-1627579809897-38afb36a8b4c?w=500&q=80&auto=format&fit=crop" },
      { title: "Smart Warehouses", sub: "3M sq.ft managed", tag: "Storage", tall: false, image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=500&q=80&auto=format&fit=crop" },
      { title: "Urban Delivery Tech", sub: "EV fleet + drones", tag: "Last Mile", tall: false, image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80&auto=format&fit=crop" },
    ],
  },
  tracking: {
    sectionTag: "Real-Time",
    heading: "Track Your",
    headingHl: "Shipment",
    description: "Enter your tracking ID for instant live updates — location, status, customs clearance, and ETA all in one view.",
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
        { status: "done", title: "Picked up from sender", time: "May 28 · 09:14 AM" },
        { status: "done", title: "Departed Mumbai Airport", time: "May 28 · 11:40 PM" },
        { status: "now", title: "In transit — Dubai layover", time: "May 29 · 04:22 AM · Now" },
        { status: "pending", title: "Arriving Frankfurt", time: "May 30 · Est. 08:00 AM" },
      ],
    },
  },
  testimonials: {
    sectionTag: "Client Stories",
    heading: "What They",
    headingHl: "Say",
    items: [
      { stars: "★★★★★", text: "MahaveerTrans cut our import lead time from 3 weeks to 9 days. The tracking platform is genuinely world-class — our ops team loves it.", name: "Rajesh Mehta", role: "Supply Chain Director, Tata Consumer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face" },
      { stars: "★★★★★", text: "We handle 500+ shipments monthly across 30 countries. Zero-exception customs handling and brilliant account support sets MahaveerTrans apart.", name: "Priya Sharma", role: "Head of Operations, GlobalMed", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face" },
      { stars: "★★★★★", text: "Cold chain precision is non-negotiable for us. MahaveerTrans's refrigerated fleet and monitoring gave us confidence to expand into five new markets.", name: "Arjun Kapoor", role: "CEO, FreshRoute Agri", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop&crop=face" },
    ],
  },
  cta: {
    sectionTag: "Get Started",
    title: "Ready to Ship",
    titleHl: "Smarter?",
    description: "Get a free consultation with our experts. No commitment, no hidden fees — just the best logistics solution for your business.",
    cta1: "Get Free Quote →",
    cta2: "📞 Call us",
  },
  footer: {
    logo: "MahaveerTrans",
    tagline: "Delivering the world's goods with precision and care. Your trusted logistics partner since 1999.",
    socials: [
      { label: "in", url: "#" },
      { label: "tw", url: "#" },
      { label: "yt", url: "#" },
      { label: "ig", url: "#" },
    ],
    columns: [
      { heading: "Services", links: [["Air Freight", "#"], ["Sea Freight", "#"], ["Road Transport", "#"], ["Warehousing", "#"], ["Cold Chain", "#"], ["Customs", "#"]] },
      { heading: "Company", links: [["About Us", "#"], ["Careers", "#"], ["Sustainability", "#"], ["Press", "#"], ["Contact", "#"]] },
      { heading: "Contact", links: [["📍 Mumbai, India", "#"], ["📞 +91 22 4001 8000", "#"], ["✉️ hello@MahaveerTrans.com", "#"], ["🌐 MahaveerTrans.com", "#"]] },
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
  { font: "Syne", hint: "💡 Great for tech brands — geometric, bold, very modern." },
  { font: "Playfair Display", hint: "💡 Elegant serif — ideal for premium or luxury positioning." },
  { font: "Outfit", hint: "💡 Clean, rounded, approachable. Perfect for SaaS or startup feel." },
  { font: "Josefin Sans", hint: "💡 Narrow, art-deco inspired — very distinctive and stylish." },
  { font: "Cormorant Garamond", hint: "💡 Classic Roman serif — ultra-refined, almost fashion-magazine feel." },
  { font: "Space Grotesk", hint: "💡 Techy, slightly quirky grotesque — loved in fintech and logistics apps." },
];

const BODY_FONTS = [
  { font: "Instrument Sans", hint: "💡 Humanist, warm, readable — excellent for body copy." },
  { font: "Plus Jakarta Sans", hint: "💡 Balanced, modern, slightly formal — a very safe UI font." },
  { font: "Outfit", hint: "💡 Very smooth, even rhythm. Good for younger/consumer brands." },
  { font: "Nunito", hint: "💡 Rounded, friendly — best for consumer-facing products." },
  { font: "Space Grotesk", hint: "💡 Pairs beautifully with itself for a monofont site." },
];

/* ─── HELPERS ─── */
function shadeColor(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 0xff) + pct));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + pct));
  const b = Math.min(255, Math.max(0, (n & 0xff) + pct));
  return "#" + (r << 16 | g << 8 | b).toString(16).padStart(6, "0");
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
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@400;500;600&family=Playfair+Display:wght@700;800&family=Outfit:wght@400;500;600;700&family=Josefin+Sans:wght@400;600;700&family=Cormorant+Garamond:wght@600;700&family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=Nunito:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --accent: #0ea5e9;
  --accent-dk: #0284c7;
  --accent-lt: #0ea5e922;
  --shadow-bl: 0 8px 32px rgba(14,165,233,0.25);
  --blue: #0ea5e9;
  --font-display: 'Syne', sans-serif;
  --font-body: 'Instrument Sans', sans-serif;
  --r: 1rem;
  --r2: 1.5rem;
}

[data-theme="light"] {
  --bg: #f8fafc; --bg2: #fff; --bg3: #f1f5f9;
  --fg: #0f172a; --fg2: #475569; --fg3: #94a3b8;
  --border: #e2e8f0; --nav-bg: rgba(248,250,252,0.9);
  --card-bg: #fff; --num-bg: #f1f5f9;
}
[data-theme="dark"] {
  --bg: #0a0f1e; --bg2: #111827; --bg3: #1e293b;
  --fg: #f1f5f9; --fg2: #94a3b8; --fg3: #475569;
  --border: #1e293b; --nav-bg: rgba(10,15,30,0.92);
  --card-bg: #111827; --num-bg: #1e293b;
}

body { font-family: var(--font-body); background: var(--bg); color: var(--fg); line-height: 1.6; overflow-x: hidden; transition: background .3s, color .3s; }

/* NAV */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 900;
  display: flex; align-items: center; justify-content: space-between;
  padding: .85rem 2rem; background: var(--nav-bg);
  backdrop-filter: blur(16px); border-bottom: 1px solid transparent;
  transition: border-color .3s, box-shadow .3s;
}
.navbar.scrolled { border-color: var(--border); box-shadow: 0 2px 20px rgba(0,0,0,.08); }
.nav-logo { display: flex; align-items: center; gap: .35rem; font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; cursor: pointer; color: var(--fg); text-decoration: none; }
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
.ham-line { display: block; width: 22px; height: 2px; background: var(--fg); border-radius: 2px; transition: transform .3s, opacity .3s; }
.hamburger.open .ham-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open .ham-line:nth-child(2) { opacity: 0; }
.hamburger.open .ham-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* MOBILE DRAWER */
.mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 950; }
.mobile-overlay.open { display: block; }
.mobile-drawer { position: fixed; top: 0; right: 0; width: 300px; height: 100vh; background: var(--bg2); z-index: 1000; transform: translateX(100%); transition: transform .3s; display: flex; flex-direction: column; overflow-y: auto; }
.mobile-drawer.open { transform: none; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.drawer-logo { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; }
.drawer-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--fg2); }
.drawer-links { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: .25rem; flex: 1; }
.drawer-links a { color: var(--fg); text-decoration: none; padding: .65rem 0; font-weight: 500; border-bottom: 1px solid var(--border); transition: color .2s; }
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
.fp-color.active { border-color: var(--fg); }
.fp-font-opt { padding: .75rem; border: 1.5px solid var(--border); border-radius: 10px; cursor: pointer; margin-bottom: .5rem; transition: border-color .2s, background .2s; }
.fp-font-opt.active { border-color: var(--accent); background: var(--accent-lt); }
.fp-font-opt:hover { border-color: var(--accent); }
.fopt-name { font-size: .78rem; font-weight: 700; color: var(--fg3); margin-bottom: .3rem; }
.fopt-preview { font-size: 1.1rem; font-weight: 700; color: var(--fg); margin-bottom: .4rem; }
.fopt-hint { font-size: .72rem; color: var(--fg3); line-height: 1.5; }

/* HERO */
.hero { min-height: 100vh; display: flex; align-items: center; padding: 7rem 2rem 4rem; position: relative; overflow: hidden; }
.hero-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 60px 60px; opacity: .35; }
.hero-glow { position: absolute; top: -20%; left: -10%; width: 60%; height: 60%; background: radial-gradient(ellipse, var(--accent-lt) 0%, transparent 65%); pointer-events: none; }
.hero-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; z-index: 1; width: 100%; }
.hero-pill { display: inline-flex; align-items: center; gap: .5rem; background: var(--accent-lt); border: 1px solid var(--accent); color: var(--accent); padding: .35rem .9rem; border-radius: 999px; font-size: .8rem; font-weight: 600; margin-bottom: 1.5rem; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: pulse 1.8s infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
.hero-h1 { font-family: var(--font-display); font-size: clamp(2.8rem, 5.5vw, 4.5rem); font-weight: 800; line-height: 1.05; color: var(--fg); margin-bottom: 1.25rem; }
.hero-h1 .hl { color: var(--accent); }
.hero-chip { display: inline-block; background: var(--accent); color: #fff; font-size: .7rem; padding: .2rem .5rem; border-radius: 4px; vertical-align: middle; margin-left: .5rem; font-family: var(--font-body); }
.hero-desc { color: var(--fg2); font-size: 1.05rem; max-width: 480px; margin-bottom: 2rem; line-height: 1.7; }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
.btn-primary { background: var(--accent); color: #fff; border: none; padding: .75rem 1.6rem; border-radius: 10px; font-size: .95rem; font-weight: 600; cursor: pointer; font-family: var(--font-body); transition: background .2s, transform .15s, box-shadow .2s; }
.btn-primary:hover { background: var(--accent-dk); transform: translateY(-2px); box-shadow: var(--shadow-bl); }
.btn-outline { background: none; border: 1.5px solid var(--border); color: var(--fg); padding: .73rem 1.5rem; border-radius: 10px; font-size: .95rem; font-weight: 500; cursor: pointer; font-family: var(--font-body); transition: border-color .2s, color .2s; }
.btn-outline:hover { border-color: var(--accent); color: var(--accent); }
.hero-trust { display: flex; align-items: center; gap: .75rem; }
.trust-avs { display: flex; }
.t-av { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--bg2); margin-left: -8px; object-fit: cover; }
.t-av:first-child { margin-left: 0; }
.trust-txt { font-size: .85rem; color: var(--fg2); }
.trust-txt strong { color: var(--fg); }

.hero-img-wrap { position: relative; }
.hero-main-img { width: 100%; border-radius: 20px; object-fit: cover; height: 400px; box-shadow: 0 24px 64px rgba(0,0,0,.18); }
.hfloat { position: absolute; background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 1rem 1.25rem; box-shadow: 0 8px 32px rgba(0,0,0,.12); min-width: 180px; }
.hf1 { bottom: -20px; left: -30px; }
.hf2 { top: -15px; right: -20px; }
.hf-tag { font-size: .7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--fg3); }
.hf-val { font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--accent); }
.hf-sub { font-size: .72rem; color: var(--fg3); margin-bottom: .4rem; }
.hf-badge { display: inline-block; background: #16a34a22; color: #16a34a; font-size: .7rem; font-weight: 600; padding: .2rem .6rem; border-radius: 4px; margin-bottom: .5rem; }
.hf-bar-wrap { margin-top: .35rem; }
.hf-bar { height: 6px; background: var(--bg3); border-radius: 3px; margin-top: .4rem; overflow: hidden; }
.hf-fill { height: 100%; width: 76%; background: var(--accent); border-radius: 3px; }

/* TICKER */
.ticker-wrap { background: var(--accent); overflow: hidden; padding: .6rem 0; }
.ticker { display: flex; gap: 0; animation: marquee 28s linear infinite; white-space: nowrap; }
.t-item { display: inline-flex; align-items: center; gap: .6rem; padding: 0 2rem; font-size: .82rem; font-weight: 600; color: #fff; letter-spacing: .04em; }
.t-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.5); }
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* CLIENTS */
.clients { padding: 2rem 2rem; border-bottom: 1px solid var(--border); }
.clients-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; }
.clients-lbl { font-size: .78rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--fg3); white-space: nowrap; }
.clients-logos { display: flex; gap: 1.75rem; flex-wrap: wrap; align-items: center; }
.clogo { font-family: var(--font-display); font-weight: 800; font-size: .85rem; color: var(--fg3); letter-spacing: .05em; transition: color .2s; cursor: default; }
.clogo:hover { color: var(--accent); }

/* SECTIONS */
.section-wrap { max-width: 1200px; margin: 0 auto; padding: 5rem 2rem; }
.sec-tag { display: inline-block; background: var(--accent-lt); color: var(--accent); font-size: .75rem; font-weight: 700; padding: .3rem .8rem; border-radius: 999px; text-transform: uppercase; letter-spacing: .06em; margin-bottom: .75rem; border: 1px solid var(--accent); }
.sec-h { font-family: var(--font-display); font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: var(--fg); line-height: 1.15; margin-bottom: 1rem; }
.sec-h .hl { color: var(--accent); }
.desc { color: var(--fg2); line-height: 1.75; }

/* SERVICES */
.services { background: var(--bg); }
.svc-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
.svc-top-desc { color: var(--fg2); font-size: .95rem; margin-top: .5rem; max-width: 500px; }
.svc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
.svc-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: transform .3s, box-shadow .3s, opacity .4s; opacity: 0; transform: translateY(24px); }
.svc-card.vis { opacity: 1; transform: none; }
.svc-img { width: 100%; height: 160px; object-fit: cover; }
.svc-tag-pill { display: inline-block; margin: .9rem 1rem .3rem; padding: .2rem .65rem; border-radius: 999px; font-size: .7rem; font-weight: 700; }
.tp-sky { background: #0ea5e922; color: #0ea5e9; }
.tp-blue { background: #3b82f622; color: #3b82f6; }
.tp-amber { background: #f9731622; color: #f97316; }
.tp-green { background: #10b98122; color: #10b981; }
.svc-icon { font-size: 1.75rem; padding: .1rem 1rem; }
.svc-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin: .35rem 1rem .5rem; color: var(--fg); }
.svc-desc { font-size: .875rem; color: var(--fg2); padding: 0 1rem; line-height: 1.65; }
.svc-link { display: inline-block; margin: .75rem 1rem 1.25rem; font-size: .82rem; font-weight: 600; color: var(--accent); text-decoration: none; }
.svc-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-bl); }

/* NUMBERS */
.numbers { background: var(--num-bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.num-item { text-align: center; padding: 3rem 1.5rem; border-right: 1px solid var(--border); }
.num-item:last-child { border-right: none; }
.num-val { font-family: var(--font-display); font-size: 2.6rem; font-weight: 800; color: var(--accent); }
.num-lbl { font-size: .82rem; color: var(--fg2); margin-top: .4rem; line-height: 1.4; }

/* ABOUT */
.about { background: var(--bg2); }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.about-img-col { position: relative; }
.about-tag-strip { display: inline-block; background: var(--accent); color: #fff; font-size: .75rem; font-weight: 700; padding: .3rem .8rem; border-radius: 4px; margin-bottom: .75rem; }
.about-main-img { width: 100%; border-radius: 20px; object-fit: cover; height: 480px; }
.about-badge { position: absolute; bottom: -16px; right: -16px; background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 1rem 1.25rem; box-shadow: 0 8px 32px rgba(0,0,0,.12); text-align: center; }
.ab-num { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--accent); }
.ab-txt { font-size: .7rem; color: var(--fg3); max-width: 120px; line-height: 1.4; }
.about-feats { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.25rem 0; }
.feat { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--accent); font-size: .78rem; font-weight: 600; padding: .3rem .75rem; border-radius: 6px; }

/* PROCESS */
.process { background: var(--bg); }
.proc-head { margin-bottom: 2.5rem; }
.proc-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
.pstep { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; opacity: 0; transform: translateY(20px); transition: opacity .4s, transform .4s; }
.pstep.vis { opacity: 1; transform: none; }
.pstep-n { font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--accent); opacity: .35; margin-bottom: .75rem; }
.pstep-title { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; color: var(--fg); margin-bottom: .5rem; }
.pstep-desc { font-size: .875rem; color: var(--fg2); line-height: 1.65; }

/* FLEET */
.fleet { background: var(--bg2); }
.fleet-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.gal-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto; gap: 1rem; }
.gi { position: relative; border-radius: 14px; overflow: hidden; cursor: pointer; }
.gi img { width: 100%; height: 200px; object-fit: cover; transition: transform .4s; display: block; }
.gi.tall { grid-row: span 2; }
.gi.tall img { height: 100%; min-height: 415px; }
.gi:hover img { transform: scale(1.04); }
.gi-tag { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,.55); color: #fff; font-size: .7rem; font-weight: 700; padding: .25rem .6rem; border-radius: 4px; backdrop-filter: blur(6px); }
.gi-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem 1rem .85rem; background: linear-gradient(transparent, rgba(0,0,0,.7)); color: #fff; }
.gi-label h4 { font-size: .9rem; font-weight: 700; }
.gi-label p { font-size: .75rem; opacity: .75; }

/* TRACKING */
.tracking { background: var(--bg); }
.track-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
.track-form { margin-top: 1.5rem; }
.t-input-row { display: flex; gap: .5rem; }
.t-input { flex: 1; padding: .75rem 1rem; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg2); color: var(--fg); font-size: .9rem; font-family: var(--font-body); outline: none; transition: border-color .2s; }
.t-input:focus { border-color: var(--accent); }
.t-btn { background: var(--accent); color: #fff; border: none; padding: .75rem 1.5rem; border-radius: 10px; font-size: .9rem; font-weight: 600; cursor: pointer; font-family: var(--font-body); transition: background .2s; white-space: nowrap; }
.t-btn:hover { background: var(--accent-dk); }
.t-hints { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: .75rem; }
.t-hint { font-size: .75rem; color: var(--fg3); display: flex; align-items: center; gap: .3rem; }
.t-hint::before { content: '✓'; color: #16a34a; font-weight: 700; }
.track-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; }
.tc-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.tc-id { font-family: var(--font-display); font-weight: 700; font-size: 1rem; color: var(--fg); }
.tc-status { font-size: .78rem; font-weight: 600; color: #f97316; }
.tc-route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.tc-city-name { font-weight: 700; color: var(--fg); }
.tc-city-code { font-size: .75rem; color: var(--fg3); }
.tc-arrow { color: var(--accent); font-size: 1.2rem; }
.tl-row { display: flex; align-items: flex-start; gap: .75rem; padding: .6rem 0; border-bottom: 1px solid var(--border); }
.tl-row:last-child { border: none; }
.tl-d { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
.tl-done { background: #16a34a; }
.tl-now { background: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
.tl-pending { background: var(--border); }
.tl-title { font-size: .85rem; font-weight: 500; color: var(--fg); }
.tl-time { font-size: .72rem; color: var(--fg3); margin-top: .15rem; }

/* TESTIMONIALS */
.testimonials { background: var(--bg2); }
.test-head { margin-bottom: 2.5rem; }
.test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.tc-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; opacity: 0; transform: translateY(20px); transition: opacity .4s, transform .4s; }
.tc-card.vis { opacity: 1; transform: none; }
.tc-stars { color: #f59e0b; font-size: 1rem; margin-bottom: .75rem; }
.tc-text { font-size: .9rem; color: var(--fg2); line-height: 1.7; margin-bottom: 1.25rem; }
.tc-author { display: flex; align-items: center; gap: .75rem; }
.tc-av { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.tc-name { font-weight: 600; color: var(--fg); font-size: .875rem; }
.tc-role { font-size: .75rem; color: var(--fg3); }

/* CTA */
.cta-section { background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dk) 100%); padding: 5rem 2rem; text-align: center; }
.cta-inner { max-width: 700px; margin: 0 auto; }
.cta-inner .sec-tag { background: rgba(255,255,255,.2); color: #fff; border-color: rgba(255,255,255,.4); }
.cta-inner .sec-h { color: #fff; }
.cta-inner p { color: rgba(255,255,255,.85); margin-bottom: 2rem; font-size: 1rem; }
.cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-w { background: #fff; color: var(--accent); border: none; padding: .75rem 1.75rem; border-radius: 10px; font-size: .95rem; font-weight: 700; cursor: pointer; font-family: var(--font-body); transition: transform .15s, box-shadow .2s; }
.btn-w:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.15); }
.btn-wg { background: rgba(255,255,255,.15); color: #fff; border: 1.5px solid rgba(255,255,255,.5); padding: .73rem 1.6rem; border-radius: 10px; font-size: .95rem; font-weight: 600; cursor: pointer; font-family: var(--font-body); transition: background .2s; }
.btn-wg:hover { background: rgba(255,255,255,.25); }

/* FOOTER */
footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 4rem 2rem 2rem; }
.f-top { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr repeat(3, 1fr); gap: 3rem; margin-bottom: 3rem; }
.f-brand-logo { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--fg); display: block; margin-bottom: .75rem; }
.f-brand p { font-size: .85rem; color: var(--fg3); line-height: 1.65; margin-bottom: 1.25rem; max-width: 240px; }
.f-socs { display: flex; gap: .5rem; }
.f-soc { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); font-size: .75rem; font-weight: 700; color: var(--fg2); text-decoration: none; transition: border-color .2s, color .2s; }
.f-soc:hover { border-color: var(--accent); color: var(--accent); }
.f-col h4 { font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--fg3); margin-bottom: 1rem; }
.f-links { list-style: none; display: flex; flex-direction: column; gap: .5rem; }
.f-links a { font-size: .85rem; color: var(--fg2); text-decoration: none; transition: color .2s; }
.f-links a:hover { color: var(--accent); }
.f-bottom { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding-top: 2rem; border-top: 1px solid var(--border); flex-wrap: wrap; gap: .5rem; }
.f-bottom p { font-size: .78rem; color: var(--fg3); }

/* FAB */
.fab { position: fixed; bottom: 2rem; right: 2rem; width: 52px; height: 52px; border-radius: 50%; background: var(--accent); color: #fff; border: none; font-size: 1.3rem; cursor: pointer; box-shadow: var(--shadow-bl); z-index: 800; transition: transform .2s; }
.fab:hover { transform: scale(1.1); }

/* REVEAL */
.reveal { opacity: 0; transform: translateY(20px); transition: opacity .5s, transform .5s; }
.reveal.vis { opacity: 1; transform: none; }

/* RESPONSIVE */
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-right { display: none; }
  .about-grid { grid-template-columns: 1fr; }
  .track-grid { grid-template-columns: 1fr; }
  .gal-grid { grid-template-columns: repeat(2, 1fr); }
  .gi.tall { grid-row: span 1; }
  .gi.tall img { min-height: 200px; height: 200px; }
  .f-top { grid-template-columns: 1fr 1fr; }
  .nav-links, .nav-right > *:not(.hamburger) { display: none; }
  .hamburger { display: flex; }
  .f-top { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .numbers { grid-template-columns: 1fr 1fr; }
  .num-item { border-right: none; border-bottom: 1px solid var(--border); }
  .gal-grid { grid-template-columns: 1fr; }
  .hero { padding: 6rem 1.25rem 3rem; }
  .section-wrap { padding: 3.5rem 1.25rem; }
}
`;

/* ─── COUNT UP NUMBER ─── */
function AnimatedNumber({ target, suffix }) {
  const [ref, inView] = useInView(0.4);
  const val = useCountUp(target, inView);
  return (
    <div className="num-val" ref={ref}>
      {val.toLocaleString()}<span className="suf">{suffix}</span>
    </div>
  );
}

/* ─── REVEAL WRAPPER ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} className={`reveal ${inView ? "vis" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── ANIMATED CARD ─── */
function AnimCard({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} className={`${className} ${inView ? "vis" : ""}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function HomeWrapper() {
  const d = SITE_DATA;
  const [theme, setTheme] = useState(() => localStorage.getItem("vf-theme") || "light");
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
    document.documentElement.style.setProperty("--font-display", `'${DISPLAY_FONTS[activeDisplayFont].font}', sans-serif`);
  }, [activeDisplayFont]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-body", `'${BODY_FONTS[activeBodyFont].font}', sans-serif`);
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
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroActive(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tickerItems = d.ticker.map((t, i) => (
    <span className="t-item" key={i}><span className="t-dot"></span>{t}</span>
  ));

  return (
    <>
      <style>{CSS}</style>

      {/* FONT PANEL */}
      <div className={`font-panel ${fontPanelOpen ? "open" : ""}`}>
        <div className="fp-header">
          <div className="fp-title">{d.meta.fpTitle}</div>
          <button className="fp-close" onClick={() => setFontPanelOpen(false)}>✕</button>
        </div>
        <div className="fp-body">
          <div>
            <div className="fp-section-label">{d.meta.fpColorLabel}</div>
            <div className="fp-colors">
              {ACCENT_COLORS.map((ac, i) => (
                <div key={i} className={`fp-color ${activeAccent === i ? "active" : ""}`}
                  style={{ background: ac.color }} title={ac.title}
                  onClick={() => setActiveAccent(i)} />
              ))}
            </div>
          </div>
          <div>
            <div className="fp-section-label">{d.meta.fpDisplayLabel}</div>
            {DISPLAY_FONTS.map((f, i) => (
              <div key={i} className={`fp-font-opt ${activeDisplayFont === i ? "active" : ""}`}
                onClick={() => setActiveDisplayFont(i)}>
                <div className="fopt-name">{f.font}</div>
                <div className="fopt-preview" style={{ fontFamily: `'${f.font}', sans-serif`, fontWeight: 800 }}>Global Logistics</div>
                <div className="fopt-hint">{f.hint}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="fp-section-label">{d.meta.fpBodyLabel}</div>
            {BODY_FONTS.map((f, i) => (
              <div key={i} className={`fp-font-opt ${activeBodyFont === i ? "active" : ""}`}
                onClick={() => setActiveBodyFont(i)}>
                <div className="fopt-name">{f.font}</div>
                <div className="fopt-preview" style={{ fontFamily: `'${f.font}', sans-serif`, fontSize: ".9rem", fontWeight: 400 }}>Fast, reliable, global delivery solutions for every business.</div>
                <div className="fopt-hint">{f.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <div className={`mobile-overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-logo">{d.nav.brandShort}<span style={{ opacity: .45 }}> Solutions</span></div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className="drawer-links">
          {d.nav.drawerLinks.map((l, i) => (
            <a key={i} href={l.href} onClick={() => setDrawerOpen(false)}>{l.label}</a>
          ))}
        </div>
        <div className="drawer-actions">
          <div className="drawer-settings">
            <span className="drawer-settings-lbl">{d.meta.themeLabel}</span>
            <button className="theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} />
          </div>
          <button className="drawer-font-btn" onClick={() => { setFontPanelOpen(true); setDrawerOpen(false); }}>
            <span>Aa</span> <span>{d.meta.drawerFontBtnText}</span>
          </button>
          <button className="btn-cta" style={{ width: "100%", padding: ".75rem", justifyContent: "center", display: "flex" }}>
            {d.nav.drawerCta}
          </button>
        </div>
      </div>

      {/* NAV */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">
          <span>{d.nav.brand}</span>
          <div className="dot"></div>
        </a>
        <div className="nav-links">
          {d.nav.links.map((l, i) => <a key={i} href={l.href}>{l.label}</a>)}
        </div>
        <div className="nav-right">
          <button className="font-btn" onClick={() => setFontPanelOpen(p => !p)}>
            <span>Aa</span> <span>{d.meta.fontBtnText}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: ".55rem" }}>
            <span className="theme-icon">☀️</span>
            <button className="theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} />
            <span className="theme-icon">🌙</span>
          </div>
          <button className="btn-ghost">{d.nav.login}</button>
          <a href="#cta" className="btn-cta">{d.nav.cta}</a>
          <button className={`hamburger ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(true)}>
            <span className="ham-line" /><span className="ham-line" /><span className="ham-line" />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero-section">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-pill"><span className="live-dot" />{d.hero.pill}</div>
            <h1 className="hero-h1">
              {d.hero.titleLine1}<br />
              <span className="hl">{d.hero.titleLine2Hl}</span><br />
              {d.hero.titleLine3}<span className="hero-chip">{d.hero.chip}</span>
            </h1>
            <p className="hero-desc">{d.hero.description}</p>
            <div className="hero-actions">
              <button className="btn-primary">{d.hero.cta1}</button>
              <button className="btn-outline">{d.hero.cta2}</button>
            </div>
            <div className="hero-trust">
              <div className="trust-avs">
                {d.hero.trust.avatars.map((src, i) => <img key={i} className="t-av" src={src} alt="" />)}
              </div>
              <div className="trust-txt"><strong>{d.hero.trust.count}</strong> {d.hero.trust.label}</div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-img-wrap">
              <img className="hero-main-img" src={d.hero.image} alt="Operations" />
              <div className="hfloat hf1">
                <div className="hf-tag">{d.hero.statCard1.label}</div>
                <div className="hf-val">{heroActive ? shipVal.toLocaleString() : "0"}</div>
                <div className="hf-sub">{d.hero.statCard1.sub}</div>
                <div className="hf-badge">{d.hero.statCard1.badge}</div>
                <div className="hf-bar-wrap">
                  <div className="hf-tag" style={{ marginTop: ".55rem" }}>{d.hero.statCard1.capacityLabel}</div>
                  <div className="hf-bar"><div className="hf-fill" /></div>
                </div>
              </div>
              <div className="hfloat hf2">
                <div className="hf-tag">{d.hero.statCard2.label}</div>
                <div className="hf-val">{heroActive ? pctVal + "%" : "0%"}</div>
                <div className="hf-sub">{d.hero.statCard2.sub}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker">{tickerItems}{tickerItems}</div>
      </div>

      {/* CLIENTS */}
      <div className="clients">
        <div className="clients-inner">
          <span className="clients-lbl">{d.clients.label}</span>
          <div className="clients-logos">
            {d.clients.logos.map((l, i) => <div key={i} className="clogo">{l}</div>)}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="services">
        <div className="section-wrap">
          <div className="svc-top reveal">
            <div>
              <div className="sec-tag">{d.services.sectionTag}</div>
              <h2 className="sec-h">{d.services.heading.replace(d.services.headingHl,
                `<HL>${d.services.headingHl}</HL>`)
                .split("<HL>").map((part, i) =>
                  i === 0 ? part : part.split("</HL>").map((p, j) =>
                    j === 0 ? <span key={j} className="hl">{p}</span> : p
                  )
                )}</h2>
              <p className="svc-top-desc">{d.services.description}</p>
            </div>
            <a href="#" className="btn-outline">All Services →</a>
          </div>
          <div className="svc-grid">
            {d.services.items.map((s, i) => (
              <AnimCard key={i} className="svc-card" delay={i * 0.07}>
                <img className="svc-img" src={s.image} alt={s.title} />
                <span className={`svc-tag-pill ${s.tagClass}`}>{s.tag}</span>
                <div className="svc-icon">{s.icon}</div>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-desc">{s.description}</p>
                <a href="#" className="svc-link">{d.services.learnMoreText}</a>
              </AnimCard>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <div className="numbers">
        {d.numbers.map((n, i) => (
          <div key={i} className="num-item">
            <AnimatedNumber target={n.value} suffix={n.suffix} />
            <div className="num-lbl">{n.label}</div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="section-wrap">
          <div className="about-grid">
            <div className="about-img-col">
              <div className="about-tag-strip">{d.about.tagStrip}</div>
              <img className="about-main-img" src={d.about.image} alt="About" />
              <div className="about-badge">
                <div className="ab-num">{d.company.rating}</div>
                <div className="ab-txt">{d.company.ratingLabel}</div>
              </div>
            </div>
            <div className="about-content">
              <Reveal><div className="sec-tag">{d.about.sectionTag}</div></Reveal>
              <Reveal delay={0.1}><h2 className="sec-h">{d.about.title}<br /><span className="hl">{d.about.titleHl}</span></h2></Reveal>
              <Reveal delay={0.2}><p className="desc" style={{ marginBottom: ".75rem" }}>{d.about.p1}</p></Reveal>
              <Reveal delay={0.25}><p className="desc">{d.about.p2}</p></Reveal>
              <Reveal delay={0.3}>
                <div className="about-feats">
                  {d.about.features.map((f, i) => <div key={i} className="feat">{f}</div>)}
                </div>
              </Reveal>
              <Reveal delay={0.35}><a href="#" className="btn-primary">{d.about.cta}</a></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="process">
        <div className="section-wrap">
          <Reveal className="proc-head">
            <div className="sec-tag">{d.process.sectionTag}</div>
            <h2 className="sec-h">{d.process.heading} <span className="hl">{d.process.headingHl}</span></h2>
          </Reveal>
          <div className="proc-steps">
            {d.process.steps.map((p, i) => (
              <AnimCard key={i} className="pstep" delay={i * 0.1}>
                <div className="pstep-n">{p.num}</div>
                <h3 className="pstep-title">{p.title}</h3>
                <p className="pstep-desc">{p.desc}</p>
              </AnimCard>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section id="fleet" className="fleet">
        <div className="section-wrap">
          <div className="fleet-head">
            <div>
              <div className="sec-tag">{d.fleet.sectionTag}</div>
              <h2 className="sec-h">{d.fleet.heading} <span className="hl">{d.fleet.headingHl}</span></h2>
            </div>
            <button className="btn-outline">{d.fleet.cta}</button>
          </div>
          <div className="gal-grid">
            {d.fleet.items.map((f, i) => (
              <div key={i} className={`gi ${f.tall ? "tall" : ""}`}>
                <img src={f.image} alt={f.title} />
                <div className="gi-tag">{f.tag}</div>
                <div className="gi-label"><h4>{f.title}</h4><p>{f.sub}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKING */}
      <section id="tracking" className="tracking">
        <div className="section-wrap">
          <div className="track-grid">
            <Reveal>
              <div className="sec-tag">{d.tracking.sectionTag}</div>
              <h2 className="sec-h">{d.tracking.heading}<br /><span className="hl">{d.tracking.headingHl}</span></h2>
              <p style={{ color: "var(--fg2)", marginTop: ".75rem" }}>{d.tracking.description}</p>
              <div className="track-form">
                <div className="t-input-row">
                  <input className="t-input" type="text" placeholder={d.tracking.inputPlaceholder}
                    value={trackVal} onChange={e => setTrackVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleTrack()} />
                  <button className="t-btn"
                    style={trackState === "found" ? { background: "#16a34a" } : {}}
                    onClick={handleTrack}>
                    {trackState === "found" ? d.tracking.btnFound : d.tracking.btnText}
                  </button>
                </div>
                <div className="t-hints">
                  {d.tracking.hints.map((h, i) => <span key={i} className="t-hint">{h}</span>)}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="track-card">
                <div className="tc-hdr">
                  <div className="tc-id">{d.tracking.demo.id}</div>
                  <div className="tc-status">{d.tracking.demo.status}</div>
                </div>
                <div className="tc-route">
                  <div className="tc-city">
                    <div className="tc-city-name">{d.tracking.demo.from}</div>
                    <div className="tc-city-code">{d.tracking.demo.fromCode}</div>
                  </div>
                  <div className="tc-arrow">→</div>
                  <div className="tc-city" style={{ textAlign: "right" }}>
                    <div className="tc-city-name">{d.tracking.demo.to}</div>
                    <div className="tc-city-code">{d.tracking.demo.toCode}</div>
                  </div>
                </div>
                <div>
                  {d.tracking.demo.timeline.map((t, i) => (
                    <div key={i} className="tl-row">
                      <div className={`tl-d tl-${t.status}`} />
                      <div>
                        <div className="tl-title">{t.title}</div>
                        <div className="tl-time">{t.time}</div>
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
      <section id="testimonials" className="testimonials">
        <div className="section-wrap">
          <Reveal className="test-head">
            <div className="sec-tag">{d.testimonials.sectionTag}</div>
            <h2 className="sec-h">{d.testimonials.heading} <span className="hl">{d.testimonials.headingHl}</span></h2>
          </Reveal>
          <div className="test-grid">
            {d.testimonials.items.map((t, i) => (
              <AnimCard key={i} className="tc-card" delay={i * 0.1}>
                <div className="tc-stars">{t.stars}</div>
                <p className="tc-text">"{t.text}"</p>
                <div className="tc-author">
                  <img className="tc-av" src={t.avatar} alt={t.name} />
                  <div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-role">{t.role}</div>
                  </div>
                </div>
              </AnimCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta-section">
        <div className="cta-inner">
          <div className="sec-tag">{d.cta.sectionTag}</div>
          <h2 className="sec-h">{d.cta.title}<br /><span style={{ opacity: .85 }}>{d.cta.titleHl}</span></h2>
          <p>{d.cta.description}</p>
          <div className="cta-btns">
            <button className="btn-w">{d.cta.cta1}</button>
            <button className="btn-wg">{d.cta.cta2} {d.company.phone}</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="f-top">
          <div className="f-brand">
            <span className="f-brand-logo">{d.footer.logo}</span>
            <p>{d.footer.tagline}</p>
            <div className="f-socs">
              {d.footer.socials.map((s, i) => <a key={i} href={s.url} className="f-soc">{s.label}</a>)}
            </div>
          </div>
          {d.footer.columns.map((col, i) => (
            <div key={i} className="f-col">
              <h4>{col.heading}</h4>
              <ul className="f-links">
                {col.links.map(([label, url], j) => <li key={j}><a href={url}>{label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="f-bottom">
          <p>{d.footer.copyright}</p>
          <p>{d.footer.legal}</p>
        </div>
      </footer>

      {/* FAB */}
      <button className="fab">{d.meta.fabIcon}</button>
    </>
  );
}