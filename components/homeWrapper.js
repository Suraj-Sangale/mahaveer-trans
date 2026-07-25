"use client";
import { useState, useEffect, useRef } from "react";
import CtaSection from "./home/ctaSection";
import Header from "./layout/header";
import styles from "@/styles/homeWrapper.module.css";
import Footer from "./layout/footer";
import { getConstant } from "@/utilities/utils";
import Link from "next/link";

const cx = (...args) => {
  return args
    .flat()
    .filter(Boolean)
    .map((str) =>
      String(str)
        .trim()
        .split(/\s+/)
        .map((c) => styles[c] || c)
        .join(" "),
    )
    .join(" ");
};

/* ─── SITE DATA ─── */
const SITE_DATA = {
  meta: {
    pageTitle: `${getConstant("company_name_short")} — Reliable Road Transport & Logistics`,
    fpTitle: "🎨 Design Settings",
    fpColorLabel: "Accent Color",
    fpDisplayLabel: "Display / Heading Font",
    fpBodyLabel: "Body / UI Font",
    themeLabel: "☀️ / 🌙 Theme",
    fontBtnText: "Fonts & Style",
    drawerFontBtnText: "Fonts & Accent Color",
    fabIcon: "💬",
  },

  company: {
    name: getConstant("company_name_short"),
    tagline:
      "Reliable road transportation and logistics solutions across India — delivering goods safely, efficiently, and on time.",
    founded: "2010",
    phone: getConstant("contact_no_display"),
    email: getConstant("company_email"),
    website: getConstant("company_website"),
    address: getConstant("company_address"),
    rating: "4.9★",
    ratingLabel: "Trusted by businesses across India",
  },

  hero: {
    pill: "Nationwide Road Transport Across India",
    titleLine1: "Welcome To",
    titleLine2Hl: "MAHAVEER",
    titleLine3: "Trans Solution",
    chip: "Since 1999",
    description:
      "End-to-end road transportation and logistics solutions designed for businesses across India. From local deliveries to long-distance movement, we ensure safe, reliable, and timely transportation.",
    cta1: "Get a Transport Quote →",
    cta2: "▶ Explore Services",

    image:
      "https://autobahntrucking.com/storage/app/vehicles/images/Bharatbenz-truck-5528TT.jpg",

    statCard1: {
      label: "Deliveries",
      sub: "Reliable shipments across India",
      badge: "Safe & On-Time",
      capacityLabel: "Fleet availability",
    },

    statCard2: {
      label: "On-time Rate",
      sub: "Reliable delivery performance",
    },

    trust: {
      count: "500+",
      label: "businesses trust MahaveerTrans",
      avatars: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop&crop=face",
      ],
    },

    stats: {
      shipments: 5000,
      onTime: 98,
    },
  },

  ticker: [
    "Road Transport",
    "FTL Transportation",
    "LTL Transportation",
    "Part Load Transport",
    "Full Truck Load",
    "Express Delivery",
    "Warehousing",
    "Last Mile Delivery",
    "Cargo Transportation",
    "Distribution Services",
  ],

  clients: {
    label: "Trusted by Businesses",
    logos: [
      "MAHINDRA",
      "RELIANCE",
      "TATA",
      "GODREJ",
      "ADANI",
      "L&T",
      "HINDUSTAN",
    ],
  },

  services: {
    sectionTag: "What We Do",
    heading: "Complete Road Logistics",
    headingHl: "Solutions",
    link: "/services",
    linkText: "All Services →",

    description:
      "From local transportation to long-distance freight movement, we provide reliable road logistics solutions across major cities, states, and industrial regions in India.",

    learnMoreText: "Learn more →",
    learnMoreLink: "/about",

    items: [
      {
        tag: "Primary Service",
        tagClass: "tp-amber",
        icon: "",
        title: "Road Transport",
        description:
          "Reliable road transportation services across India for safe and timely movement of commercial goods and cargo.",
        image:
          "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80&auto=format&fit=crop",
      },

      {
        tag: "FTL",
        tagClass: "tp-blue",
        icon: "",
        title: "Full Truck Load",
        description:
          "Dedicated trucks for businesses requiring complete vehicle capacity for secure and efficient long-distance transportation.",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
      },

      {
        tag: "LTL",
        tagClass: "tp-sky",
        icon: "",
        title: "Part Load Transport",
        description:
          "Cost-effective transportation for smaller shipments by efficiently utilizing available truck capacity.",
        image:
          "https://images.unsplash.com/photo-1586191582119-6d54e8d6e6f4?w=600&q=80&auto=format&fit=crop",
      },

      {
        tag: "Support Service",
        tagClass: "tp-green",
        icon: "",
        title: "Warehousing & Distribution",
        description:
          "Flexible warehousing, storage, distribution, and dispatch support to simplify your supply chain operations.",
        image:
          "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80&auto=format&fit=crop",
      },
    ],
  },

  numbers: [
    {
      value: 5000,
      suffix: "+",
      label: "Shipments handled across India",
    },
    {
      value: 98,
      suffix: "%",
      label: "On-time delivery performance",
    },
    {
      value: 25,
      suffix: "+",
      label: "States & regions served",
    },
    {
      value: 10,
      suffix: "+",
      label: "Years of logistics experience",
    },
  ],

  about: {
    sectionTag: "Our Story",
    tagStrip: "India-Focused Logistics",

    title: "Built for Reliable",
    titleHl: "Transportation.",

    p1: "Mahaveer Trans Solution provides dependable road transportation and logistics services for businesses across India. Our focus is on safe cargo movement, timely deliveries, transparent communication, and dependable transportation support.",

    p2: "From local movement to long-distance transportation between major cities and industrial hubs, our team works to provide efficient and practical logistics solutions based on each customer's requirements.",

    cta: "Know More About Us →",

    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=80&auto=format&fit=crop",

    features: [
      "Pan-India Road Transportation",
      "Reliable Fleet Network",
      "Experienced Transport Team",
      "Safe Cargo Handling",
      "On-Time Delivery Focus",
      "Customer-Focused Support",
    ],
  },

  process: {
    sectionTag: "Simple Process",
    heading: "Transport in",
    headingHl: "4 Easy Steps",

    steps: [
      {
        num: "01",
        title: "Share Your Requirement",
        desc: "Tell us your pickup location, delivery destination, cargo details, and transportation requirements.",
      },

      {
        num: "02",
        title: "Get a Quote",
        desc: "Our team reviews your requirement and provides a suitable transportation solution with transparent pricing.",
      },

      {
        num: "03",
        title: "Pickup & Transit",
        desc: "Your goods are picked up as scheduled and transported safely through our road transportation network.",
      },

      {
        num: "04",
        title: "Safe Delivery ✓",
        desc: "Your shipment reaches the destination safely and on time, with regular communication throughout the journey.",
      },
    ],
  },

  fleet: {
    sectionTag: "Our Fleet",
    heading: "Reliable Vehicles",
    headingHl: "For Every Requirement",
    href: "/fleet",
    cta: "View Our Fleet →",

    items: [
      {
        title: "Heavy Commercial Trucks",
        sub: "For long-distance cargo movement",
        tag: "Road",
        tall: true,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
      },

      {
        title: "Full Truck Load",
        sub: "Dedicated transportation solutions",
        tag: "FTL",
        tall: false,
        image:
          "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&q=80&auto=format&fit=crop",
      },

      {
        title: "Part Load Vehicles",
        sub: "Flexible cargo transportation",
        tag: "LTL",
        tall: false,
        image:
          "https://images.unsplash.com/photo-1586191582119-6d54e8d6e6f4?w=500&q=80&auto=format&fit=crop",
      },

      {
        title: "Goods Transportation",
        sub: "Safe movement of commercial cargo",
        tag: "Cargo",
        tall: false,
        image:
          "https://images.unsplash.com/photo-1509691363482-a0d9c9246f16?w=500&q=80&auto=format&fit=crop",
      },

      {
        title: "Distribution Vehicles",
        sub: "Reliable last-mile transportation",
        tag: "Delivery",
        tall: false,
        image:
          "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80&auto=format&fit=crop",
      },
    ],
  },

  tracking: {
    sectionTag: "Shipment Tracking",
    heading: "Track Your",
    headingHl: "Shipment",

    description:
      "Enter your tracking ID to check the latest status of your shipment and stay updated throughout its transportation journey.",

    inputPlaceholder: "Enter your tracking ID",
    btnText: "Track Now",
    btnFound: "✓ Found!",

    hints: ["Easy tracking", "Shipment status", "Delivery updates"],

    demo: {
      id: "#MTS-2025-00812",
      status: "● In Transit",

      from: "Mumbai",
      fromCode: "MH · Origin",

      to: "Pune",
      toCode: "MH · Destination",

      timeline: [
        {
          status: "done",
          title: "Shipment picked up",
          time: "Today · 09:14 AM",
        },

        {
          status: "done",
          title: "Departed from origin",
          time: "Today · 11:40 AM",
        },

        {
          status: "now",
          title: "Shipment in transit",
          time: "Today · In Transit",
        },

        {
          status: "pending",
          title: "Arriving at destination",
          time: "Estimated delivery",
        },
      ],
    },
  },

  testimonials: {
    sectionTag: "Client Stories",
    heading: "What Our Clients",
    headingHl: "Say",

    items: [
      {
        stars: "★★★★★",
        text: "Mahaveer Trans Solution provides reliable transportation support and keeps our team updated throughout the movement of goods.",
        name: "Rajesh Mehta",
        role: "Business Owner",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face",
      },

      {
        stars: "★★★★★",
        text: "Their team understands our transportation requirements and consistently works to ensure our shipments reach the destination on time.",
        name: "Priya Sharma",
        role: "Operations Manager",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face",
      },

      {
        stars: "★★★★★",
        text: "We appreciate the communication and support provided during transportation. They are a dependable logistics partner for our business.",
        name: "Arjun Kapoor",
        role: "Business Operations",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop&crop=face",
      },
    ],
  },

  cta: {
    sectionTag: "Get Started",
    title: "Need Reliable",
    titleHl: "Transport?",
    description:
      "Tell us your transportation requirement and get a reliable road logistics solution for your business anywhere across India.",

    cta1: "Get Free Quote →",
    cta2: "📞 Call us",
  },
};

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
  const [trackVal, setTrackVal] = useState("");
  const [trackState, setTrackState] = useState("idle");

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
              {/* <span className={cx("hero-chip")}>{d.hero.chip}</span> */}
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
                <div className={cx("hf-val")}>
                  {heroActive ? pctVal + "%" : "0%"}
                </div>
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
          {d.services.link && (
            <Link href={d.services.link} className={cx("btn-outline")}>
              {d.services.linkText}
            </Link>
          )}
        </div>
        <div className={cx("svc-grid")}>
          {d.services.items.map((s, i) => (
            <AnimCard key={i} className={cx("svc-card")} delay={i * 0.07}>
              <img className={cx("svc-img")} src={s.image} alt={s.title} />
              <span className={cx(`svc-tag-pill ${s.tagClass}`)}>{s.tag}</span>
              {s.icon && <div className={cx("svc-icon")}>{s.icon}</div>}
              <h3 className={cx("svc-title")}>{s.title}</h3>
              <p className={cx("svc-desc")}>{s.description}</p>
              <Link href={d.services.learnMoreLink} className={cx("svc-link")}>
                {d.services.learnMoreText}
              </Link>
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
      <section id="about" className={cx("about")}>
        <div className={cx("section-wrap")}>
          <div className={cx("about-grid")}>
            <div className={cx("about-img-col")}>
              <div className={cx("about-tag-strip")}>{d.about.tagStrip}</div>
              <img
                className={cx("about-main-img")}
                src={d.about.image}
                alt="About"
              />
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
      </section>

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
                <div className={cx("pstep-content")}>
                  <h3 className={cx("pstep-title")}>{p.title}</h3>
                  <p className={cx("pstep-desc")}>{p.desc}</p>
                </div>
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
            <Link href={d.fleet.href} className={cx("btn-outline")}>
              {d.fleet.cta}
            </Link>
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
                  <div className={cx("tc-status")}>
                    {d.tracking.demo.status}
                  </div>
                </div>
                <div className={cx("tc-route")}>
                  <div className={cx("tc-city")}>
                    <div className={cx("tc-city-name")}>
                      {d.tracking.demo.from}
                    </div>
                    <div className={cx("tc-city-code")}>
                      {d.tracking.demo.fromCode}
                    </div>
                  </div>
                  <div className={cx("tc-arrow")}>→</div>
                  <div className={cx("tc-city")} style={{ textAlign: "right" }}>
                    <div className={cx("tc-city-name")}>
                      {d.tracking.demo.to}
                    </div>
                    <div className={cx("tc-city-code")}>
                      {d.tracking.demo.toCode}
                    </div>
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
      {/* <Footer /> */}
      {/* <footer>
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
      </footer> */}
    </>
  );
}
