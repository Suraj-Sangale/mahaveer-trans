"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/contact.module.css";
import { scrollSectionIntoView } from "@/utilities/utils";

// ── Department quick-select options ──────────────────────────────────────────
const DEPARTMENTS = [
  { key: "General Inquiry", icon: "💬" },
  { key: "Freight Quote", icon: "📦" },
  { key: "Tracking Help", icon: "📍" },
  { key: "Billing", icon: "💳" },
  { key: "Partnership", icon: "🤝" },
];

// ── Contact info cards data ───────────────────────────────────────────────────
const CONTACT_CARDS = [
  {
    icon: "📞",
    iconBg: "rgba(14,165,233,0.12)",
    label: "Phone",
    value: "+91 70395 29129",
    href: "tel:+917039529129",
  },
  {
    icon: "✉️",
    iconBg: "rgba(16,163,74,0.12)",
    label: "Email",
    value: "info@mahaveertrans.com",
    href: "mailto:info@mahaveertrans.com",
  },
  {
    icon: "💬",
    iconBg: "rgba(37,211,102,0.12)",
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/+917039529129",
  },
  {
    icon: "🌐",
    iconBg: "rgba(124,58,237,0.12)",
    label: "Website",
    value: "mahaveertrans.com",
    href: "https://mahaveertrans.com",
  },
];

const BUSINESS_HOURS = [
  { day: "Monday – Friday", time: "9:00 AM – 7:00 PM", open: true },
  { day: "Saturday - Sunday", time: "9:00 AM – 4:00 PM", open: true },
  // { day: "",          time: "Closed",             open: false },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function ContactWrapper() {
  const [department, setDepartment] = useState(DEPARTMENTS[0].key);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");

  // Load fonts once
  useEffect(() => {
    const id = "contact-page-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // Reset field errors after 2.5 s
  useEffect(() => {
    if (Object.keys(fieldErrors).length === 0) return;
    const t = setTimeout(() => setFieldErrors({}), 2500);
    return () => clearTimeout(t);
  }, [fieldErrors]);

  async function handleSubmit(e) {
    e.preventDefault();

    const errs = {};
    if (!name.trim()) errs.name = true;
    if (!email.trim()) errs.email = true;
    if (!subject.trim()) errs.subject = true;
    if (!message.trim()) errs.message = true;

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          subject,
          department,
          message,
        }),
      });
      const json = await res.json();
      if (!json.ok)
        throw new Error(json.error || "Server error — please try again.");
      setReference(json.reference);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    setFieldErrors({});
    setSubmitError("");
    setReference("");
    setDepartment(DEPARTMENTS[0].key);
  }

  const isSuccess = Boolean(reference);

  const handlePartnerClick = () => {
    setDepartment("Partnership");
    setSubject("Partnership");
    scrollSectionIntoView("contact-form");
  };

  return (
    <div className={styles.root}>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Contact hero">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroGlow1} aria-hidden="true" />
        <div className={styles.heroGlow2} aria-hidden="true" />

        <div className={styles.heroTag}>
          <span className={styles.heroTagDot} />
          We reply within 1 business hour
        </div>

        <h1 className={styles.heroH}>
          Let&apos;s <span className={styles.heroHl}>Connect</span>
        </h1>
        <p className={styles.heroSub}>
          Have a shipment question, need a custom quote, or want to explore a
          partnership? Our team is ready to help — reach us any way you prefer.
        </p>

        <div className={styles.heroPills}>
          {[
            { dot: "#0ea5e9", text: "24 / 7 live support" },
            { dot: "#16a34a", text: "1-hour response" },
            { dot: "#f59e0b", text: "Dedicated account managers" },
            { dot: "#7c3aed", text: "Offices in Mumbai" },
          ].map(({ dot, text }) => (
            <span key={text} className={styles.heroPill}>
              <span
                className={styles.heroPillDot}
                style={{ background: dot }}
              />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ── MAIN GRID ─────────────────────────────────────────── */}
      <div className={styles.main}>
        {/* LEFT — info + map */}
        <div className={styles.infoPanel}>
          <h2 className={styles.infoTitle}>Get in Touch</h2>
          <p className={styles.infoSub}>
            Reach us through any of the channels below, or fill in the form and
            we&apos;ll reach out within one business hour.
          </p>

          {/* Contact cards */}
          <div className={styles.cardGrid}>
            {CONTACT_CARDS.map(({ icon, iconBg, label, value, href }) => (
              <div key={label} className={styles.card}>
                <div className={styles.cardIcon} style={{ background: iconBg }}>
                  {icon}
                </div>
                <div className={styles.cardWrapper}>
                  <div className={styles.cardLabel}>{label}</div>
                  <div className={styles.cardValue}>
                    <a
                      href={href}
                      className={styles.cardLink}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {value}
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* Address — full width */}
            <div className={`${styles.card} ${styles.cardWide}`}>
              <div
                className={styles.cardIcon}
                style={{ background: "rgba(245,158,11,0.12)" }}
              >
                📍
              </div>
              <div className={styles.cardWrapper}>
                <div className={styles.cardLabel}>Head Office</div>
                <div className={styles.cardValue}>
                  Mahaveer Trans Solutions, Mumbai, Maharashtra, India
                </div>
              </div>
            </div>

           
          </div>

          {/* Business hours */}
          <div className={styles.hoursStrip}>
            <div className={styles.hoursTitle}>🕐 Business Hours (IST)</div>
            {BUSINESS_HOURS.map(({ day, time, open }) => (
              <div key={day} className={styles.hoursRow}>
                <span className={styles.hoursDay}>{day}</span>
                <span className={styles.hoursTime}>{time}</span>
                {open && <span className={styles.hoursOpen}>OPEN</span>}
              </div>
            ))}
            
          </div>
           {/* 24×7 Support — full width */}
            <div className={`${styles.card} ${styles.cardWide} ${styles.supportCard}`}>
              <div
                className={styles.cardIcon}
                style={{ background: "rgba(99,102,241,0.12)" }}
              >
                🛟
              </div>
              <div className={styles.cardWrapper}>
                <div className={styles.cardLabel}>24 × 7 Support</div>
                <div className={styles.cardValue}>
                  Our team is available around the clock — day, night, weekends
                  &amp; holidays.
                </div>
              </div>
              <span className={styles.supportBadge}>Always On</span>
            </div>
          

          {/* Google Maps embed */}
          <div className={styles.mapWrap}>
            <iframe
              className={styles.mapIframe}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d766.2879506340703!2d73.1066178!3d19.026704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e9c61a3796b5%3A0x297b39134e618b02!2sBima%20Complex%2C%20Guru%20Kripa%20Hotel%2C%20D-1097%2C%20Steel%20Market%20Rd%2C%20Sector%20AWC%2C%20Kalamboli%2C%20Panvel%2C%20Maharashtra%20410218!5e0!3m2!1sen!2sin!4v1693000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MahaveerTrans Office Location"
            />
            <a
              href="https://www.google.com/maps/place/Bima+Complex,+Guru+Kripa+Hotel,+D-1097,+Steel+Market+Rd,+Sector+AWC,+Kalamboli,+Panvel,+Maharashtra+410218/@19.026704,73.1066178,766m"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapOverlayBtn}
              aria-label="Open in Google Maps"
            >
              📍 Open in Google Maps
            </a>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className={styles.formPanel}>
          {isSuccess ? (
            /* ── SUCCESS STATE ── */
            <div className={styles.successWrap}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successH}>Message Sent!</h2>
              <p className={styles.successSub}>
                Thanks for reaching out. We&apos;ve received your message and
                will reply within one business hour.
              </p>
              <div className={styles.successRef}>
                <div className={styles.successRefLabel}>Your Reference</div>
                <div className={styles.successRefNum}>{reference}</div>
              </div>
              <button className={styles.btnNewMsg} onClick={resetForm}>
                Send another message
              </button>
            </div>
          ) : (
            /* ── FORM STATE ── */
            <>
              <h2 className={styles.formTitle} id="contact-form">
                Send a Message
              </h2>
              <p className={styles.formSub}>
                Select a topic and fill in the form — we&apos;ll route it to the
                right team automatically.
              </p>

              {/* Department tabs */}
              <div
                className={styles.deptTabs}
                role="group"
                aria-label="Department"
              >
                {DEPARTMENTS.map(({ key, icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.deptTab} ${department === key ? styles.deptTabActive : ""}`}
                    onClick={() => {
                      setDepartment(key);
                      setSubject(key);
                    }}
                    aria-pressed={department === key}
                  >
                    {icon} {key}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Row 1 — name + company */}
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="ct-name" className={styles.fieldLabel}>
                      Full Name<span className={styles.req}>*</span>
                    </label>
                    <input
                      id="ct-name"
                      type="text"
                      className={`${styles.fieldInput} ${fieldErrors.name ? styles.error : ""}`}
                      placeholder="Ramesh Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="ct-company" className={styles.fieldLabel}>
                      Company{" "}
                      <span style={{ color: "var(--muted2)", fontWeight: 400 }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      id="ct-company"
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Acme Exports Pvt. Ltd."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      autoComplete="organization"
                    />
                  </div>
                </div>

                {/* Row 2 — email + phone */}
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="ct-email" className={styles.fieldLabel}>
                      Email<span className={styles.req}>*</span>
                    </label>
                    <input
                      id="ct-email"
                      type="email"
                      className={`${styles.fieldInput} ${fieldErrors.email ? styles.error : ""}`}
                      placeholder="ramesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="ct-phone" className={styles.fieldLabel}>
                      Phone{" "}
                      <span style={{ color: "var(--muted2)", fontWeight: 400 }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      id="ct-phone"
                      type="tel"
                      className={styles.fieldInput}
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Row 3 — subject */}
                <div className={`${styles.fieldRow} ${styles.fieldRowSingle}`}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="ct-subject" className={styles.fieldLabel}>
                      Subject<span className={styles.req}>*</span>
                    </label>
                    <input
                      id="ct-subject"
                      type="text"
                      className={`${styles.fieldInput} ${fieldErrors.subject ? styles.error : ""}`}
                      placeholder="e.g. Air freight quote for electronics"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 4 — message */}
                <div className={`${styles.fieldRow} ${styles.fieldRowSingle}`}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="ct-message" className={styles.fieldLabel}>
                      Message<span className={styles.req}>*</span>
                    </label>
                    <textarea
                      id="ct-message"
                      className={`${styles.fieldTextarea} ${fieldErrors.message ? styles.error : ""}`}
                      placeholder="Tell us about your shipment or inquiry…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>

                {/* error alert */}
                {submitError && (
                  <div className={styles.alertErr} role="alert">
                    {submitError}
                  </div>
                )}

                {/* submit */}
                <div className={styles.formBottom}>
                  <button
                    id="ct-submit"
                    type="submit"
                    className={styles.btnSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className={styles.btnSubmitSpinner} />
                        Sending…
                      </>
                    ) : (
                      "Send Message →"
                    )}
                  </button>
                  <p className={styles.formNote}>
                    🔒 Your data is never shared with third parties.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── BOTTOM CTA STRIP ────────────────────────────────────── */}
      <div className={styles.ctaRow}>
        <div className={styles.ctaCard}>
          <span className={styles.ctaEmoji}>📦</span>
          <div className={styles.ctaTitle}>Need a freight quote fast?</div>
          <p className={styles.ctaSub}>
            Use our 4-step quote form and get a detailed estimate in under 2
            minutes.
          </p>
          <a href="/quote" className={styles.ctaBtn}>
            Get a Quote →
          </a>
        </div>
        <div className={`${styles.ctaCard} ${styles.ctaCard2}`}>
          <span className={styles.ctaEmoji}>🤝</span>
          <div className={styles.ctaTitle}>Partner With Us</div>
          <p className={styles.ctaSub}>
            Looking for a reliable logistics partner? Let's build a long-term
            B2B relationship that scales with your business.
          </p>
          <button onClick={handlePartnerClick} className={styles.ctaBtn}>
            Start a Partnership →
          </button>
        </div>
      </div>
    </div>
  );
}
