import React from "react";

import dynamic from "next/dynamic";
import ThemeInit from "./themeInit";
import Navbar from "./navbar";
import StatsRow from "./statsRow";
import Gallery from "./gallery";
import RouteMap from "./routeMap";
import ScrollReveal from "./scrollReveal";
import HeroParticles from "./HeroParticles";
import Clients from "./clients";
import CtaRevealClient from "./ctaRevealClient";
import Header from "../layout/header";
import { applyCSS } from "../../utilities/utils";
import styles from "@/styles/fleet.module.css";
import CtaSection from "../home/ctaSection";

const DATA = {
  breadcrumb: [
    { label: "Home", href: "index.html" },
    { label: "Gallery", href: "gallery.html", current: true },
  ],
  hero: {
    eyebrow: "Trusted by 4,800+ businesses across India",
    headingLine1: "Where Every",
    headingHl: "Road",
    headingLine2: "Tells a Story",
    description:
      "From the dusty NH44 highways of the Deccan to the snow-cut passes of Himachal — our trucks have covered every kilometre so your cargo doesn't have to worry about the journey.",
    cta1: "Explore Gallery →",
    cta2: "View Our Clients",
    stats: [
      { val: "4,800", suf: "+", lbl: "Happy Clients" },
      { val: "2.4M", suf: " km", lbl: "Driven This Year" },
      { val: "99", suf: "%", lbl: "On-time Delivery" },
    ],
  },
  ticker: [
    "Mumbai to Delhi",
    "Chennai to Kolkata",
    "Pune to Ahmedabad",
    "Hyderabad to Bengaluru",
    "Jaipur to Nagpur",
    "Surat to Lucknow",
    "Indore to Vizag",
    "Coimbatore to Patna",
  ],
  statsRow: [
    { value: 4800, suffix: "+", label: "Happy clients served" },
    { value: 2400000, suffix: " km", label: "Kilometres driven this year" },
    { value: 200, suffix: "+", label: "Long-route vehicles" },
    { value: 99, suffix: "%", label: "On-time delivery rate" },
  ],
  gallery: {
    tag: "Photo Gallery",
    headingPart1: "On the Road,",
    headingHl: "Every Day",
    filters: [
      { id: "all", label: "All Photos", dot: "#0ea5e9" },
      { id: "trucks", label: "Our Fleet", dot: "#f59e0b" },
      { id: "roads", label: "On the Road", dot: "#16a34a" },
      { id: "ops", label: "Operations", dot: "#7c3aed" },
      { id: "cargo", label: "Cargo & Load", dot: "#dc2626" },
    ],
    photos: [
      {
        cat: "trucks",
        size: "tall",
        tag: "Heavy Haulage",
        title: "25T Multi-axle on NH48",
        sub: "Mumbai–Bengaluru Express Highway",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop",
      },
      {
        cat: "roads",
        size: "medium",
        tag: "Highway",
        title: "Dawn Run — Yamuna Expressway",
        sub: "Delhi to Agra corridor, 4:30 AM",
        img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700&q=80&auto=format&fit=crop",
      },
      {
        cat: "cargo",
        size: "short",
        tag: "Loading",
        title: "Container Loading — JNPT",
        sub: "Navi Mumbai Port Terminal",
        img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80&auto=format&fit=crop",
      },
      {
        cat: "trucks",
        size: "medium",
        tag: "Reefer Fleet",
        title: "Cold Chain Convoy",
        sub: "Pharma delivery — Pune to Delhi",
        img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&q=80&auto=format&fit=crop",
      },
      {
        cat: "roads",
        size: "tall",
        tag: "Mountain Route",
        title: "Rohtang Pass Delivery",
        sub: "High-altitude cargo, Manali sector",
        img: "/images/gallery/img (1).jpeg",
      },
      {
        cat: "ops",
        size: "short",
        tag: "Control Room",
        title: "24/7 Fleet Operations",
        sub: "MahaveerTrans Control Tower, Mumbai",
        img: "/images/gallery/img (4).jpeg",
      },
      {
        cat: "trucks",
        size: "short",
        tag: "Flatbed",
        title: "Steel Coil Transport",
        sub: "Bhilai to Pune Industrial Corridor",
        img: "/images/vehicale/semibed.png",
      },
      {
        cat: "cargo",
        size: "tall",
        tag: "Warehouse",
        title: "Smart Warehouse — Bhiwandi",
        sub: "3M sqft distribution centre",
        img: "/images/gallery/img (5).jpeg",
      },
      {
        cat: "roads",
        size: "medium",
        tag: "Night Ops",
        title: "Night Convoy — NH44",
        sub: "Hyderabad to Chennai, 2:00 AM",
        img: "/images/gallery/img (6).jpeg",
      },
      {
        cat: "ops",
        size: "medium",
        tag: "Team",
        title: "Driver Briefing — Mumbai Hub",
        sub: "Daily safety & route debrief",
        img: "/images/gallery/img (7).jpeg",
      },
      {
        cat: "trucks",
        size: "tall",
        tag: "EV Last Mile",
        title: "Electric Delivery Fleet",
        sub: "Bengaluru urban zone, 200+ EVs",
        img: "/images/gallery/img (10).jpeg",
      },
      {
        cat: "roads",
        size: "short",
        tag: "Sunset Run",
        title: "Golden Hour — Rajasthan NH",
        sub: "Jaipur to Jodhpur corridor",
        img: "/images/gallery/img (9).jpeg",
      },
    ],
  },
  routeMap: {
    tag: "Our Routes",
    headingPart1: "Every Major",
    headingHl: "Highway Covered",
    description:
      "MahaveerTrans runs dedicated long-distance truck lanes on 18 national highway corridors — covering 96% of India's industrial clusters with scheduled departures.",
    routes: [
      { city: "Mumbai ↔ Delhi", dist: "1,421 km", color: "#0ea5e9" },
      { city: "Chennai ↔ Kolkata", dist: "1,659 km", color: "#f59e0b" },
      { city: "Bengaluru ↔ Pune", dist: "840 km", color: "#16a34a" },
      { city: "Hyderabad ↔ Ahmedabad", dist: "1,100 km", color: "#7c3aed" },
      { city: "Surat ↔ Lucknow", dist: "1,206 km", color: "#dc2626" },
    ],
    cards: [
      {
        label: "Scheduled Departures / Day",
        badge: "Live",
        badgeCls: "badge-green",
        val: "48+",
        sub: "Across all major corridors",
        barPct: 96,
      },
      {
        label: "Average Transit Accuracy",
        badge: "SLA",
        badgeCls: "badge-green",
        val: "99%",
        sub: "On-time within ±2 hr window",
        barPct: 99,
      },
      {
        label: "Active Trucks On Road Now",
        badge: "Now",
        badgeCls: "badge-amber",
        val: "200+",
        sub: "GPS tracked, live dashboard",
        barPct: 72,
      },
      {
        label: "Shortest Turnaround Route",
        badge: "Fast",
        badgeCls: "badge-green",
        val: "6 hrs",
        sub: "Pune ↔ Mumbai express lane",
        barPct: 100,
      },
    ],
  },
  clients: {
    tag: "Happy Clients",
    headingPart1: "Brands That",
    headingHl: "Trust Our Wheels",
    description:
      "From FMCG giants to pharma exporters — businesses that moved their goods with MahaveerTrans keep coming back.",
    logos: [
      "MAHINDRA",
      "RELIANCE",
      "CIPLA",
      "L&T",
      "NYKAA",
      "TVS",
      "TATA MOTORS",
      "GODREJ",
      "WIPRO",
      "ITC",
    ],
    cards: [
      {
        industry: "Road Freight",
        tagCls: "tag-road",
        icon: "🏭",
        company: "Mahindra Logistics",
        sector: "Automotive OEM & Parts",
        testimonial:
          "MahaveerTrans handles 400+ FTL trips monthly for our plant-to-dealer network. Zero stockouts in 18 months since onboarding.",
        stars: "★★★★★",
        stat: "400 trips/month",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format&fit=crop",
      },
      {
        industry: "Cold Chain",
        tagCls: "tag-cold",
        icon: "💊",
        company: "Cipla Ltd.",
        sector: "Pharmaceuticals",
        testimonial:
          "GDP-compliant cold chain to 22 states. Temperature deviation rate under 0.3% across 12 months of pharma deliveries.",
        stars: "★★★★★",
        stat: "22 states covered",
        img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80&auto=format&fit=crop",
      },
      {
        industry: "Bulk Road",
        tagCls: "tag-bulk",
        icon: "🏗️",
        company: "L&T Construction",
        sector: "Infrastructure",
        testimonial:
          "Multi-axle fleet for heavy equipment movement across 8 active project sites. Permit management handled end-to-end — zero delays.",
        stars: "★★★★★",
        stat: "8 project sites",
        img: "https://images.unsplash.com/photo-1540835296355-0a0015f3c02e?w=500&q=80&auto=format&fit=crop",
      },
      {
        industry: "FMCG",
        tagCls: "tag-fmcg",
        icon: "🛒",
        company: "ITC Limited",
        sector: "FMCG & Consumer Goods",
        testimonial:
          "Daily replenishment runs to 1,200 retail points across Maharashtra and Karnataka. 98.6% fill rate, up from 91% with previous 3PL.",
        stars: "★★★★★",
        stat: "1,200 retail points",
        img: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=500&q=80&auto=format&fit=crop",
      },
      {
        industry: "Road Freight",
        tagCls: "tag-road",
        icon: "👗",
        company: "Nykaa Fashion",
        sector: "E-Commerce & Apparel",
        testimonial:
          "Our MahaveerTrans last-mile fleet handles 6,000 B2C deliveries per day in 12 metros with 94% same-day success rate.",
        stars: "★★★★★",
        stat: "6,000 deliveries/day",
        img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80&auto=format&fit=crop",
      },
      {
        industry: "Bulk Road",
        tagCls: "tag-bulk",
        icon: "🚜",
        company: "TVS Motor Company",
        sector: "Two-Wheeler Manufacturing",
        testimonial:
          "JIT delivery from our Hosur plant reduced line stoppages by 91%. MahaveerTrans's telematics dashboard gave us the visibility we needed.",
        stars: "★★★★★",
        stat: "91% fewer stoppages",
        img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&q=80&auto=format&fit=crop",
      },
    ],
  },
  marquee: {
    tag: "Client Voices",
    headingPart1: "Straight From",
    headingHl: "The Road",
    items: [
      {
        stars: "★★★★★",
        text: "Switched to MahaveerTrans 2 years ago. On-time delivery jumped from 83% to 99%. Our retailers stopped complaining.",
        name: "Ravi Shankar",
        role: "Distribution Head, Reliance Retail",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "Their drivers know the NH48 better than anyone. We run Chennai to Mumbai twice a week — never a missed window.",
        name: "Kalpana Murthy",
        role: "Logistics Manager, Ashok Leyland",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "Best reefer fleet in western India. The temp logs are immaculate. Regulators were impressed in our last GDP audit.",
        name: "Dr. Sunil Joshi",
        role: "VP Supply Chain, Sun Pharma",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "1,200 retail drops across Maharashtra, every single day. MahaveerTrans has never missed a Monday fresh-goods window in 14 months.",
        name: "Priya Iyer",
        role: "Supply Chain Director, Marico",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "Flatbed permit management used to take us 2 weeks. MahaveerTrans does it in 48 hours. Our Pune project is running ahead of schedule.",
        name: "Arun Desai",
        role: "Project Manager, Shapoorji Pallonji",
        avatar:
          "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=80&q=80&auto=format&fit=crop&crop=face",
      },
      {
        stars: "★★★★★",
        text: "The GPS dashboard gives our planners visibility we never had. We can see every truck live and reroute before a delay becomes a problem.",
        name: "Neha Kulkarni",
        role: "Operations Lead, Godrej Consumer",
        avatar:
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=80&q=80&auto=format&fit=crop&crop=face",
      },
    ],
  },
  cta: {
    tag: "Partner With Us",
    headingPart1: "Move Your Goods",
    headingHl: "With Confidence",
    description:
      "Join 4,800+ businesses that trust MahaveerTrans for reliable, GPS-tracked, on-time road freight across India.",
    btn1: "Get a Free Quote →",
    btn2: "📞 +91 22 4001 8000",
  },
};
export default function FleetWrapper() {
  const css = (className, mainStyles = styles, style2 = {}) => {
    return applyCSS(className, mainStyles, style2);
  };

  return (
    <>
      {/* <ThemeInit /> */}
      {/* <Header /> */}

      {/* HERO */}
      <section className={css("hero-section")}>
        <HeroParticles />
        <div className={css("hero-overlay")} />
        <div className={css("hero-inner")}>
          <div className={css("hero-eyebrow")}>
            <span className={css("live-dot")} />
            <span>{DATA.hero.eyebrow}</span>
          </div>
          <h1 className={css("hero-h1")}>
            {DATA.hero.headingLine1}{" "}
            <span className={css("hl")}>{DATA.hero.headingHl}</span>
            <br />
            <span className={css("outline")}>{DATA.hero.headingLine2}</span>
          </h1>
          <p className={css("hero-desc")}>{DATA.hero.description}</p>
          <div className={css("hero-actions")}>
            <button className={css("btn-primary")}>{DATA.hero.cta1}</button>
            <button className={css("btn-wg")}>{DATA.hero.cta2}</button>
          </div>
        </div>
        <div className={css("hero-stats-strip")}>
          {DATA.hero.stats.map((s) => (
            <div className={css("hs-card")} key={s.lbl}>
              <div className={css("hs-val")}>
                {s.val}
                <span className={css("s")}>{s.suf}</span>
              </div>
              <div className={css("hs-lbl")}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div className={css("ticker-wrap")}>
        <div className={css("ticker")}>
          {[...DATA.ticker, ...DATA.ticker].map((t, i) => (
            <span key={i} className={css("t-item")}>
              <span className={css("t-dot")} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* STATS ROW */}
      <StatsRow DATA={DATA}/>

      {/* GALLERY */}
      <Gallery DATA={DATA}/>
      

      {/* ROUTE MAP */}
      <RouteMap DATA={DATA} />

      {/* CLIENTS */}
      <Clients DATA={DATA} />

      {/* TESTIMONIAL MARQUEE */}
      <section className={css("testimonial-marquee")}>
        <div className={css("tm-label")}>
          <ScrollReveal>
            <div className={css("sec-tag c")}>{DATA.marquee.tag}</div>
            <h2 className={css("sec-h")}>
              {DATA.marquee.headingPart1}{" "}
              <span className={css("hl")}>{DATA.marquee.headingHl}</span>
            </h2>
          </ScrollReveal>
        </div>
        <div style={{ overflow: "hidden", padding: "1.5rem 0" }}>
          <div className={css("marquee-track")}>
            {[...DATA.marquee.items, ...DATA.marquee.items].map((t, i) => (
              <div className={css("mq-card")} key={i}>
                <div className={css("mq-stars")}>{t.stars}</div>
                <p className={css("mq-text")}>&ldquo;{t.text}&rdquo;</p>
                <div className={css("mq-author")}>
                  <img className={css("mq-av")} src={t.avatar} alt={t.name} />
                  <div>
                    <div className={css("mq-name")}>{t.name}</div>
                    <div className={css("mq-role")}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className={css("cta-section")}>
        <div className={css("cta-inner-center sr")} id="cta-sr">
          <div className={css("sec-tag")}>{DATA.cta.tag}</div>
          <h2 className={css("sec-h")}>
            {DATA.cta.headingPart1}{" "}
            <span className={css("hl")}>{DATA.cta.headingHl}</span>
          </h2>
          <p className={css("desc")}>{DATA.cta.description}</p>
          <div className={css("cta-btns")}>
            <button className={css("btn-w")}>{DATA.cta.btn1}</button>
            <button className={css("btn-wg")}>{DATA.cta.btn2}</button>
          </div>
        </div>
      </section> */}
      <CtaSection />

      {/* Scroll reveal for static elements */}
      <CtaRevealClient />
    </>
  );
}
