"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import styles from "@/styles/track.module.css";
import { getConstant } from "@/utilities/utils";

/* ════════════════════════════════
   MASTER DATA OBJECT
   (mirrors the original DATA object — zero hardcoded strings in JSX)
════════════════════════════════ */
const DATA = {
  meta: { title: `Track Shipment — ${getConstant("company_name_short")}` },

  nav: {
    logoPrefix: "Mahaveer",
    logoSuffix: "Trans",
    links: [
      { label: "Home", href: "index.html" },
      { label: "Services", href: "services.html" },
      { label: "Fleet", href: "fleet.html" },
      { label: "Track", href: "tracking.html", active: true },
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
    { label: "Track Shipment", href: "tracking.html", current: true },
  ],

  hero: {
    tag: "Live Tracking",
    headingPart1: "Know Where Your",
    headingHl: "Cargo Is",
    headingPart2: "Right Now",
    description:
      "Real-time GPS tracking, customs milestones, and estimated delivery windows for every shipment — across every mode, every country.",
    stats: [
      { val: "99", suf: "%", lbl: "On-time Accuracy" },
      { val: "180", suf: "+", lbl: "Countries Tracked" },
      { val: "12K", suf: "+", lbl: "Live Shipments" },
      { val: "5-min", suf: "", lbl: "Update Interval" },
    ],
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

  trackPanel: {
    tag: "Shipment Tracker",
    headingPart1: "Enter Your",
    headingHl: "Tracking Number",
    subtitle:
      "Supports MahaveerTrans IDs (MT-XXXX), house bill of lading (HBL), master bill of lading (MBL), and courier AWB numbers.",
    inputPlaceholder: "e.g. MT-2025-08812 or AWB 176-12345678",
    btnIcon: "🔍",
    btnLabel: "Track Shipment",
    btnSearching: "Searching...",
    btnSuccess: "✓ Found",
    btnError: "Not Found — Try Again",
    hints: [
      "No login required",
      "Live GPS updates",
      "WhatsApp & SMS alerts",
      "Download PDF report",
    ],
    quickLabel: "Try a sample:",
    quickExamples: ["MT-2025-00812", "MT-2025-04531", "MT-2025-07720"],
    resultLabels: {
      trackingId: "Tracking Number",
      fromLabel: "Origin",
      toLabel: "Destination",
      timelineLabel: "Shipment Journey",
      detailsLabel: "Shipment Details",
      etaLabel: "Estimated Arrival",
      progressMeta: ["Departed", "In Transit", "Arrived"],
      statusMap: {
        transit: "● In Transit",
        delivered: "✓ Delivered",
        pending: "◐ Awaiting Pickup",
      },
    },
    actions: [
      { label: "📄 Download PDF", cls: "abGhost" },
      { label: "🔔 Set Alert", cls: "abPrimary" },
      { label: "📤 Share", cls: "abGhost" },
    ],
    /* Simulated shipment data keyed by tracking number */
    shipments: {
      "MT-2025-00812": {
        id: "MT-2025-00812",
        status: "transit",
        progress: 62,
        from: "Mumbai",
        fromCode: "BOM, India",
        to: "Frankfurt",
        toCode: "FRA, Germany",
        eta: "30 May 2025 · Est. 08:00 AM",
        etaIcon: "✈️",
        details: [
          { key: "Service", val: "Air Freight — Express" },
          { key: "Weight", val: "142 kg / 0.85 CBM" },
          { key: "Pieces", val: "4 cartons" },
          { key: "Shipper", val: "Reliance Industries" },
          { key: "Consignee", val: "Bosch GmbH, Frankfurt" },
          { key: "Customs", val: "Cleared (BOM)", accent: true },
          { key: "Insurance", val: "₹4,80,000 Marine Cover" },
          { key: "Updated", val: "29 May · 04:22 AM IST" },
        ],
        timeline: [
          {
            status: "done",
            label: "Picked up from shipper",
            time: "28 May · 09:14 AM",
            location: "Andheri E, Mumbai",
          },
          {
            status: "done",
            label: "Arrived at BOM cargo terminal",
            time: "28 May · 02:40 PM",
            location: "CSIA Cargo, Mumbai",
          },
          {
            status: "done",
            label: "Customs cleared — Export",
            time: "28 May · 09:55 PM",
            location: "BOM Customs, Mumbai",
          },
          {
            status: "done",
            label: "Departed Mumbai Airport",
            time: "28 May · 11:40 PM",
            location: "Flight AI-182",
          },
          {
            status: "now",
            label: "In transit via Dubai",
            time: "29 May · 04:22 AM · Now",
            location: "DXB Hub, Dubai",
          },
          {
            status: "pending",
            label: "Arrives Frankfurt Airport",
            time: "30 May · Est. 06:00 AM",
            location: "FRA Cargo Terminal",
          },
          {
            status: "pending",
            label: "Customs clearance — Import",
            time: "30 May · Est. 09:00 AM",
            location: "FRA Customs, Germany",
          },
          {
            status: "pending",
            label: "Out for delivery",
            time: "30 May · Est. 02:00 PM",
            location: "Bosch GmbH, Frankfurt",
          },
        ],
      },
      "MT-2025-04531": {
        id: "MT-2025-04531",
        status: "delivered",
        progress: 100,
        from: "Chennai",
        fromCode: "MAA, India",
        to: "Singapore",
        toCode: "SIN, Singapore",
        eta: "26 May 2025 · Delivered 11:32 AM",
        etaIcon: "✅",
        details: [
          { key: "Service", val: "Sea Freight — FCL" },
          { key: "Container", val: "40HC · MSCU4812673" },
          { key: "Weight", val: "18,400 kg / 32 CBM" },
          { key: "Shipper", val: "TVS Auto Parts" },
          { key: "Consignee", val: "Tan Chong Motor, SIN" },
          { key: "Customs", val: "Cleared (SIN)", accent: true },
          { key: "POD", val: "Signed · 26 May 11:32 AM" },
          { key: "Updated", val: "26 May · 11:35 AM IST" },
        ],
        timeline: [
          {
            status: "done",
            label: "Cargo loaded at factory",
            time: "20 May · 07:00 AM",
            location: "TVS Plant, Hosur",
          },
          {
            status: "done",
            label: "Container sealed & gated in",
            time: "20 May · 03:30 PM",
            location: "Chennai Port, CTMS",
          },
          {
            status: "done",
            label: "Vessel departed Chennai",
            time: "21 May · 02:00 AM",
            location: "MV Maersk Sentosa",
          },
          {
            status: "done",
            label: "Arrived Port of Singapore",
            time: "25 May · 06:45 AM",
            location: "PSA Tanjong Pagar",
          },
          {
            status: "done",
            label: "Customs cleared — Import",
            time: "25 May · 04:30 PM",
            location: "SIN Customs",
          },
          {
            status: "done",
            label: "Delivered to consignee",
            time: "26 May · 11:32 AM",
            location: "Tan Chong, Singapore",
          },
        ],
      },
      "MT-2025-07720": {
        id: "MT-2025-07720",
        status: "pending",
        progress: 8,
        from: "Delhi",
        fromCode: "DEL, India",
        to: "New York",
        toCode: "JFK, USA",
        eta: "3 Jun 2025 · Est. 10:00 AM",
        etaIcon: "📦",
        details: [
          { key: "Service", val: "Air Freight — Economy" },
          { key: "Weight", val: "56 kg / 0.3 CBM" },
          { key: "Pieces", val: "2 packages" },
          { key: "Shipper", val: "Zydus Pharma" },
          { key: "Consignee", val: "Walgreens Dist, NJ" },
          { key: "Customs", val: "Pre-filing submitted", accent: true },
          { key: "Insurance", val: "₹1,20,000 Marine Cover" },
          { key: "Updated", val: "29 May · 08:00 AM IST" },
        ],
        timeline: [
          {
            status: "done",
            label: "Booking confirmed",
            time: "29 May · 08:00 AM",
            location: "Online Portal",
          },
          {
            status: "now",
            label: "Awaiting pickup",
            time: "30 May · Est. 10:00 AM",
            location: "Zydus Plant, Delhi",
          },
          {
            status: "pending",
            label: "Drop-off at DEL cargo terminal",
            time: "30 May · Est. 04:00 PM",
            location: "DIAL Cargo, Delhi",
          },
          {
            status: "pending",
            label: "Export customs clearance",
            time: "30 May · Est. 09:00 PM",
            location: "DEL Customs",
          },
          {
            status: "pending",
            label: "Depart Delhi Airport",
            time: "31 May · Est. 11:55 PM",
            location: "Flight — via Chicago",
          },
          {
            status: "pending",
            label: "Arrives JFK Airport",
            time: "2 Jun · Est. 08:00 AM",
            location: "JFK Cargo, New York",
          },
          {
            status: "pending",
            label: "Import customs & delivery",
            time: "3 Jun · Est. 10:00 AM",
            location: "Walgreens, New Jersey",
          },
        ],
      },
    },
  },

  howTracking: {
    tag: "How It Works",
    headingPart1: "Tracking Made",
    headingHl: "Effortless",
    desc: "Four steps from shipment booking to real-time delivery confirmation — always visible, always accurate.",
    steps: [
      {
        num: "01",
        icon: "📋",
        title: "Booking Created",
        desc: "A unique MahaveerTrans tracking ID is generated the moment your shipment is booked — online, via API, or through your account manager.",
      },
      {
        num: "02",
        icon: "📡",
        title: "GPS & Scan Events",
        desc: "Every carrier scan, customs stamp, and GPS checkpoint is captured and pushed to our platform within 5 minutes, 24/7.",
      },
      {
        num: "03",
        icon: "📲",
        title: "Instant Alerts",
        desc: "You and your consignee receive automatic SMS, WhatsApp, and email notifications at every key milestone — no manual chasing.",
      },
      {
        num: "04",
        icon: "✅",
        title: "POD & Close-out",
        desc: "On delivery, photo proof-of-delivery and e-signature are uploaded instantly. Your invoice and digital documents are auto-archived.",
      },
    ],
  },

  dashboard: {
    tag: "Live Overview",
    headingPart1: "Your Shipments",
    headingHl: "at a Glance",
    desc: "A live dashboard view of all active MahaveerTrans shipments and their current status.",
    cards: [
      {
        icon: "🚀",
        badge: "Active",
        badgeCls: "badgeAccent",
        val: "247",
        suf: "",
        lbl: "Shipments In Transit",
        barPct: 72,
        meta: "Across 38 countries right now",
      },
      {
        icon: "✅",
        badge: "Today",
        badgeCls: "badgeGreen",
        val: "84",
        suf: "",
        lbl: "Delivered Today",
        barPct: 84,
        meta: "99.1% on-time for the month",
      },
      {
        icon: "⏳",
        badge: "Customs",
        badgeCls: "badgeAmber",
        val: "12",
        suf: "",
        lbl: "Awaiting Customs",
        barPct: 15,
        meta: "Avg. clearance time: 4.2 hrs",
      },
      {
        icon: "📦",
        badge: "This Month",
        badgeCls: "badgeBlue",
        val: "3,841",
        suf: "",
        lbl: "Total Shipments (May)",
        barPct: 61,
        meta: "↑ 18% vs April 2025",
      },
      {
        icon: "🌐",
        badge: "Network",
        badgeCls: "badgeAccent",
        val: "180",
        suf: "+",
        lbl: "Countries Active Today",
        barPct: 100,
        meta: "All major trade lanes live",
      },
      {
        icon: "⚡",
        badge: "SLA",
        badgeCls: "badgeGreen",
        val: "99",
        suf: "%",
        lbl: "On-time SLA This Month",
        barPct: 99,
        meta: "Target: 97% — Exceeded",
      },
    ],
    tableTitle: "Recent Shipments",
    tableLive: "Live",
    tableHeaders: [
      "Tracking ID",
      "Route",
      "Service",
      "Status",
      "ETA",
      "Weight",
    ],
    tableRows: [
      {
        id: "MT-2025-00812",
        route: "Mumbai → Frankfurt",
        service: "Air Express",
        status: "transit",
        eta: "30 May",
        weight: "142 kg",
      },
      {
        id: "MT-2025-04531",
        route: "Chennai → Singapore",
        service: "Sea FCL",
        status: "delivered",
        eta: "Delivered",
        weight: "18.4 T",
      },
      {
        id: "MT-2025-07720",
        route: "Delhi → New York",
        service: "Air Economy",
        status: "pending",
        eta: "3 Jun",
        weight: "56 kg",
      },
      {
        id: "MT-2025-09014",
        route: "Pune → Dubai",
        service: "Road + Air",
        status: "transit",
        eta: "31 May",
        weight: "890 kg",
      },
      {
        id: "MT-2025-11203",
        route: "Kolkata → London",
        service: "Sea LCL",
        status: "transit",
        eta: "14 Jun",
        weight: "2.1 T",
      },
    ],
  },

  numbers: [
    { value: 12400, suffix: "+", label: "Live shipments tracked" },
    { value: 99, suffix: "%", label: "GPS update accuracy" },
    { value: 180, suffix: "+", label: "Countries with live data" },
    { value: 5, suffix: " min", label: "Maximum data refresh lag" },
  ],

  alerts: {
    tag: "Notification Channels",
    headingPart1: "Stay Informed",
    headingHl: "Every Step",
    desc: "Choose how and when you get notified — for every shipment milestone that matters to your operations.",
    items: [
      {
        icon: "💬",
        iconCls: "aiGreen",
        title: "WhatsApp Alerts",
        desc: "Real-time milestone messages directly to your WhatsApp number — pickup, departure, customs, and delivery confirmation.",
        cta: "Set up WhatsApp →",
      },
      {
        icon: "📧",
        iconCls: "aiBlue",
        title: "Email Notifications",
        desc: "Automated emails at every key event, with full shipment summary, document attachments, and a one-click tracking link.",
        cta: "Configure Email →",
      },
      {
        icon: "📱",
        iconCls: "aiAmber",
        title: "SMS Updates",
        desc: "Short, clear SMS messages sent to your registered mobile at departure, transit, customs clearance, and delivery.",
        cta: "Activate SMS →",
      },
      {
        icon: "🔗",
        iconCls: "aiAccent",
        title: "Webhook / API Push",
        desc: "Receive real-time tracking events as JSON payloads directly to your platform's endpoint. Swagger docs included.",
        cta: "View API Docs →",
      },
    ],
  },

  faq: {
    tag: "FAQs",
    headingPart1: "Tracking",
    headingHl: "Questions Answered",
    desc: "Common questions about shipment tracking, notifications, and data access.",
    items: [
      {
        q: "How often is tracking data updated?",
        a: "GPS and carrier scan data is pushed to our platform every 5 minutes for air and road shipments. Ocean vessel AIS data updates every 15 minutes. Customs milestones update within 2 minutes of an official stamp.",
      },
      {
        q: "Can I track shipments without logging in?",
        a: "Yes. Any valid MahaveerTrans tracking number (MT-XXXX), house bill, master bill, or courier AWB can be tracked without an account using this page.",
      },
      {
        q: "What if my tracking number shows no result?",
        a: "It may take up to 30 minutes from booking confirmation for a new shipment to appear in our system. If it's been longer, contact your account manager or our 24/7 support on +91 22 4001 8000.",
      },
      {
        q: "Can I track multiple shipments at once?",
        a: "Yes. Logged-in customers can track up to 50 shipments simultaneously on the dashboard. Enterprise accounts via API can query unlimited shipments with bulk tracking endpoints.",
      },
      {
        q: "How do I receive proof of delivery?",
        a: "POD (photo + e-signature) is automatically emailed to the shipper and consignee within 10 minutes of delivery. It is also available to download in your account portal and via API.",
      },
      {
        q: "Is tracking available for cold chain shipments?",
        a: "Yes. Temperature logs are embedded in the tracking timeline for all cold-chain shipments — visible alongside location milestones. Alerts fire if temperature deviates from the agreed range.",
      },
    ],
  },

  support: {
    tag: "Need Help?",
    headingPart1: "We're Available",
    headingHl: "24 / 7",
    desc: "Can't find your shipment or need to escalate? Our operations team is always on standby.",
    cards: [
      {
        icon: "📞",
        title: "Call Us",
        desc: "Speak directly to our tracking operations team, day or night, for any urgent shipment query.",
        detail: "+91 22 4001 8000",
        link: "tel:+912240018000",
        cta: "Call Now",
      },
      {
        icon: "💬",
        title: "Live Chat",
        desc: "Start an instant chat with our support team on the website or WhatsApp Business account.",
        detail: "Avg. response: 2 min",
        cta: "Start Chat",
        link: "https://wa.me/+917039529129",
      },
      {
        icon: "✉️",
        title: "Email Support",
        desc: "For detailed queries, documentation requests, or formal escalations — our team responds within 2 hours.",
        detail: "info@mahaveertrans.com",
        link: "mailto:info@mahaveertrans.com",
        cta: "Send Email",
      },
    ],
  },

  cta: {
    tag: "Ship With Confidence",
    headingPart1: "Full Visibility",
    headingHl: "From Day One",
    desc: "Every MahaveerTrans shipment comes with live tracking, milestone alerts, and a dedicated account manager — at no extra cost.",
    btn1: "Get Free Quote →",
    btn2: "📞 +91 22 4001 8000",
  },

};

const cx = (...classes) => classes.filter(Boolean).join(" ");
const pillClassMap = {
  transit: "pillTransit",
  delivered: "pillDelivered",
  pending: "pillPending",
};
const statusLabelMap = {
  transit: "In Transit",
  delivered: "Delivered",
  pending: "Pending",
};
const statusPillClassMap = {
  transit: "statusTransit",
  delivered: "statusDelivered",
  pending: "statusPending",
};
const tlCircleClassMap = {
  done: "tlCDone",
  now: "tlCNow",
  pending: "tlCPending",
};
const tlIconMap = { done: "✓", now: "●", pending: "○" };

export default function TrackWrapper() {
  const D = DATA;
  const TP = D.trackPanel;
  const labels = TP.resultLabels;

  /* ── UI STATE ── */
  // ── next-themes: global theme from ThemeProvider context ───────────────
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme ?? "light";
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  /* ── TRACKING STATE ── */
  const [trackValue, setTrackValue] = useState("");
  const [btnState, setBtnState] = useState("idle"); // idle | searching | success | error
  const [inputError, setInputError] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const resultRef = useRef(null);

  /* ── REFS for imperative scroll-reveal / counters / bar-fills ── */
  const revealRefs = useRef([]);
  const counterRefs = useRef([]);
  const barRefs = useRef([]);

  const addReveal = useCallback((el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }, []);
  const addCounter = useCallback((el, target) => {
    if (el && !counterRefs.current.some((c) => c.el === el))
      counterRefs.current.push({ el, target });
  }, []);
  const addBar = useCallback((el, pct) => {
    if (el && !barRefs.current.some((b) => b.el === el))
      barRefs.current.push({ el, pct });
  }, []);

  /* ── NAV SCROLL SHADOW ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── DRAWER: lock body scroll ── */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  /* ── REVEAL-ON-SCROLL OBSERVER ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.vis);
        }),
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
          const match = counterRefs.current.find((c) => c.el === entry.target);
          if (!entry.isIntersecting || !match) return;
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

  /* ── DASHBOARD BAR-FILL OBSERVER ── */
  useEffect(() => {
    const bio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const match = barRefs.current.find((b) => b.el === entry.target);
          if (!entry.isIntersecting || !match) return;
          match.el.style.width = match.pct + "%";
          bio.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );
    barRefs.current.forEach((b) => bio.observe(b.el));
    return () => bio.disconnect();
  }, []);

  /* ── SCROLL TO RESULT WHEN SHOWN ── */
  useEffect(() => {
    if (showResult && resultRef.current) {
      const t = setTimeout(() => {
        resultRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [showResult, currentShipment]);

  /* ── TRACKING LOGIC (mirrors original doTrack()) ── */
  const performTrack = (overrideValue) => {
    const source = overrideValue !== undefined ? overrideValue : trackValue;
    const raw = source.trim().toUpperCase().replace(/\s/g, "");

    if (!raw) {
      setInputError(true);
      setTimeout(() => setInputError(false), 2000);
      return;
    }

    setBtnState("searching");

    setTimeout(() => {
      const ship =
        TP.shipments[raw] ||
        TP.shipments[raw.replace("MT", "MT-2025-").slice(0, 15)] ||
        null;

      if (!ship) {
        setBtnState("error");
        setShowResult(false);
        setTimeout(() => setBtnState("idle"), 3000);
        return;
      }

      setBtnState("success");
      setCurrentShipment(ship);
      setShowResult(true);
      setTimeout(() => setBtnState("idle"), 3000);
    }, 900);
  };

  const handleQuickOrTable = (id) => {
    setTrackValue(id);
    performTrack(id);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") performTrack();
  };

  const btnContent = () => {
    if (btnState === "searching")
      return (
        <>
          <span>⏳</span>
          <span>{TP.btnSearching}</span>
        </>
      );
    if (btnState === "success")
      return (
        <>
          <span>✓</span>
          <span>{TP.btnSuccess}</span>
        </>
      );
    if (btnState === "error")
      return (
        <>
          <span>❌</span>
          <span>{TP.btnError}</span>
        </>
      );
    return (
      <>
        <span>{TP.btnIcon}</span>
        <span>{TP.btnLabel}</span>
      </>
    );
  };

  const tickerItems = [...D.ticker, ...D.ticker];

  return (
    <div className={styles.wrapper}>
      {/* MOBILE DRAWER OVERLAY */}
      {/* <div className={cx(styles.mobOverlay, drawerOpen && styles.open)} onClick={() => setDrawerOpen(false)} /> */}

      {/* MOBILE DRAWER */}
      {/* <div className={cx(styles.mobDrawer, drawerOpen && styles.open)}>
    <div className={styles.drHeader}>
        <div className={styles.drLogo}>{D.nav.logoPrefix}{D.nav.logoSuffix}</div>
        <button className={styles.drClose} onClick={() => setDrawerOpen(false)}>✕</button>
    </div>
    <div className={styles.drLinks}>
        {D.nav.links.map((l) => (
        <a key={l.label} href={l.href} className={l.active ? 'active' : ''} onClick={() => setDrawerOpen(false)}>{l.label}</a>
        ))}
    </div>
    <div className={styles.drFoot}>
        <div className={styles.drThemeRow}>
        <span className={styles.drThemeLbl}>{D.nav.themeLabel}</span>
        <button className={cx(styles.themeToggle, theme === 'dark' && styles.dark)} onClick={toggleTheme} />
        </div>
        <button className={styles.drCtaBtn}>{D.nav.drawerCta}</button>
    </div>
    </div> */}

      {/* NAV */}
      {/* <nav className={cx(styles.nav, scrolled && styles.navScrolled)}>
        <div className={styles.navLogo}>
          <span>{D.nav.logoPrefix}</span>{D.nav.logoSuffix}<div className={styles.dot} />
        </div>
        <div className={styles.navLinks}>
          {D.nav.links.map((l) => (
            <a key={l.label} href={l.href} className={l.active ? 'active' : ''}>{l.label}</a>
          ))}
        </div>
        <div className={styles.navRight}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem' }}>
            <span className={styles.themeIcon}>☀️</span>
            <button className={cx(styles.themeToggle, theme === 'dark' && styles.dark)} onClick={toggleTheme} />
            <span className={styles.themeIcon}>🌙</span>
          </div>
          <button className={styles.btnGhost}>{D.nav.loginBtn}</button>
          <button className={styles.btnCtaNav}>{D.nav.quoteBtn}</button>
          <button className={cx(styles.hamburger, drawerOpen && styles.open)} onClick={() => setDrawerOpen(true)}>
            <span className={styles.hamLine} /><span className={styles.hamLine} /><span className={styles.hamLine} />
          </button>
        </div>
      </nav> */}

      {/* BREADCRUMB */}
      <div className={styles.breadcrumb}>
        {D.breadcrumb.map((b, i) => (
          <span
            key={b.label}
            style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
          >
            {i > 0 && <span className={styles.bcSep}>/</span>}
            <a
              href={b.href}
              className={cx(styles.bcItem, b.current && styles.cur)}
            >
              {b.label}
            </a>
          </span>
        ))}
      </div>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.secTag}>{D.hero.tag}</div>
            <h1 className={styles.secH}>
              {D.hero.headingPart1}{" "}
              <span className={styles.hl}>{D.hero.headingHl}</span>{" "}
              {D.hero.headingPart2}
            </h1>
            <p className={styles.heroDesc}>{D.hero.description}</p>
          </div>
          <div className={styles.heroRight}>
            {D.hero.stats.map((s) => (
              <div className={styles.heroStat} key={s.lbl}>
                <div className={styles.hsVal}>
                  {s.val}
                  <span className={styles.s}>{s.suf}</span>
                </div>
                <div className={styles.hsLbl}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN TRACKING PANEL */}
      <div className={styles.trackSection}>
        <div className={styles.trackPanel}>
          <div className={styles.tpTag}>{TP.tag}</div>
          <h2 className={styles.tpH}>
            {TP.headingPart1} <span className={styles.hl}>{TP.headingHl}</span>
          </h2>
          <p className={styles.tpSub}>{TP.subtitle}</p>

          <div
            className={cx(styles.searchBar, inputError && styles.inputError)}
          >
            <input
              type="text"
              placeholder={TP.inputPlaceholder}
              value={trackValue}
              onChange={(e) => setTrackValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <button
              className={cx(
                btnState === "success" && styles.searchBtnSuccess,
                btnState === "error" && styles.searchBtnError,
              )}
              onClick={() => performTrack()}
              disabled={btnState === "searching"}
            >
              {btnContent()}
            </button>
          </div>

          <div className={styles.searchHints}>
            {TP.hints.map((h) => (
              <span className={styles.sHint} key={h}>
                {h}
              </span>
            ))}
          </div>

          <div className={styles.quickChips}>
            <span className={styles.quickLabel}>{TP.quickLabel}</span>
            {TP.quickExamples.map((ex) => (
              <button
                className={styles.qchip}
                key={ex}
                onClick={() => handleQuickOrTable(ex)}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* RESULT */}
          <div
            className={cx(styles.resultWrap, showResult && styles.show)}
            ref={resultRef}
          >
            {currentShipment && (
              <div className={styles.resultCard}>
                <div className={styles.rcHead}>
                  <div>
                    <div className={styles.rcIdLbl}>{labels.trackingId}</div>
                    <div className={styles.rcId}>{currentShipment.id}</div>
                  </div>
                  <div
                    className={cx(
                      styles.rcStatusPill,
                      styles[statusPillClassMap[currentShipment.status]],
                    )}
                  >
                    {labels.statusMap[currentShipment.status]}
                  </div>
                </div>

                <div className={styles.rcRoute}>
                  <div className={styles.rcCity}>
                    <div className={styles.rccLabel}>{labels.fromLabel}</div>
                    <div className={styles.rccName}>{currentShipment.from}</div>
                    <div className={styles.rccCode}>
                      {currentShipment.fromCode}
                    </div>
                  </div>
                  <div className={styles.rcProgress}>
                    <div className={cx(styles.rcpMeta, styles.rcpMetaTop)}>
                      <span>{currentShipment.from}</span>
                      <span>{labels.progressMeta[1]}</span>
                      <span>{currentShipment.to}</span>
                    </div>
                    <div className={styles.rcpBar}>
                      <div
                        className={styles.rcpFill}
                        style={{ width: `${currentShipment.progress}%` }}
                      />
                      <div
                        className={styles.rcpDot}
                        style={{
                          left: `${Math.min(currentShipment.progress, 96)}%`,
                        }}
                      />
                    </div>
                    <div className={cx(styles.rcpMeta, styles.rcpMetaBottom)}>
                      <span>{labels.progressMeta[0]}</span>
                      <span>{currentShipment.progress}% complete</span>
                      <span>{labels.progressMeta[2]}</span>
                    </div>
                  </div>
                  <div className={cx(styles.rcCity, styles.rcCityRight)}>
                    <div className={styles.rccLabel}>{labels.toLabel}</div>
                    <div className={styles.rccName}>{currentShipment.to}</div>
                    <div className={styles.rccCode}>
                      {currentShipment.toCode}
                    </div>
                  </div>
                </div>

                <div className={styles.rcBody}>
                  <div className={styles.rcTimeline}>
                    <div className={styles.tlSectionLabel}>
                      {labels.timelineLabel}
                    </div>
                    <div>
                      {currentShipment.timeline.map((t, i, arr) => (
                        <div className={styles.tlItem} key={i}>
                          <div className={styles.tlLeft}>
                            <div
                              className={cx(
                                styles.tlCircle,
                                styles[tlCircleClassMap[t.status]],
                              )}
                            >
                              {tlIconMap[t.status]}
                            </div>
                            {i < arr.length - 1 && (
                              <div
                                className={cx(
                                  styles.tlLine,
                                  t.status === "done" && styles.done,
                                )}
                              />
                            )}
                          </div>
                          <div>
                            <div className={styles.tlTitle}>{t.label}</div>
                            <div className={styles.tlTime}>{t.time}</div>
                            <div className={styles.tlLocation}>
                              {t.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.rcDetails}>
                    <div className={styles.rdLabel}>{labels.detailsLabel}</div>
                    <div className={styles.detailGrid}>
                      {currentShipment.details.map((d) => (
                        <div className={styles.detailRow} key={d.key}>
                          <span className={styles.drKey}>{d.key}</span>
                          <span
                            className={cx(
                              styles.drVal,
                              d.accent && styles.accent,
                            )}
                          >
                            {d.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.rcEta}>
                  <div className={styles.etaLeft}>
                    <div className={styles.etaIcon}>
                      {currentShipment.etaIcon}
                    </div>
                    <div className={styles.etaText}>
                      <div className={styles.etaLabel}>{labels.etaLabel}</div>
                      <div className={styles.etaVal}>{currentShipment.eta}</div>
                    </div>
                  </div>
                  <div className={styles.rcActions}>
                    {TP.actions.map((a) => (
                      <button
                        className={cx(styles.actionBtn, styles[a.cls])}
                        key={a.label}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

      {/* HOW TRACKING WORKS */}
      <section className={cx(styles.section, styles.howTracking)}>
        <div className={cx(styles.htHead, styles.reveal)} ref={addReveal}>
          <div className={cx(styles.secTag, styles.center)}>
            {D.howTracking.tag}
          </div>
          <h2 className={styles.secH}>
            {D.howTracking.headingPart1}{" "}
            <span className={styles.hl}>{D.howTracking.headingHl}</span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".93rem",
              maxWidth: 460,
              margin: ".75rem auto 0",
              lineHeight: 1.7,
            }}
          >
            {D.howTracking.desc}
          </p>
        </div>
        <div className={styles.htSteps}>
          {D.howTracking.steps.map((s, i) => (
            <div
              className={styles.htStep}
              ref={addReveal}
              style={{ transitionDelay: `${i * 0.1}s` }}
              key={s.num}
            >
              <div className={styles.htNum}>{s.num}</div>
              <div className={styles.htContent}>
                <div className={styles.htIcon}>{s.icon}</div>
                <h3 className={styles.htTitle}>{s.title}</h3>
                <p className={styles.htDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE DASHBOARD */}
      <section className={cx(styles.section, styles.liveDashboard)}>
        <div className={cx(styles.dbHead, styles.reveal)} ref={addReveal}>
          <div>
            <div className={styles.secTag}>{D.dashboard.tag}</div>
            <h2 className={styles.secH}>
              {D.dashboard.headingPart1}{" "}
              <span className={styles.hl}>{D.dashboard.headingHl}</span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 300,
              color: "var(--muted)",
              fontSize: ".88rem",
              lineHeight: 1.65,
            }}
          >
            {D.dashboard.desc}
          </p>
        </div>
        <div className={styles.dbGrid}>
          {D.dashboard.cards.map((c, i) => (
            <div
              className={styles.dbCard}
              ref={addReveal}
              style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
              key={c.lbl}
            >
              <div className={styles.dbcTop}>
                <div className={styles.dbcIcon}>{c.icon}</div>
                <span className={cx(styles.dbcBadge, styles[c.badgeCls])}>
                  {c.badge}
                </span>
              </div>
              <div className={styles.dbcVal}>
                {c.val}
                <span className={styles.s}>{c.suf}</span>
              </div>
              <div className={styles.dbcLabel}>{c.lbl}</div>
              <div className={styles.dbcBar}>
                <div
                  className={styles.dbcFill}
                  ref={(el) => addBar(el, c.barPct)}
                  style={{ width: "0%" }}
                />
              </div>
              <div className={styles.dbcMeta}>{c.meta}</div>
            </div>
          ))}
        </div>
        <div
          className={cx(styles.liveTableWrap, styles.reveal)}
          ref={addReveal}
        >
          <div className={styles.ltHeader}>
            <div className={styles.ltTitle}>{D.dashboard.tableTitle}</div>
            <div className={styles.ltLive}>{D.dashboard.tableLive}</div>
          </div>
          <table className={styles.liveTbl}>
            <thead>
              <tr>
                {D.dashboard.tableHeaders.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {D.dashboard.tableRows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span
                      className={styles.tdId}
                      onClick={() => handleQuickOrTable(r.id)}
                    >
                      {r.id}
                    </span>
                  </td>
                  <td>{r.route}</td>
                  <td>{r.service}</td>
                  <td>
                    <span
                      className={cx(
                        styles.tdPill,
                        styles[pillClassMap[r.status]],
                      )}
                    >
                      {statusLabelMap[r.status]}
                    </span>
                  </td>
                  <td>{r.eta}</td>
                  <td>{r.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* NUMBERS */}
      <div className={styles.numbersStrip}>
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

      {/* ALERTS */}
      <section className={cx(styles.section, styles.alertsSection)}>
        <div className={cx(styles.alertHead, styles.reveal)} ref={addReveal}>
          <div>
            <div className={styles.secTag}>{D.alerts.tag}</div>
            <h2 className={styles.secH}>
              {D.alerts.headingPart1}{" "}
              <span className={styles.hl}>{D.alerts.headingHl}</span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 300,
              color: "var(--muted)",
              fontSize: ".88rem",
              lineHeight: 1.65,
            }}
          >
            {D.alerts.desc}
          </p>
        </div>
        <div className={styles.alertGrid}>
          {D.alerts.items.map((a, i) => (
            <div
              className={styles.alertCard}
              ref={addReveal}
              style={{ transitionDelay: `${(i % 2) * 0.08}s` }}
              key={a.title}
            >
              <div className={cx(styles.alertIcon, styles[a.iconCls])}>
                {a.icon}
              </div>
              <div>
                <div className={styles.alertTitle}>{a.title}</div>
                <div className={styles.alertDesc}>{a.desc}</div>
                <div className={styles.alertCta}>{a.cta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={cx(styles.section, styles.faqSection)}>
        <div className={cx(styles.faqHead, styles.reveal)} ref={addReveal}>
          <div className={cx(styles.secTag, styles.center)}>{D.faq.tag}</div>
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
            {D.faq.desc}
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

      {/* SUPPORT */}
      <section className={cx(styles.section, styles.supportSection)}>
        <div
          style={{ textAlign: "center", marginBottom: "3rem" }}
          className={styles.reveal}
          ref={addReveal}
        >
          <div className={cx(styles.secTag, styles.center)}>
            {D.support.tag}
          </div>
          <h2 className={styles.secH}>
            {D.support.headingPart1}{" "}
            <span className={styles.hl}>{D.support.headingHl}</span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".93rem",
              maxWidth: 440,
              margin: ".75rem auto 0",
              lineHeight: 1.7,
            }}
          >
            {D.support.desc}
          </p>
        </div>
        <div className={styles.supGrid}>
          {D.support.cards.map((c, i) => (
            <div
              className={styles.supCard}
              ref={addReveal}
              style={{ transitionDelay: `${i * 0.08}s` }}
              key={c.title}
            >
              <div className={styles.supIcon}>{c.icon}</div>
              <div className={styles.supTitle}>{c.title}</div>
              <div className={styles.supDesc}>{c.desc}</div>
              <div className={styles.supDetail}>{c.detail}</div>
              <a href={`${c.link}`} className={styles.btnPrimary}
              >
                {c.cta}
              </a>

              {/* <button className={styles.btnPrimary}>{c.cta}</button> */}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={cx(styles.section, styles.ctaBanner)}>
        <div className={cx(styles.ctaInner, styles.reveal)} ref={addReveal}>
          <div className={styles.secTag}>{D.cta.tag}</div>
          <h2 className={styles.secH}>
            {D.cta.headingPart1}
            <br />
            <span className={styles.hl}>{D.cta.headingHl}</span>
          </h2>
          <p>{D.cta.desc}</p>
          <div className={styles.ctaBtns}>
            <button className={styles.btnW}>{D.cta.btn1}</button>
            <button className={styles.btnWg}>{D.cta.btn2}</button>
          </div>
        </div>
      </section>

      <button className={styles.fab}>{D.fab}</button>
    </div>
  );
}
