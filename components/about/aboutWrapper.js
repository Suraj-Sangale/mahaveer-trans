"use client";
import { useEffect, useRef } from "react";
import styles from "@/styles/about.module.css";

/* ═══════════ DATA ═══════════ */
const TICKER_ITEMS = [
  "Air Cargo",
  "Road Transport",
  "Cold Chain",
  "Warehousing & 3PL",
  "Last Mile Delivery",
  "Rail Freight",
  "Express Courier",
  "GDP Certified",
  "25 Years of Trust",
  "28+ States Covered",
  "2,800+ Team Members",
  "Pan-India Network",
];

const TIMELINE = [
  {
    year: "1999",
    icon: "",
    title: "Founded in Navi Mumbai",
    tag: "The Beginning",
    desc: "Arvind Mahaveer starts with 3 trucks and a conviction that India's exporters deserve more. First office opens at Dharavi Industrial Estate, Mumbai.",
  },
  {
    year: "2003",
    icon: "",
    title: "National Highway Network",
    tag: "Pan-India Expansion",
    desc: "Strategic partnerships with North-South corridor transporters unlock dedicated FTL lanes between Mumbai, Delhi, Chennai, and Kolkata — our first interstate freight milestone.",
  },
  {
    year: "2006",
    icon: "",
    title: "Air Cargo Certified",
    tag: "IATA Accredited",
    desc: "IATA certification obtained. Domestic air cargo desk opens at Mumbai CSIA, handling pharma and electronics for 40+ clients within the first year.",
  },
  {
    year: "2009",
    icon: "",
    title: "Cold Chain Hub Launched",
    tag: "GDP Certified",
    desc: "India’s first GDP-certified cold chain facility commissioned in Bhiwandi — 50,000 sq.ft of temperature-controlled storage for pharma clients.",
  },
  {
    year: "2012",
    icon: "",
    title: "₹500 Cr Revenue Milestone",
    tag: "National Scale",
    desc: "Expanded to 6 cities. FTL network covers all major industrial corridors. Team grows beyond 800 logistics professionals across India.",
  },
  {
    year: "2015",
    icon: "",
    title: "MT Connect Platform",
    tag: "Tech Leap",
    desc: "Proprietary TMS and WMS go live. Clients receive India’s first real-time logistics dashboard with live GPS per consignment — a market first.",
  },
  {
    year: "2018",
    icon: "",
    title: "Tier-2 & Tier-3 Expansion",
    tag: "Deeper India",
    desc: "Network expanded to 150+ tier-2 and tier-3 cities across all 28 states. Last-mile coverage extended to 500+ pin codes with EV delivery bikes.",
  },
  {
    year: "2019",
    icon: "",
    title: "BSE Stock Exchange Listing",
    tag: "IPO",
    desc: "Listed on BSE at ₹240/share, raising ₹380 Cr. Funds deployed for fleet expansion, warehouse automation, and pan-India growth.",
  },
  {
    year: "2021",
    icon: "",
    title: "3 Million Sq.Ft Warehousing",
    tag: "3PL Leader",
    desc: "12 smart hub warehouses fully operational across India. Same-day dispatch achieved across the top 8 metros. WMS API goes public.",
  },
  {
    year: "2024",
    icon: "",
    title: "Net Zero Pledge & EV Fleet",
    tag: "Green Future",
    desc: "2035 net-zero commitment announced. 120 EV delivery vehicles deployed across Indian cities. 12 MW solar capacity across all hubs.",
  },
];

const VALUES = [
  {
    num: "01",
    icon: "🤝",
    title: "Client-First Always",
    desc: "Every decision is measured by one question: does this make our client's supply chain more reliable and cost-effective? We do not upsell what isn't needed.",
  },
  {
    num: "02",
    icon: "🔍",
    title: "Radical Transparency",
    desc: "Pricing is shown in full before booking. No fuel surcharges added at invoice stage. Track records published quarterly on our investor portal.",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Relentless Speed",
    desc: "60-second AI quote. Same-day pickups. 2-hour POD delivery. We are built for the pace of modern commerce, not legacy freight timelines.",
  },
  {
    num: "04",
    icon: "🛡️",
    title: "Zero Compromise on Compliance",
    desc: "GDP, IMDG, IATA DGR, HACCP, ISO 9001. We hold every certification that your procurement team will ever ask for — and several they haven't yet.",
  },
  {
    num: "05",
    icon: "🌱",
    title: "Sustainable by Design",
    desc: "Green routing, carbon offset programs, EV fleets, and solar-powered warehouses. Sustainability is built into our operations, not bolted on.",
  },
  {
    num: "06",
    icon: "💡",
    title: "Technology as Infrastructure",
    desc: "MT Connect is not a tracking app — it's a full supply chain OS. API-first, ERP-integrated, with AI route optimization and predictive ETA.",
  },
];

const LEADERS = [
  {
    name: "Arvind Mahaveer",
    role: "Founder & Chairman",
    bio: "Former IIT-Bombay engineer. Built MahaveerTrans from 3 trucks to a BSE-listed company. Named EY Entrepreneur of the Year 2021.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face",
  },
  {
    name: "Priya Subramaniam",
    role: "CEO & Managing Director",
    bio: "Ex-DHL South Asia MD. 22 years in global logistics. Led the MT Connect platform launch and international expansion.",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b23c?w=400&q=80&auto=format&fit=crop&crop=face",
  },
  {
    name: "Rohit Agarwal",
    role: "CFO",
    bio: "Chartered Accountant, ex-KPMG. Managed the 2019 BSE IPO and three subsequent fund raises. Oversees ₹2,400 Cr revenue operations.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=face",
  },
  {
    name: "Dr. Meena Krishnan",
    role: "Chief Technology Officer",
    bio: "PhD in Supply Chain AI from IIT Delhi. Built MT Connect platform from scratch. Named Forbes India Top 100 Tech Leaders 2023.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&crop=face",
  },
];

const CERTS = [
  {
    logo: "✈️",
    name: "IATA Certified",
    body: "International Air Transport Association accreditation for dangerous goods handling and cargo agency operations.",
    badge: "Active 2024",
  },
  {
    logo: "🌡️",
    name: "GDP Certified",
    body: "Good Distribution Practice certification for pharmaceutical cold chain — the gold standard for temperature-sensitive logistics.",
    badge: "WHO-GDP",
  },
  {
    logo: "🔒",
    name: "ISO 9001:2015",
    body: "Quality Management System certification covering all operational processes, warehousing, and customer service protocols.",
    badge: "BSI Certified",
  },
  {
    logo: "⚮️",
    name: "IMDG Certified",
    body: "International Maritime Dangerous Goods code compliance for hazardous cargo handling, covering classification, packaging, and documentation.",
    badge: "Active 2024",
  },
  {
    logo: "🍱",
    name: "HACCP Certified",
    body: "Hazard Analysis Critical Control Points — mandatory for food-grade cold chain operations across all warehouse facilities.",
    badge: "Food Safe",
  },
  {
    logo: "🏭",
    name: "AEO Status",
    body: "Authorised Economic Operator status granted by Indian Customs — enabling faster clearances and priority processing at ports.",
    badge: "Indian Customs",
  },
  {
    logo: "🛡️",
    name: "TAPA FSR A",
    body: "Transported Asset Protection Association Facility Security Requirements Level A — highest security rating for high-value cargo.",
    badge: "Level A",
  },
  {
    logo: "🌱",
    name: "CII GreenCo Gold",
    body: "Green Company rating from the Confederation of Indian Industry for sustainable practices, energy efficiency, and reduced carbon footprint.",
    badge: "CII Gold 2024",
  },
];

const AWARDS = [
  {
    icon: "🏆",
    name: "ET Logistics Award 2023",
    body: "Best Integrated Logistics Provider of the Year — Economic Times India",
  },
  {
    icon: "⭐",
    name: "Forbes Best Employer",
    body: "Ranked #12 in Forbes India Best Employers in Manufacturing & Logistics 2023",
  },
  {
    icon: "🌍",
    name: "Frost & Sullivan Award",
    body: "India Market Leadership Award — Cold Chain Logistics 2022",
  },
  {
    icon: "📊",
    name: "BSE Listed",
    body: "Listed on Bombay Stock Exchange since 2019. Ticker: MAHVTRANS",
  },
];

const PARTNERS = [
  "Air India Cargo",
  "IndiGo Freighter",
  "SpiceJet Cargo",
  "Blue Dart",
  "Delhivery",
  "DTDC",
  "XpressBees",
  "Ecom Express",
  "FedEx India",
  "DHL Express India",
  "Indian Railways (CONCOR)",
  "Shadowfax",
  "Gati-KWE",
  "Transport Corporation of India",
  "VRL Logistics",
  "Rivigo",
  "Porter",
  "Shiprocket",
];

const OFFICES = [
  {
    flag: "MH",
    city: "Navi Mumbai (HQ)",
    type: "Global Headquarters",
    addr: "4022, 4023, 4th Floor BIMA Complex Kalamboli 400203, Maharashtra, India",
    tags: ["Operations Hub", "Air & Ocean", "Cold Chain", "Customs"],
  },
  {
    flag: "HY",
    city: "Hyderabad",
    type: "South India Operations Office",
    addr: "Hyderabad, Telangana, India",
    tags: ["Road Network", "Cold Chain", "Last Mile"],
  },
];

const WHY = [
  {
    icon: "⚡",
    title: "60-Second AI Quotes",
    desc: "Our MT Pricer engine analyses 40+ variables in real time — route, carrier availability, weight, seasonality — and returns an accurate quote before competitors even open your email.",
  },
  {
    icon: "👤",
    title: "Dedicated Account Manager",
    desc: "You get a named logistics manager from day one. Same person every time. Direct mobile number. No ticket queues, no chatbots for critical shipments.",
  },
  {
    icon: "📡",
    title: "Live Supply Chain Visibility",
    desc: "MT Connect dashboard gives you — and your clients — a real-time map, ETA, temperature logs, and document repository in one place. Accessible via web and API.",
  },
  {
    icon: "🔬",
    title: "Specialist Cargo Expertise",
    desc: "Most 3PLs handle general cargo. We're equally fluent in pharma, hazmat, oversized project cargo, and perishable food — with the certifications to prove it.",
  },
  {
    icon: "💰",
    title: "Transparent, Inclusive Pricing",
    desc: "Our quotes include origin charges, freight, destination charges, and customs fees. No fuel surcharges added later. What you quote is what you invoice.",
  },
  {
    icon: "🔌",
    title: "API-First Integration",
    desc: "REST API with Swagger docs, pre-built Shopify & SAP plugins, webhook events, and WMS connectors. IT onboarding in 48 hours, not 6 weeks.",
  },
];

const TESTS = [
  {
    stars: "★★★★★",
    text: "MahaveerTrans's cold chain solution allowed us to launch temperature-sensitive biologics across five new markets in under 6 months. The GDP compliance documentation was flawless.",
    name: "Dr. Ananya Iyer",
    role: "VP Supply Chain, BioNova India",
    logo: "BioNova",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b23c?w=80&q=80&auto=format&fit=crop&crop=face",
  },
  {
    stars: "★★★★★",
    text: "We migrated our entire 3PL operation to MahaveerTrans. WMS API integration took two days, and we saw a 34% reduction in order fulfilment errors within the first quarter.",
    name: "Vikram Nair",
    role: "Head of Operations, StyleKart",
    logo: "StyleKart",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop&crop=face",
  },
  {
    stars: "★★★★★",
    text: "Our JIT automotive parts supply was always a pain point. MahaveerTrans's dedicated FTL lanes with live tracking gave our plant managers the visibility they needed to eliminate line stoppages completely.",
    name: "Suresh Patel",
    role: "Logistics Director, AutoFab Ltd.",
    logo: "AutoFab",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face",
  },
];

const NUM_STATS = [
  { target: 25, suffix: "+ yrs", label: "Industry experience\nsince 1999" },
  { target: 12400, suffix: "+", label: "Monthly shipments\nprocessed" },
  { target: 28, suffix: "+", label: "States covered\nacross India" },
  { target: 99, suffix: "%", label: "On-time delivery\nrate (2024)" },
  { target: 2800, suffix: "+", label: "Logistics professionals\nacross India" },
];

/* ═══════════ COMPONENT ═══════════ */
export default function AboutWrapper() {
  const railFillRef = useRef(null);
  const tlOuterRef = useRef(null);

  /* ── Intersection Observer for reveal / card / etc. ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.vis);
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(
        `.${styles.reveal}, .${styles.valCard}, .${styles.leadCard}, .${styles.certCard}, .${styles.whyCard}, .${styles.tcCard}, .${styles.officeCard}`,
      )
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── Timeline rail + row reveal ── */
  useEffect(() => {
    if (!tlOuterRef.current || !railFillRef.current) return;

    const railObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            railFillRef.current?.classList.add(styles.animated);
            railObs.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );
    railObs.observe(tlOuterRef.current);

    const rowObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = parseFloat(e.target.dataset.delay || "0") * 1000;
            setTimeout(() => e.target.classList.add(styles.vis), delay);
            rowObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document
      .querySelectorAll(`.${styles.tlRow}`)
      .forEach((r) => rowObs.observe(r));

    return () => {
      railObs.disconnect();
      rowObs.disconnect();
    };
  }, []);

  /* ── Counter animation ── */
  useEffect(() => {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || "";
          let v = 0;
          const step = target / 70;
          const t = setInterval(() => {
            v = Math.min(v + step, target);
            el.textContent = Math.floor(v).toLocaleString() + suffix;
            if (v >= target) clearInterval(t);
          }, 20);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    document
      .querySelectorAll("[data-counter]")
      .forEach((el) => cio.observe(el));
    return () => cio.disconnect();
  }, []);

  /* ── Ticker double for seamless loop ── */
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      {/* BREADCRUMB */}
      <div className={styles.breadcrumb}>
        <a href="/" className={styles.bcItem}>
          Home
        </a>
        <span className={styles.bcSep}>/</span>
        <span className={`${styles.bcItem} ${styles.bcCurrent}`}>About Us</span>
      </div>

      {/* ═══ HERO ═══ */}
      <div className={styles.aboutHero}>
        <div className={styles.heroBgGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <div className={`${styles.heroLeft} ${styles.reveal}`}>
            <div className={styles.heroYearBadge}>
              <span className={styles.ybDot} />
              Founded 1999 · 25 Years of Excellence
            </div>
            <div className={styles.secTag}>Our Story</div>
            <h1 className={styles.secH}>
              India's Most
              <br />
              Trusted <span className={styles.hl}>Logistics Partner</span>
            </h1>
            <p className={styles.heroDesc}>
              MahaveerTrans was built on a single conviction — that Indian
              businesses deserve world-class freight infrastructure without
              the complexity. From a single truck depot in Mumbai in 1999,
              we have grown into a full-spectrum pan-India logistics powerhouse
              with presence in all 28 states, 3 million sq.ft of warehousing,
              and a dedicated team of 2,800+ logistics professionals.
            </p>
            <div className={styles.heroActions}>
              <button
                className={styles.btnPrimary}
                onClick={() => (window.location.href = "/quote")}
              >
                Get Free Quote →
              </button>
              <button
                className={styles.btnGhost}
                onClick={() =>
                  document
                    .getElementById("timeline")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Our Journey ↓
              </button>
            </div>
          </div>
          <div
            className={`${styles.heroRight} ${styles.reveal}`}
            style={{ transitionDelay: "0.15s" }}
          >
            <div className={styles.heroImgStack}>
              <img
                className={styles.hiMain}
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80&auto=format&fit=crop"
                alt="MahaveerTrans operations"
              />
              <img
                className={styles.hiInset}
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80&auto=format&fit=crop"
                alt="Fleet"
              />
              <div className={styles.hiBadge}>
                <div className={styles.hiBadgeVal}>
                  2,800
                  <span style={{ color: "var(--accent)", fontSize: "1.2rem" }}>
                    +
                  </span>
                </div>
                <div className={styles.hiBadgeLbl}>
                  Team members
                  <br />
                  across 28 states
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className={styles.tickerWrap}>
        <div className={styles.ticker}>
          {tickerContent.map((item, i) => (
            <span key={i} className={styles.tItem}>
              <span className={styles.tDot} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ NUMBERS ═══ */}
      <div className={styles.numbers}>
        {NUM_STATS.map((s, i) => (
          <div key={i} className={styles.numItem}>
            <div
              className={styles.numVal}
              data-counter
              data-target={s.target}
              data-suffix={s.suffix}
            >
              0{s.suffix}
            </div>
            <div className={styles.numLbl} style={{ whiteSpace: "pre-line" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ STORY / MISSION ═══ */}
      <section className={styles.story}>
        <div className={styles.storyGrid}>
          <div className={`${styles.storyImgWrap} ${styles.reveal}`}>
            <img
              className={styles.storyImg}
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80&auto=format&fit=crop"
              alt="MahaveerTrans warehouse"
            />
            <div className={styles.storyFloat}>
              <div className={styles.storyFloatVal}>₹2,400 Cr</div>
              <div className={styles.storyFloatLbl}>
                Annual revenue
                <br />
                FY 2024–25
              </div>
            </div>
          </div>
          <div className={styles.storyContent}>
            <div className={`${styles.secTag} ${styles.reveal}`}>
              Who We Are
            </div>
            <h2
              className={`${styles.secH} ${styles.reveal}`}
              style={{ transitionDelay: "0.08s", marginBottom: "1.1rem" }}
            >
              Built on <span className={styles.hl}>Trust,</span>
              <br />
              Scaled by <span className={styles.hl}>Technology</span>
            </h2>
            <p className={styles.reveal} style={{ transitionDelay: "0.12s" }}>
              MahaveerTrans Logistics Pvt. Ltd. was founded in Mumbai in 1999 by
              Arvind Mahaveer with three trucks and a conviction that India’s
              businesses deserved more. Today we are one of India’s top five
              integrated logistics providers — publicly listed on BSE (2019),
              ISO 9001:2015 certified, and operating across air, road, rail,
              cold-chain, warehousing, and last-mile verticals.
            </p>
            <p className={styles.reveal} style={{ transitionDelay: "0.16s" }}>
              Our technology backbone — the MT Connect platform — gives every
              client real-time visibility across their entire supply chain, from
              first-mile pickup to final proof of delivery. With 3 million sq.ft
              of GDP-certified warehousing across 12 hub cities in India and a
              fleet of 500+ GPS-tracked vehicles, we operate one of India’s most
              resilient domestic logistics networks.
            </p>
            <div
              className={`${styles.missionVision} ${styles.reveal}`}
              style={{ transitionDelay: "0.2s" }}
            >
              <div className={`${styles.mvCard} ${styles.mvCardMission}`}>
                <div className={styles.mvIcon}>🎯</div>
                <div className={styles.mvTitle}>Our Mission</div>
                <div className={styles.mvText}>
                  To simplify domestic logistics for Indian businesses by delivering
                  reliable, technology-powered freight solutions that reduce cost,
                  eliminate uncertainty, and accelerate growth across every state.
                </div>
              </div>
              <div className={`${styles.mvCard} ${styles.mvCardVision}`}>
                <div className={styles.mvIcon}>🔭</div>
                <div className={styles.mvTitle}>Our Vision</div>
                <div className={styles.mvText}>
                  To be India’s most trusted end-to-end logistics partner by 2030 —
                  connecting manufacturers, retailers, and e-commerce brands to every
                  corner of the country.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section id="timeline" className={styles.timeline}>
        <div className={`${styles.tlHead} ${styles.reveal}`}>
          <div className={styles.secTagCenter}>Our Journey</div>
          <h2 className={styles.secH} style={{ color: "#f1f5f9" }}>
            25 Years of <span className={styles.hl}>Milestones</span>
          </h2>
          <p>
            From a single depot in Mumbai to a global network spanning 180+
            countries — the defining moments that built MahaveerTrans.
          </p>
        </div>
        <div className={styles.tlOuter} ref={tlOuterRef}>
          <div className={styles.tlRail}>
            <div className={styles.tlRailBg} />
            <div className={styles.tlRailFill} ref={railFillRef} />
          </div>
          {TIMELINE.map((t, i) => {
            const isOdd = i % 2 === 0;
            const card = (
              <div className={styles.tlCard}>
                <div className={styles.tlCardIcon}>{t.icon}</div>
                <div className={styles.tlCardYearPill}>
                  {t.year} · {t.tag}
                </div>
                <div className={styles.tlCardTitle}>{t.title}</div>
                <div className={styles.tlCardDesc}>{t.desc}</div>
                <div className={styles.tlCardTag}>View milestone</div>
              </div>
            );
            return (
              <div key={i} className={styles.tlRow} data-delay={i * 0.08}>
                <div className={styles.tlSideL}>{isOdd ? card : null}</div>
                <div className={styles.tlNode}>
                  <div className={styles.tlNodeRing}>
                    <div className={styles.tlNodeInner}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className={styles.tlNodeYear}>{t.year}</div>
                </div>
                <div className={styles.tlSideR}>{!isOdd ? card : null}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ VALUES ═══ */}
      <section className={styles.values}>
        <div className={styles.valuesHead}>
          <div className={`${styles.reveal} ${styles.secTagCenter}`}>
            What Drives Us
          </div>
          <h2 className={`${styles.secH} ${styles.reveal}`}>
            Our Core <span className={styles.hl}>Values</span>
          </h2>
          <p>
            Six principles that govern every decision, from boardroom strategy
            to last-mile delivery.
          </p>
        </div>
        <div className={styles.valuesGrid}>
          {VALUES.map((v, i) => (
            <div
              key={i}
              className={styles.valCard}
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              <div className={styles.valNum}>{v.num}</div>
              <div className={styles.valIcon}>{v.icon}</div>
              <div className={styles.valTitle}>{v.title}</div>
              <div className={styles.valDesc}>{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LEADERSHIP ═══ */}
      <section className={styles.leadership}>
        <div className={styles.leadHead}>
          <div className={styles.reveal}>
            <div className={styles.secTag}>The Team</div>
            <h2 className={styles.secH}>
              Leadership <span className={styles.hl}>You Can Trust</span>
            </h2>
          </div>
          <p className={styles.leadHeadNote}>
            Seasoned operators from DHL, Maersk, FedEx, and McKinsey — united
            around one mission.
          </p>
        </div>
        <div className={styles.leadGrid}>
          {LEADERS.map((l, i) => (
            <div
              key={i}
              className={styles.leadCard}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={styles.leadImgWrap}>
                <img className={styles.leadImg} src={l.img} alt={l.name} />
                <div className={styles.leadOverlay} />
                <div className={styles.leadSocial}>
                  <div className={styles.leadSocBtn}>in</div>
                  <div className={styles.leadSocBtn}>tw</div>
                  <div className={styles.leadSocBtn}>✉</div>
                </div>
              </div>
              <div className={styles.leadBody}>
                <div className={styles.leadName}>{l.name}</div>
                <div className={styles.leadRole}>{l.role}</div>
                <div className={styles.leadBio}>{l.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CERTIFICATIONS ═══ */}
      <section className={styles.certifications}>
        <div className={styles.certHead}>
          <div className={`${styles.secTagCenter} ${styles.reveal}`}>
            Compliance & Quality
          </div>
          <h2 className={`${styles.secH} ${styles.reveal}`}>
            Certified to <span className={styles.hl}>Global Standards</span>
          </h2>
          <p>
            Every certification we hold is a promise to our clients — that we
            meet the strictest safety, quality, and compliance benchmarks in the
            world.
          </p>
        </div>
        <div className={styles.certGrid}>
          {CERTS.map((c, i) => (
            <div
              key={i}
              className={styles.certCard}
              style={{ transitionDelay: `${(i % 4) * 0.08}s` }}
            >
              <div className={styles.certLogo}>{c.logo}</div>
              <div className={styles.certName}>{c.name}</div>
              <div className={styles.certBody}>{c.body}</div>
              <span className={styles.certBadge}>{c.badge}</span>
            </div>
          ))}
        </div>
        <div className={`${styles.awardsStrip} ${styles.reveal}`}>
          {AWARDS.map((a, i) => (
            <div key={i} className={styles.awardItem}>
              <div className={styles.awardIcon}>{a.icon}</div>
              <div className={styles.awardName}>{a.name}</div>
              <div className={styles.awardBody}>{a.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section className={styles.partners}>
        <div className={styles.partnersHead}>
          <div className={`${styles.secTagCenter} ${styles.reveal}`}>
            Our Network
          </div>
          <h2 className={`${styles.secH} ${styles.reveal}`}>
            Carrier & Alliance <span className={styles.hl}>Partners</span>
          </h2>
          <p>
            Space guaranteed with 40+ airlines, 15 ocean carriers, and 200+ road
            partners across India.
          </p>
        </div>
        <div className={styles.partnerScroll}>
          <div className={styles.partnerTrack}>
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className={styles.partnerLogo}>
                {p}
              </div>
            ))}
          </div>
        </div>
        <p className={styles.partnersNote}>
          Logos shown for illustrative purposes. Actual partnerships may vary by
          trade lane.
        </p>
      </section>

      {/* ═══ SUSTAINABILITY ═══ */}
      <section className={styles.sustainability}>
        <div className={styles.sustGrid}>
          <div className={styles.sustContent}>
            <div className={`${styles.secTag} ${styles.reveal}`}>
              Green Logistics
            </div>
            <h2
              className={`${styles.secH} ${styles.reveal}`}
              style={{ transitionDelay: "0.08s", marginBottom: "1.1rem" }}
            >
              Moving the World <span className={styles.hl}>Responsibly</span>
            </h2>
            <p className={styles.reveal} style={{ transitionDelay: "0.12s" }}>
              At MahaveerTrans, sustainability is not a marketing promise — it's
              a measurable commitment. Our 2030 ESG roadmap targets net-zero
              Scope 1 & 2 emissions, a 40% electric fleet, and zero single-use
              plastic in all packaging operations.
            </p>
            <div
              className={`${styles.sustMetrics} ${styles.reveal}`}
              style={{ transitionDelay: "0.16s" }}
            >
              <div className={styles.smCard}>
                <div className={styles.smVal}>40%</div>
                <div className={styles.smLbl}>
                  EV fleet target
                  <br />
                  by 2030
                </div>
              </div>
              <div className={styles.smCard}>
                <div className={styles.smVal}>18%</div>
                <div className={styles.smLbl}>
                  CO₂ reduction
                  <br />
                  achieved since 2020
                </div>
              </div>
              <div className={styles.smCard}>
                <div className={styles.smVal}>12 MW</div>
                <div className={styles.smLbl}>
                  Solar panels across
                  <br />
                  warehouse rooftops
                </div>
              </div>
              <div className={styles.smCard}>
                <div className={styles.smVal}>Zero</div>
                <div className={styles.smLbl}>
                  Single-use plastic target
                  <br />
                  by December 2026
                </div>
              </div>
            </div>
            <div
              className={`${styles.esgPills} ${styles.reveal}`}
              style={{ transitionDelay: "0.2s" }}
            >
              {[
                "🌱 Net Zero by 2035",
                "☀️ Solar-powered hubs",
                "⚡ EV last-mile fleet",
                "♻️ Returnable packaging",
                "🌊 Carbon offset credits",
              ].map((pill, i) => (
                <span key={i} className={styles.esgPill}>
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <div
            className={`${styles.sustVisual} ${styles.reveal}`}
            style={{ transitionDelay: "0.1s" }}
          >
            <img
              className={styles.sustImg}
              src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80&auto=format&fit=crop"
              alt="Green fleet"
            />
            <div className={styles.sustPledge}>
              <div className={styles.spVal}>Net Zero</div>
              <div className={styles.spLbl}>Committed by 2035</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OFFICES ═══ */}
      <section className={styles.offices}>
        <div className={styles.officesHead}>
          <div className={styles.reveal}>
            <div className={styles.secTag}>Where We Are</div>
            <h2 className={styles.secH}>
              Global <span className={styles.hl}>Office Network</span>
            </h2>
          </div>
          <p className={styles.officesHeadNote}>
            12 owned offices, 180+ country partnerships. Wherever your cargo
            needs to go, someone local is managing it.
          </p>
        </div>
        <div className={styles.officesGrid}>
          {OFFICES.map((o, i) => (
            <div
              key={i}
              className={styles.officeCard}
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              <div className={styles.officeFlag}>{o.flag}</div>
              <div className={styles.officeCity}>{o.city}</div>
              <div className={styles.officeType}>{o.type}</div>
              <div className={styles.officeAddr}>{o.addr}</div>
              <div className={styles.officeTags}>
                {o.tags.map((tag, j) => (
                  <span key={j} className={styles.officeTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section className={styles.whyUs}>
        <div className={styles.whyInner}>
          <div className={styles.whyHead}>
            <div className={`${styles.secTagCenter} ${styles.reveal}`}>
              Why MahaveerTrans
            </div>
            <h2
              className={`${styles.secH} ${styles.reveal}`}
              style={{ color: "#f1f5f9" }}
            >
              What Sets Us <span className={styles.hl}>Apart</span>
            </h2>
            <p>
              We're often compared to both global 3PLs and local freight
              brokers. Here's why we outperform both.
            </p>
          </div>
          <div className={styles.whyGrid}>
            {WHY.map((w, i) => (
              <div
                key={i}
                className={styles.whyCard}
                style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
              >
                <div className={styles.whyIcon}>{w.icon}</div>
                <div className={styles.whyTitle}>{w.title}</div>
                <div className={styles.whyDesc}>{w.desc}</div>
              </div>
            ))}
          </div>
          <div
            className={`${styles.whyVs} ${styles.reveal}`}
            style={{ transitionDelay: "0.2s" }}
          >
            <div className={`${styles.vsCol} ${styles.vsColOurs}`}>
              <h4>✦ MahaveerTrans</h4>
              {[
                "Dedicated account manager from day one",
                "AI-generated quote in 60 seconds",
                "Real-time tracking with 5-min GPS pings",
                "GDP & IMDG certified for all cargo types",
                "Transparent pricing — no hidden surcharges",
                "24/7 live ops team, not just a chatbot",
                "REST API + WMS integration in 2 days",
              ].map((item, i) => (
                <div key={i} className={`${styles.vsItem} ${styles.vsItemYes}`}>
                  <span className={styles.vsMark}>✓</span>
                  {item}
                </div>
              ))}
            </div>
            <div className={`${styles.vsCol} ${styles.vsColTheirs}`}>
              <h4>Typical Competitors</h4>
              {[
                "Generic account pool, high turnover",
                "Manual quote process, 24–48 hr wait",
                "Milestone updates only, no live map",
                "Limited compliance for specialized cargo",
                "Fuel surcharges added at invoice stage",
                "Email-only support after business hours",
                "Legacy EDI, weeks of IT onboarding",
              ].map((item, i) => (
                <div key={i} className={`${styles.vsItem} ${styles.vsItemNo}`}>
                  <span className={styles.vsMark}>✗</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className={styles.testimonials}>
        <div className={styles.testHead}>
          <div className={`${styles.secTagCenter} ${styles.reveal}`}>
            Client Stories
          </div>
          <h2 className={`${styles.secH} ${styles.reveal}`}>
            Words from Our <span className={styles.hl}>Partners</span>
          </h2>
          <p>
            Real outcomes, real businesses — across pharmaceuticals, e-commerce,
            and heavy industry.
          </p>
        </div>
        <div className={styles.testGrid}>
          {TESTS.map((t, i) => (
            <div
              key={i}
              className={styles.tcCard}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={styles.tcStars}>{t.stars}</div>
              <p className={styles.tcText}>"{t.text}"</p>
              <div className={styles.tcAuthor}>
                <img className={styles.tcAv} src={t.img} alt={t.name} />
                <div>
                  <div className={styles.tcName}>{t.name}</div>
                  <div className={styles.tcRole}>{t.role}</div>
                </div>
                <div className={styles.tcLogo}>{t.logo}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className={styles.ctaBanner}>
        <div className={`${styles.ctaInner} ${styles.reveal}`}>
          <div className={styles.secTagCenter}>Ready to Ship?</div>
          <h2
            className={styles.secH}
            style={{ color: "#f1f5f9", marginBottom: "1.1rem" }}
          >
            25 Years of Trust.
            <br />
            <span className={styles.hl}>Your Shipment Next.</span>
          </h2>
          <p>
            Join 3,500+ businesses who trust MahaveerTrans with their supply
            chain. Talk to a logistics expert — no commitment required.
          </p>
          <div className={styles.ctaBtns}>
            <button
              className={styles.btnW}
              onClick={() => (window.location.href = "/quote")}
            >
              🚀 Get Free Quote →
            </button>
            <button className={styles.btnWg}>📞 +91 22 4001 8000</button>
          </div>
        </div>
      </section>
    </>
  );
}
