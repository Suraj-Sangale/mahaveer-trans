"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import styles from "@/styles/service.module.css";
import { getConstant } from "@/utilities/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { scrollSectionIntoView } from "@/utilities/utils";
import dynamic from "next/dynamic";
import CommonModal from "@/components/common/commonModal";
import Link from "next/link";

const IndiaMap = dynamic(() => import("./IndiaMap"), { ssr: false });

/* ════════════════════════════════
   MASTER DATA OBJECT
   (mirrors the original PAGE object — zero hardcoded strings in JSX)
════════════════════════════════ */
const PAGE = {
  meta: { title: `Services — ${getConstant("company_name_short")}` },

  nav: {
    logoPrefix: "Mahaveer",
    logoSuffix: "Trans",
    links: [
      { label: "Home", href: "index.html" },
      { label: "Services", href: "services.html", active: true },
      { label: "Fleet", href: "fleet.html" },
      { label: "Track", href: "tracking.html" },
      { label: "About", href: "about.html" },
      { label: "Contact", href: "contact.html" },
    ],
    loginBtn: "Log in",
    quoteBtn: "Get Quote →",
    themeLabel: "☀️ / 🌙 Theme",
    drawerCta: "Get Free Quote →",
  },

  breadcrumb: [
    { label: "Home", href: "index.html" },
    { label: "Services", href: "services.html", current: true },
  ],

  hero: {
    tag: "Our Capabilities",
    headingPart1: "Every Route.",
    headingHl: "One Partner.",
    description:
      "From express air cargo to bulk road freight, cold-chain pharmaceuticals to last-mile urban delivery — MahaveerTrans covers every corner of India with reliable, tech-driven logistics backed by 25 years of expertise.",
    stats: [
      { value: "12,400", suffix: "+", label: "Monthly Shipments" },
      { value: "99", suffix: "%", label: "On-time Rate" },
      { value: "28", suffix: "+", label: "States Served" },
      { value: "24", suffix: "/7", label: "Live Support" },
    ],
  },

  ticker: [
    "Road Transport",
    "FTL Transportation",
    "LTL Transportation",
    "Factory to Foundation",
    "Heavy Machinery Transport",
    "Full Truck Load",
    "Warehousing & 3PL",
    "Project Cargo & ODC",
    "Part Load Transport",
    "Pan-India Network",
    "Same-Day Dispatch",
  ],

  servicesList: {
    tag: "What We Offer",
    headingPart1: "Our Core",
    headingHl: "Service Lines",
    description:
      "Filter by category to explore the right solution for your shipment type, project requirement, or transport need.",
    learnMore: "Learn more →",
    priceFrom: "From ₹",
    filters: [
      { id: "all", label: "All Services", dot: "#0ea5e9" },
      { id: "f2f", label: "Factory to Foundation", dot: "#f59e0b" },
      { id: "ftl", label: "Full Truck Load", dot: "#1d4ed8" },
      { id: "ltl", label: "Part Load", dot: "#0ea5e9" },
      { id: "heavy", label: "Heavy Machinery", dot: "#16a34a" },
      { id: "wh", label: "Warehousing", dot: "#dc2626" },
    ],
    items: [
      {
        id: "f2f",
        tag: "Primary Service",
        tagClass: "tpAmber",
        icon: "🏗️",
        title: "Factory to Foundation Logistics",
        description:
          "We provide factory to Foundation Logistics service. Factory to foundation logistics refers to the comprehensive process of transporting industrial equipment and components from the manufacturing facility to their final installation site, often a construction or industrial project location. This type of logistics is crucial for large-scale industrial projects and involves several stages and detailed planning to ensure the safe and efficient delivery and installation of the equipment.",
        features: [
          "End-to-end site delivery & foundation placement",
          "Route survey, obstacle & feasibility assessment",
          "Multi-axle hydraulic trailers & heavy cranes",
          "Turnkey project cargo management pan-India",
        ],
        price: "Custom",
        unit: "project quote",
        image:
          "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=700&q=80&auto=format&fit=crop",
      },
      {
        id: "ftl",
        tag: "FTL",
        tagClass: "tpBlue",
        icon: "🚛",
        title: "Full Truck Load",
        description:
          "Dedicated trucks for businesses requiring complete vehicle capacity for secure, direct, and efficient long-distance transportation across India.",
        features: [
          "Dedicated point-to-point direct transit",
          "500+ GPS-enabled commercial vehicles",
          "Real-time tracking & route optimization",
          "Guaranteed dispatch & zero transshipment risk",
        ],
        price: "12,000",
        unit: "per trip",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop",
      },
      {
        id: "ltl",
        tag: "LTL",
        tagClass: "tpSky",
        icon: "📦",
        title: "Part Load Transport",
        description:
          "Cost-effective transportation for smaller shipments by efficiently utilizing available truck capacity with scheduled dispatches.",
        features: [
          "Cost-effective shared capacity pricing",
          "Regular scheduled departures across major corridors",
          "Safe consolidation & careful parcel handling",
          "Door-to-door pickup and delivery options",
        ],
        price: "499",
        unit: "per quintal",
        image: "/images/vehicale/semibed.png",
      },
      {
        id: "heavy",
        tag: "Heavy Transport",
        tagClass: "tpGreen",
        icon: "🚜",
        title: "Heavy Machinery Transportation Service",
        description:
          "Specialized transportation for heavy equipment, industrial machinery, and oversized loads with proper safety protocols and handling across Maharashtra and pan-India.",
        features: [
          "ODC & over-dimensional cargo expertise",
          "Low-bed, semi-bed, and hydraulic modular axles",
          "Transit permissions, escort & route clearances",
          "Experienced rigging and securing operators",
        ],
        price: "Custom",
        unit: "per load",
        image: "/images/gallery/img (7).jpeg",
      },
      {
        id: "wh",
        tag: "Warehousing / 3PL",
        tagClass: "tpRed",
        icon: "🏭",
        title: "Warehousing & Distribution",
        description:
          "Flexible warehousing, storage, inventory distribution, and dispatch support to simplify and streamline your supply chain operations.",
        features: [
          "Secure, modern warehousing & storage facilities",
          "Systematic inventory management & tracking",
          "Fast pick, pack, labeling & order processing",
          "Integrated local and regional dispatch network",
        ],
        price: "18",
        unit: "per sq.ft/month",
        image:
          "https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&q=80&auto=format&fit=crop",
      },
    ],
  },

  process: {
    tag: "How It Works",
    headingPart1: "From Enquiry to",
    headingHl: "Delivery",
    description:
      "Our streamlined 4-step process keeps you informed and in control from the moment you raise a booking to the final proof of delivery.",
    steps: [
      {
        num: "01",
        icon: "📋",
        title: "Request a Quote",
        desc: "Submit shipment details online or via API. Our system returns an instant AI-generated quote in under 60 seconds.",
      },
      {
        num: "02",
        icon: "🗺️",
        title: "Route Planning",
        desc: "Our logistics team and AI engine select the optimal carrier, route, and transit time based on your SLA and budget.",
      },
      {
        num: "03",
        icon: "🚀",
        title: "Pickup & In-Transit",
        desc: "Scheduled pickup confirmed via SMS. Real-time tracking activates from first scan. Your ops team gets a live dashboard link.",
      },
      {
        num: "04",
        icon: "✅",
        title: "Delivered & Closed",
        desc: "Photo POD, e-signature, and digital invoice generated automatically. Dispute window: 72 hours.",
      },
    ],
  },

  numbers: [
    { value: 12400, suffix: "+", label: "Monthly shipments" },
    { value: 99, suffix: "%", label: "On-time delivery" },
    { value: 28, suffix: "+", label: "States served across India" },
    { value: 3, suffix: "M sqft", label: "Warehouse space" },
  ],

  coverage: {
    tag: "Pan-India Network",
    headingPart1: "We Operate Across",
    headingHl: "All Indian States",
    description:
      "Our logistics network covers every major state and union territory in India. Whether you're shipping from a factory in Pune to a retailer in Delhi, or moving cargo from Mumbai to Chennai — we have dedicated lanes, warehouses, and local agents across the country.",
    image:
      "https://images.unsplash.com/photo-1619392553201-3d9ab3169271?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badgeVal: "28+",
    badgeLbl: "States & UTs in active network",
    cta: "View Coverage Map →",
    regions: [
      { name: "Maharashtra", dot: "#dc2626" },
      { name: "Hyderabad", dot: "#26dc5dff" },
      { name: "Chennai", dot: "#0ea5e9" },
      { name: "Bangalore", dot: "#16a34a" },
      { name: "Vijayawada", dot: "#f59e0b" },
      { name: "Visakhapatnam", dot: "#1d4ed8" },
      { name: "Tamil Nadu", dot: "#7c3aed" },
      { name: "Karnataka", dot: "#dc2626" },
    ],
  },

  comparison: {
    tag: "Compare Options",
    headingPart1: "Find the Right",
    headingHl: "Service for You",
    description:
      "Not sure which service fits your shipment? Use this quick comparison to match your requirements within India.",
    headers: [
      "Feature",
      "Full Truck Load ★",
      "Part Load (LTL)",
      "Heavy Machinery",
      "Factory to Foundation",
    ],
    highlightCol: 1,
    rows: [
      {
        feature: "Transit Time",
        vals: ["1–3 days (Direct)", "2–5 days (Hubs)", "Scheduled / SLA", "Project Milestones"],
      },
      { feature: "Cost Efficiency", vals: ["Dedicated Full Vehicle", "Shared / Economical", "Specialized Project", "Turnkey End-to-End"] },
      {
        feature: "Capacity",
        vals: ["Up to 35 Tonnes", "10 kg – 10 Tonnes", "Over-Dimensional (ODC)", "Plant Equipment & ODC"],
      },
      { feature: "Tracking", vals: ["✓ GPS Live", "✓ GPS Live", "✓ Dedicated Escort", "✓ Live Project Ops"] },
      { feature: "Door-to-Door", vals: ["✓ Direct Route", "✓ Regular Route", "✓ Site Placement", "✓ Foundation Delivery"] },
      { feature: "Pan-India Cover", vals: ["✓ All States", "✓ Major Corridors", "✓ Pan-India & MH", "✓ Nationwide"] },
      {
        feature: "Min. Volume",
        vals: ["Full truck", "10 kg", "Single consignment", "Complete project"],
      },
    ],
    highlightBadge: "Most Popular",
  },

  industries: {
    tag: "Industries We Serve",
    headingPart1: "Built for",
    headingHl: "Your Sector",
    description:
      "Specialised solutions for the unique compliance, timing, and scale needs of each industry.",
    items: [
      {
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f48a.svg",
        name: "Pharmaceuticals",
        desc: "GDP-certified cold chain, track & trace, tamper-evident sealing",
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6d2.svg",
        name: "E-Commerce",
        desc: "Same-day dispatch, returns management, API integration",
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f33e.svg",
        name: "Agriculture",
        desc: "Reefer trucks, port-side cold storage, phytosanitary docs",
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f697.svg",
        name: "Automotive",
        desc: "JIT delivery, plant-to-plant, oversized parts handling",
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f455.svg",
        name: "Apparel",
        desc: "Bonded warehousing, pre-retail tagging, B2C distribution",
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3d7.svg",
        name: "Construction",
        desc: "Heavy haulage, project cargo, permit management",
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4bb.svg",
        name: "Electronics",
        desc: "ESD-safe packaging, anti-static storage, express lanes",
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9ea.svg",
        name: "Chemicals",
        desc: "IMDG-certified, hazmat classification, neutralisation kits",
      },
    ],
  },

  tracking: {
    tag: "Real-Time",
    headingPart1: "Track Any",
    headingHl: "Shipment Live",
    description:
      "Enter any MahaveerTrans tracking number for instant status, location, and ETA — no login required.",
    inputPlaceholder: "e.g. MT-2025-00812",
    btnLabel: "Track Now",
    btnSuccess: "✓ Found!",
    hints: ["No login needed", "Live map view", "SMS / WhatsApp alerts"],
    demo: {
      id: "#MT-2025-00812",
      status: "● In Transit",
      from: "Mumbai",
      fromCode: "MUM · Origin",
      to: "New Delhi",
      toCode: "DEL · Destination",
      timeline: [
        {
          status: "done",
          title: "Picked up from sender",
          time: "Jul 25 · 09:14 AM",
        },
        {
          status: "done",
          title: "Departed Mumbai Warehouse",
          time: "Jul 25 · 02:30 PM",
        },
        {
          status: "now",
          title: "In transit — Nagpur checkpoint",
          time: "Jul 26 · 04:22 AM · Now",
        },
        {
          status: "pending",
          title: "Arriving Delhi Hub",
          time: "Jul 26 · Est. 06:00 PM",
        },
      ],
    },
  },

  testimonials: {
    tag: "Client Stories",
    headingPart1: "Trusted by",
    headingHl: "Industry Leaders",
    cta: "Read All Case Studies →",
    ctaLink: "",
    items: [
      {
        stars: "★★★★★",
        text: "MahaveerTrans's cold chain solution allowed us to launch temperature-sensitive biologics across five new markets in under 6 months. The GDP compliance documentation was flawless.",
        name: "Dr. Ananya Iyer",
        role: "VP Supply Chain, BioNova India",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "We migrated our entire 3PL operation to MahaveerTrans. The WMS API integration took two days, and we saw a 34% reduction in order fulfilment errors within the first quarter.",
        name: "Vikram Nair",
        role: "Head of Operations, StyleKart",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "Our JIT automotive parts supply was always a pain point. MahaveerTrans's dedicated FTL lanes with live tracking gave our plant managers the visibility they needed to eliminate line stoppages.",
        name: "Suresh Patel",
        role: "Logistics Director, AutoFab Ltd.",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop&crop=face",
      },
    ],
  },

  faq: {
    tag: "FAQs",
    headingPart1: "Frequently Asked",
    headingHl: "Questions",
    description:
      "Quick answers to the most common questions about our services, pricing, and process.",
    items: [
      {
        q: "How quickly can I get a quote?",
        a: "For standard domestic shipments, our system returns an instant quote in under 60 seconds. For project cargo or special requirements, a dedicated team member will respond within 2 business hours.",
      },
      {
        q: "Which states and cities do you cover?",
        a: "We cover all 28 states and 8 union territories across India, including major metros like Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and Ahmedabad, plus tier-2 and tier-3 towns.",
      },
      {
        q: "What is the minimum shipment size?",
        a: "For LTL road freight, we accept from 10 kg. Air cargo starts from 0.5 kg. Last mile delivery starts from a single parcel. No minimum for warehousing storage.",
      },
      {
        q: "Is cold chain service available across India?",
        a: "Yes. Our temperature-controlled network spans all major Indian cities with reefer vans, cold storage hubs, and GDP & FSSAI-certified facilities for pharmaceuticals and perishable food.",
      },
      {
        q: "How do I integrate your tracking with my platform?",
        a: "We offer a REST API with full Swagger documentation, webhooks for status events, and pre-built plugins for Shopify, WooCommerce, and SAP. API keys are provisioned within 24 hours of account activation.",
      },
      {
        q: "What insurance options are available?",
        a: "All shipments carry basic carrier liability. We offer additional Cargo Insurance for full replacement value. Pharma and high-value electronics shipments receive specialist coverage.",
      },
    ],
  },

  cta: {
    tag: "Get Started Today",
    headingPart1: "Move Your Cargo",
    headingHl: "Across India",
    description:
      "Talk to a logistics expert in under 5 minutes. No commitment, transparent pricing, and a dedicated account manager from day one.",
    btn1: "Get Free Quote →",
    btn2: `📞 ${getConstant("contact_no_display")}`,
  },

  footer: {
    logo: getConstant("company_name_short"),
    tagline:
      "Delivering India's goods with precision, speed, and care. Your trusted pan-India logistics partner since 1999.",
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
          ["Factory to Foundation", "#services_cards"],
          ["Full Truck Load (FTL)", "#services_cards"],
          ["Part Load Transport (LTL)", "#services_cards"],
          ["Heavy Machinery Transport", "#services_cards"],
          ["Warehousing & Distribution", "#services_cards"],
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
          [`📍 ${getConstant("company_address")}`, "#"],
          [
            `📞 ${getConstant("contact_no_display")}`,
            `tel:${getConstant("contact_no")}`,
          ],
          [
            `✉️ ${getConstant("company_email")}`,
            `mailto:${getConstant("company_email")}`,
          ],
          [`🌐 ${getConstant("company_website")}`, "#"],
        ],
      },
    ],
    copyright: getConstant("company_copyright"),
    footerLinks: "Privacy · Terms · Sitemap",
  },
};

/* Small helper: join CSS-module class names, skipping falsy values */
const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function ServicesWrapper() {
  const D = PAGE;
  const router = useRouter();
  // const { service } = router.query || {};
  const searchParams = useSearchParams();
  const service = searchParams.get("service") || null;

  /* ── UI STATE ── */
  // ── next-themes: global theme from ThemeProvider context ───────────────
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme ?? "light";
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(service || "all");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [trackValue, setTrackValue] = useState("");
  const [trackState, setTrackState] = useState("idle"); // idle | success | error
  const [selectedRegion, setSelectedRegion] = useState(null); // for map focus
  const [mapMode, setMapMode] = useState("street"); // "street" | "satellite"
  const [selectedService, setSelectedService] = useState(null);

  /* ── REFS for imperative DOM animation ── */
  const revealRefs = useRef([]);
  const counterRefs = useRef([]); // { el, target }

  useEffect(() => {
    if (service) {
      scrollSectionIntoView("services_cards");
    }
  }, [service]);

  const addReveal = useCallback((el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }, []);

  const addCounter = useCallback((el, target) => {
    if (el && !counterRefs.current.some((c) => c.el === el)) {
      counterRefs.current.push({ el, target });
    }
  }, []);

  /* ── NAV SCROLL SHADOW ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── DRAWER: lock body scroll while open ── */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  /* ── REVEAL-ON-SCROLL OBSERVER ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add(styles.vis);
        });
      },
      { threshold: 0.1 },
    );
    revealRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── COUNT-UP OBSERVER ── */
  useEffect(() => {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = counterRefs.current.find((c) => c.el === entry.target);
          if (!match) return;
          const { el, target } = match;
          let v = 0;
          const step = target / 65;
          const t = setInterval(() => {
            v = Math.min(v + step, target);
            el.textContent = Math.floor(v).toLocaleString();
            if (v >= target) clearInterval(t);
          }, 22);
          cio.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );
    counterRefs.current.forEach((c) => cio.observe(c.el));
    return () => cio.disconnect();
  }, []);

  /* ── TRACK BUTTON ── */
  const handleTrack = () => {
    if (trackValue.trim()) {
      setTrackState("success");
      setTimeout(() => setTrackState("idle"), 2500);
    } else {
      setTrackState("error");
      setTimeout(() => setTrackState("idle"), 2000);
    }
  };

  /* ── TICKER: duplicate for seamless loop, same as original ── */
  const tickerItems = [...D.ticker, ...D.ticker];

  return (
    <div className={styles.wrapper}>
      {/* MOBILE DRAWER OVERLAY */}

      {/* BREADCRUMB */}
      <div className={styles.breadcrumb}>
        {D.breadcrumb.map((b, i) => (
          <span
            key={b.label}
            style={{ display: "flex", alignItems: "center", gap: ".35rem" }}
          >
            {i > 0 && <span className={styles.bcSep}>›</span>}
            <a
              href={b.href}
              className={cx(styles.bcItem, b.current && styles.current)}
            >
              {b.label}
            </a>
          </span>
        ))}
      </div>

      {/* HERO */}
      <div className={styles.svcHero}>
        <div className={styles.svcHeroBg} />
        <div className={styles.svcHeroGlow} />
        <div className={styles.svcHeroInner}>
          {/* Badge */}
          <div className={styles.heroBadge}>{D.hero.tag}</div>

          {/* Headline */}
          <h1 className={styles.heroHeadline}>
            {D.hero.headingPart1}{" "}
            <span className={styles.heroHl}>{D.hero.headingHl}</span>
          </h1>

          {/* Description */}
          <p className={styles.heroDesc}>{D.hero.description}</p>

          {/* CTA Buttons */}
          <div className={styles.heroCtas}>
            <a href="/quote" className={styles.heroCtaPrimary}>
              Get Free Quote →
            </a>
            <a href="#services" className={styles.heroCtaSecondary}>
              Explore Services ↓
            </a>
          </div>

          {/* Stats ribbon */}
          <div className={styles.heroStats}>
            {D.hero.stats.map((s) => (
              <div className={styles.heroStat} key={s.label}>
                <div className={styles.heroStatVal}>
                  {s.value}
                  <span>{s.suffix}</span>
                </div>
                <div className={styles.heroStatLbl}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className={styles.tickerWrap}>
        <div className={styles.ticker}>
          {tickerItems.map((t, i) => (
            <span className={styles.tItem} key={i}>
              <span className={styles.tDot} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICE CARDS LIST */}
      <section
        className={cx(styles.section, styles.servicesList)}
        id="services_cards"
      >
        <div className={cx(styles.reveal)} ref={addReveal}>
          <div className={styles.secTag}>{D.servicesList.tag}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <h2 className={styles.secH}>
              {D.servicesList.headingPart1}{" "}
              <span className={styles.hl}>{D.servicesList.headingHl}</span>
            </h2>
            <p
              style={{
                maxWidth: 320,
                color: "var(--muted)",
                fontSize: ".88rem",
                lineHeight: 1.65,
              }}
            >
              {D.servicesList.description}
            </p>
          </div>
          <div className={styles.filterRow}>
            {D.servicesList.filters.map((f) => (
              <button
                key={f.id}
                className={cx(
                  styles.filterBtn,
                  activeFilter === f.id && styles.active,
                )}
                onClick={() => setActiveFilter(f.id)}
              >
                <span className={styles.fDot} style={{ background: f.dot }} />
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.svcCards}>
          {D.servicesList.items.map((s, i) => (
            <div
              key={`${s.id}-${i}`}
              ref={addReveal}
              className={cx(
                styles.svcCard,
                activeFilter !== "all" &&
                  s.id !== activeFilter &&
                  styles.hiddenCard,
              )}
              style={{ transitionDelay: `${(i % 3) * 0.08}s`, cursor: "pointer" }}
              onClick={() => setSelectedService(s)}
            >
              <div className={styles.svcCardImgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.svcCardImg}
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                />
                <div className={styles.svcCardBadge}>
                  <span className={cx(styles.svcTagPill, styles[s.tagClass])}>
                    {s.tag}
                  </span>
                </div>
              </div>
              <div className={styles.svcCardBody}>
                {/* <div className={styles.svcCardIcon}>{s.icon}</div> */}
                <h3 className={styles.svcCardTitle}>{s.title}</h3>
                <p className={styles.svcCardDesc}>{s.description.slice(0, 120) + "..."}</p>
                <div className={styles.svcCardFeatures}>
                  {s.features.map((f) => (
                    <div className={styles.svcFeat} key={f}>
                      {f}
                    </div>
                  ))}
                </div>
                <div className={styles.svcCardFooter}>
                  <button
                    type="button"
                    className={styles.svcLink}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(s);
                    }}
                  >
                    {D.servicesList.learnMore}
                  </button>
                  {/* <span className={styles.svcPriceTag}>
                    {D.servicesList.priceFrom}
                    {s.price} <span style={{ opacity: 0.7 }}>{s.unit}</span>
                  </span> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={cx(styles.section, styles.howItWorks)}>
        <div className={cx(styles.procHead, styles.reveal)} ref={addReveal}>
          <div className={cx(styles.secTag, styles.secTagCenter)}>
            {D.process.tag}
          </div>
          <h2 className={styles.secH}>
            {D.process.headingPart1}{" "}
            <span className={styles.hl}>{D.process.headingHl}</span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".93rem",
              maxWidth: 460,
              margin: ".8rem auto 0",
              lineHeight: 1.7,
            }}
          >
            {D.process.description}
          </p>
        </div>
        <div className={styles.procGrid}>
          {D.process.steps.map((s, i) => (
            <div
              className={styles.pstep}
              ref={addReveal}
              style={{ transitionDelay: `${i * 0.1}s` }}
              key={s.num}
            >
              <div className={styles.pstepN}>{s.num}</div>
              <div className={styles.pstepContent}>
                <div className={styles.pstepIcon}>{s.icon}</div>
                <h3 className={styles.pstepTitle}>{s.title}</h3>
                <p className={styles.pstepDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NUMBERS */}
      <div className={styles.numbers}>
        {D.numbers.map((n) => (
          <div className={styles.numItem} key={n.label}>
            <div className={styles.numVal}>
              <span ref={(el) => addCounter(el, n.value)}>0</span>
              <span className={styles.suf}>{n.suffix}</span>
            </div>
            <div className={styles.numLbl}>{n.label}</div>
          </div>
        ))}
      </div>

      {/* COVERAGE */}
      <section className={cx(styles.section, styles.coverage)}>
        <div className={styles.covGrid}>
          <div className={cx(styles.covVisual, styles.reveal)} ref={addReveal}>
            <div className={styles.covMapWrap}>
              <IndiaMap
                regions={D.coverage.regions}
                selectedRegion={selectedRegion}
                mode={mapMode}
                onToggleMode={() =>
                  setMapMode((m) => (m === "street" ? "satellite" : "street"))
                }
              />
            </div>
            {/* <div className={styles.covBadge}>
              <div className={styles.covBadgeVal}>{D.coverage.badgeVal}</div>
              <div className={styles.covBadgeLbl}>{D.coverage.badgeLbl}</div>
            </div> */}
          </div>
          <div className={styles.covContent}>
            <div className={cx(styles.secTag, styles.reveal)} ref={addReveal}>
              {D.coverage.tag}
            </div>
            <h2
              className={cx(styles.secH, styles.reveal)}
              style={{ transitionDelay: ".1s" }}
              ref={addReveal}
            >
              {D.coverage.headingPart1}{" "}
              <span className={styles.hl}>{D.coverage.headingHl}</span>
            </h2>
            <p
              className={styles.reveal}
              style={{ transitionDelay: ".15s" }}
              ref={addReveal}
            >
              {D.coverage.description}
            </p>
            <div
              className={cx(styles.covRegions, styles.reveal)}
              style={{ transitionDelay: ".2s" }}
              ref={addReveal}
            >
              {D.coverage.regions.map((r) => {
                const isActive = selectedRegion === r.name;
                return (
                  <div
                    className={styles.covRegion}
                    key={r.name}
                    onClick={() => setSelectedRegion(isActive ? null : r.name)}
                    style={{
                      cursor: "pointer",
                      borderColor: isActive ? r.dot : undefined,
                      background: isActive ? `${r.dot}14` : undefined,
                      color: isActive ? r.dot : undefined,
                      transform: isActive ? "scale(1.03)" : undefined,
                    }}
                  >
                    <span
                      className={styles.covRegionDot}
                      style={{ background: r.dot }}
                    />
                    {r.name}
                  </div>
                );
              })}
            </div>
            <div
              className={styles.reveal}
              style={{ transitionDelay: ".25s" }}
              ref={addReveal}
            >
              <button className={styles.btnPrimary}>{D.coverage.cta}</button>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className={cx(styles.section, styles.comparison)}>
        <div className={cx(styles.compHead, styles.reveal)} ref={addReveal}>
          <div className={cx(styles.secTag, styles.secTagCenter)}>
            {D.comparison.tag}
          </div>
          <h2 className={styles.secH}>
            {D.comparison.headingPart1}{" "}
            <span className={styles.hl}>{D.comparison.headingHl}</span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".93rem",
              maxWidth: 460,
              margin: ".8rem auto 0",
              lineHeight: 1.7,
            }}
          >
            {D.comparison.description}
          </p>
        </div>
        <div
          className={cx(styles.compTableWrap, styles.reveal)}
          ref={addReveal}
        >
          <table className={styles.compTable}>
            <thead>
              <tr>
                {D.comparison.headers.map((h, i) => (
                  <th
                    key={h}
                    className={
                      i === D.comparison.highlightCol ? styles.hlCol : ""
                    }
                  >
                    {h}
                    {i === D.comparison.highlightCol && (
                      <span className={styles.compBadge}>
                        {D.comparison.highlightBadge}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {D.comparison.rows.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  {row.vals.map((v, i) => {
                    const isHl = i === D.comparison.highlightCol - 1;
                    let content = v;
                    if (v === "✓")
                      content = <span className={styles.check}>✓</span>;
                    else if (v === "–")
                      content = <span className={styles.cross}>—</span>;
                    return (
                      <td key={i} className={isHl ? styles.hlCol : ""}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className={cx(styles.section, styles.industries)}>
        <div className={cx(styles.indHead, styles.reveal)} ref={addReveal}>
          <div>
            <div className={styles.secTag}>{D.industries.tag}</div>
            <h2 className={styles.secH}>
              {D.industries.headingPart1}{" "}
              <span className={styles.hl}>{D.industries.headingHl}</span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 320,
              color: "var(--muted)",
              fontSize: ".9rem",
              lineHeight: 1.7,
            }}
          >
            {D.industries.description}
          </p>
        </div>
        <div className={styles.indGrid}>
          {D.industries.items.map((it, i) => (
            <div
              className={styles.indCard}
              ref={addReveal}
              style={{ transitionDelay: `${(i % 4) * 0.07}s` }}
              key={it.name}
            >
              <span className={styles.indCardBar} />
              <div
                className={styles.indIcon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={it.icon}
                  alt={it.name}
                  width={40}
                  height={40}
                  style={{ objectFit: "contain", display: "block" }}
                />
              </div>
              <div className={styles.indName}>{it.name}</div>
              <div className={styles.indDesc}>{it.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRACKING CTA */}
      {/* <section className={cx(styles.section, styles.trackCta)}>
        <div className={styles.trackInner}>
          <div className={cx(styles.trackLeft, styles.reveal)} ref={addReveal}>
            <div className={styles.secTag}>{D.tracking.tag}</div>
            <h2 className={styles.secH}>
              {D.tracking.headingPart1}
              <br />
              <span className={styles.hl}>{D.tracking.headingHl}</span>
            </h2>
            <p>{D.tracking.description}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".65rem",
              }}
            >
              <div
                className={cx(
                  styles.tInputRow,
                  trackState === "error" && styles.errorState,
                )}
              >
                <input
                  className={styles.tInput}
                  type="text"
                  placeholder={D.tracking.inputPlaceholder}
                  value={trackValue}
                  onChange={(e) => setTrackValue(e.target.value)}
                />
                <button
                  className={cx(
                    styles.tBtn,
                    trackState === "success" && styles.success,
                  )}
                  onClick={handleTrack}
                >
                  {trackState === "success"
                    ? D.tracking.btnSuccess
                    : D.tracking.btnLabel}
                </button>
              </div>
              <div className={styles.tHints}>
                {D.tracking.hints.map((h) => (
                  <span className={styles.tHint} key={h}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            className={cx(styles.trackRight, styles.reveal)}
            style={{ transitionDelay: ".2s" }}
            ref={addReveal}
          >
            <div className={styles.tcHdr}>
              <div className={styles.tcId}>{D.tracking.demo.id}</div>
              <div className={styles.tcStatus}>{D.tracking.demo.status}</div>
            </div>
            <div className={styles.tcRoute}>
              <div className={styles.tcCity}>
                <div className={styles.tcCn}>{D.tracking.demo.from}</div>
                <div className={styles.tcCc}>{D.tracking.demo.fromCode}</div>
              </div>
              <div className={styles.tcArrow}>→</div>
              <div className={cx(styles.tcCity, styles.tcCityRight)}>
                <div className={styles.tcCn}>{D.tracking.demo.to}</div>
                <div className={styles.tcCc}>{D.tracking.demo.toCode}</div>
              </div>
            </div>
            <div className={styles.tcTl}>
              {D.tracking.demo.timeline.map((t, i) => (
                <div className={styles.tlRow} key={i}>
                  <div
                    className={cx(
                      styles.tlD,
                      styles[
                        `tl${t.status[0].toUpperCase()}${t.status.slice(1)}`
                      ],
                    )}
                  />
                  <div>
                    <div className={styles.tlTitle}>{t.title}</div>
                    <div className={styles.tlTime}>{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* TESTIMONIALS */}
      <section className={cx(styles.section, styles.testimonials)}>
        <div className={cx(styles.testHead, styles.reveal)} ref={addReveal}>
          <div>
            <div className={styles.secTag}>{D.testimonials.tag}</div>
            <h2 className={styles.secH}>
              {D.testimonials.headingPart1}{" "}
              <span className={styles.hl}>{D.testimonials.headingHl}</span>
            </h2>
          </div>
          {/* <button
            className={styles.btnPrimary}
            style={{ whiteSpace: "nowrap" }}
          >
            {D.testimonials.cta}
          </button> */}
        </div>
        <div className={styles.testGrid}>
          {D.testimonials.items.map((t, i) => (
            <div
              className={styles.testCard}
              ref={addReveal}
              style={{ transitionDelay: `${i * 0.1}s` }}
              key={t.name}
            >
              <div className={styles.testStars}>{t.stars}</div>
              <p className={styles.testText}>&quot;{t.text}&quot;</p>
              <div className={styles.testAuthor}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.testAvatar}
                  src={t.avatar}
                  alt={t.name}
                />
                <div>
                  <div className={styles.testName}>{t.name}</div>
                  <div className={styles.testRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={cx(styles.section, styles.faq)}>
        <div
          style={{ textAlign: "center", marginBottom: "3rem" }}
          className={styles.reveal}
          ref={addReveal}
        >
          <div className={cx(styles.secTag, styles.secTagCenter)}>
            {D.faq.tag}
          </div>
          <h2 className={styles.secH}>
            {D.faq.headingPart1}{" "}
            <span className={styles.hl}>{D.faq.headingHl}</span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".93rem",
              maxWidth: 420,
              margin: ".75rem auto 0",
              lineHeight: 1.7,
            }}
          >
            {D.faq.description}
          </p>
        </div>
        <div className={styles.faqGrid}>
          {D.faq.items.map((item, i) => (
            <div
              className={cx(styles.faqItem, openFaqIndex === i && styles.open)}
              key={item.q}
            >
              <div
                className={styles.faqQ}
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              >
                {item.q}
                <span className={styles.faqIcon}>+</span>
              </div>
              <div className={styles.faqA}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={cx(styles.section, styles.ctaBanner)}>
        <div className={cx(styles.ctaInner, styles.reveal)} ref={addReveal}>
          <div className={styles.secTag}>{D.cta.tag}</div>
          <h2 className={styles.secH}>
            {D.cta.headingPart1}
            <br />
            <span className={styles.hl}>{D.cta.headingHl}</span>
          </h2>
          <p>{D.cta.description}</p>
          <div className={styles.ctaBtns}>
            <button className={styles.btnW}>{D.cta.btn1}</button>
            <button className={styles.btnWg}>{D.cta.btn2}</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.fTop}>
          <div className={styles.fBrand}>
            <span className={styles.fBrandLogo}>{D.footer.logo}</span>
            <p>{D.footer.tagline}</p>
            <div className={styles.fSocs}>
              {D.footer.socials.map((s, i) => (
                <a href={s.url} className={styles.fSoc} key={i}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {D.footer.columns.map((col) => (
            <div className={styles.fCol} key={col.heading}>
              <h4>{col.heading}</h4>
              <ul className={styles.fLinksList}>
                {col.links.map(([lbl, url]) => (
                  <li key={lbl}>
                    <a href={url}>{lbl}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.fBottom}>
          <p>{D.footer.copyright}</p>
          <p>{D.footer.footerLinks}</p>
        </div>
      </footer>

      <button className={styles.fab}>{D.fab}</button>

      <CommonModal
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        height="fit-content"
      >
        {selectedService && (
          <div className="px-4 mt-4 mb-6">
            <h2 className="text-xl leading-relaxed font-bold" style={{ color: "var(--text)" }}>
              {selectedService?.title}
            </h2>
            {/* Service image */}
            {selectedService.image && (
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-48 object-cover rounded-2xl my-2"
              />
            )}
            <div>
              {/* Tag pill */}
              <span
                className={cx(styles.svcTagPill, styles[selectedService.tagClass])}
                style={{ display: "inline-block", marginBottom: "0.75rem" }}
              >
                {selectedService.tag}
              </span>

              {/* Full description */}
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink3)" }}>
                {selectedService.description}
              </p>

              {/* Features / Bullet points */}
              {selectedService.features && selectedService.features.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                    Key Highlights
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-sm" style={{ color: "var(--ink3)" }}>
                    {selectedService.features.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6">
                <Link
                  href={`/contact?for=${selectedService?.title.replace("&", "%26")} Enquiry`}
                  className={styles.btnCta}
                  style={{ display: "inline-block", textDecoration: "none" }}
                  onClick={() => setSelectedService(null)}
                >
                  Enquire Now →
                </Link>
              </div>
            </div>
          </div>
        )}
      </CommonModal>
    </div>
  );
}
