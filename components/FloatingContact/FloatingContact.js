"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import "./FloatingContact.css";
import { constantsList } from "@/constant";

// ── Icons (Inline SVGs) ───────────────────────────────────────────────────────

function IconPhoneCall() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M14.05 2a9 9 0 0 1 8 7.94" />
      <path d="M14.05 6A5 5 0 0 1 18 10" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0284c7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16a34a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7c3aed"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <path d="M10 22v-4h4v4" />
    </svg>
  );
}

// ── Contact Items Data ────────────────────────────────────────────────────────

const CONTACT_ITEMS = [
    {
    id: "sales",
    name: "Freight Quotes & Sales",
    role: "Rates for FTL, LTL, fleet & air cargo",
    badge: "Fast Quote",
    icon: <IconTruck />,
    iconBg: "rgba(22, 163, 74, 0.12)",
    actions: [
      {
        label: "Call",
        icon: <IconPhone />,
        href: `tel:${constantsList.CONTACT_NO || "+917039529129"}`,
        type: "call",
      },
      {
        label: "WhatsApp",
        icon: <IconWhatsApp />,
        href: `https://wa.me/+917039529129?text=Hi%20Mahaveer%20Trans,%20I%20would%20like%20to%20get%20a%20freight%20quote.`,
        type: "whatsapp",
        external: true,
      },
      {
        label: "Get Quote",
        icon: <IconQuote />,
        href: "/quote",
        type: "quote",
        internal: true,
      },
    ],
  },
  {
    id: "support",
    name: "Customer Support & Tracking",
    role: "Shipment status, POD & 24/7 help",
    badge: "24/7 Live",
    icon: <IconHeadset />,
    iconBg: "rgba(2, 132, 199, 0.12)",
    actions: [
      {
        label: "Call",
        icon: <IconPhone />,
        href: `tel:${constantsList.CONTACT_NO || "+917039529129"}`,
        type: "call",
      },
      {
        label: "WhatsApp",
        icon: <IconWhatsApp />,
        href: `https://wa.me/+917039529129?text=Hi%20Mahaveer%20Trans%20Support,%20I%20need%20help%20with%20shipment%20tracking.`,
        type: "whatsapp",
        external: true,
      },
      {
        label: "Email",
        icon: <IconMail />,
        href: `mailto:${constantsList.COMPANY_EMAIL || "info@mahaveertrans.com"}?subject=Support%20Inquiry`,
        type: "email",
      },
    ],
  },

  {
    id: "office",
    name: "Corporate Office (Mumbai)",
    role: "B2B partnerships, corporate logistics & contracts",
    badge: "Head Office",
    icon: <IconBuilding />,
    iconBg: "rgba(124, 58, 237, 0.12)",
    actions: [
      {
        label: "Email",
        icon: <IconMail />,
        href: `mailto:${constantsList.COMPANY_EMAIL || "info@mahaveertrans.com"}?subject=Corporate%20Inquiry`,
        type: "email",
      },
      {
        label: "Contact Form",
        icon: <IconQuote />,
        href: "/contact",
        type: "call",
        internal: true,
      },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closingTimer = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const handleOpen = useCallback(() => {
    clearTimeout(closingTimer.current);
    // Inform other widgets to close
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-floating-widget", { detail: { id: "contact-float" } })
      );
    }
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    closingTimer.current = setTimeout(() => setMounted(false), 240);
  }, []);

  const handleToggle = () => (open ? handleClose() : handleOpen());

  // Listen for events from other widgets
  useEffect(() => {
    const handleOtherOpen = (e) => {
      if (e.detail?.id !== "contact-float" && open) {
        handleClose();
      }
    };

    window.addEventListener("open-floating-widget", handleOtherOpen);
    return () => window.removeEventListener("open-floating-widget", handleOtherOpen);
  }, [open, handleClose]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        handleClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleClose]);

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        id="contact-float-trigger-btn"
        ref={triggerRef}
        className="contact-float-trigger"
        onClick={handleToggle}
        aria-label={open ? "Close Contact Panel" : "Call & Quick Contacts"}
        aria-expanded={open}
      >
        {open ? <IconX /> : <IconPhoneCall />}
        {!open && (
          <>
            <span className="contact-float-status-badge" aria-hidden="true" />
            <span className="contact-float-tooltip">Call &amp; Contacts</span>
          </>
        )}
      </button>

      {/* Floating Contact Panel */}
      {mounted && (
        <div
          id="contact-float-panel"
          ref={panelRef}
          className="contact-float-panel"
          data-open={String(open)}
          role="dialog"
          aria-label="Mahaveer Trans Quick Contacts"
          aria-modal="false"
        >
          {/* Header */}
          <div className="contact-float-header">
            <div className="contact-float-avatar">
              <IconPhoneCall />
            </div>
            <div className="contact-float-header-info">
              <div className="contact-float-header-title">Connect with Us</div>
              <div className="contact-float-header-sub">
                <span className="contact-float-status-dot" aria-hidden="true" />
                Team Available · Call, WhatsApp &amp; Mail
              </div>
            </div>
            <button
              id="contact-float-close-btn"
              className="contact-float-close"
              onClick={handleClose}
              aria-label="Close Contact Panel"
            >
              <IconX />
            </button>
          </div>

          {/* Body Cards */}
          <div className="contact-float-body" role="region" aria-label="Contact Options">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.id} className="contact-card-item">
                <div className="contact-card-top">
                  <div
                    className="contact-card-icon-wrap"
                    style={{ background: item.iconBg }}
                  >
                    {item.icon}
                  </div>
                  <div className="contact-card-details">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                      <div className="contact-card-name">{item.name}</div>
                      <span className="contact-card-badge">{item.badge}</span>
                    </div>
                    {/* <div className="contact-card-role">{item.role}</div> */}
                  </div>
                </div>

                <div className="contact-card-actions">
                  {item.actions.map((act, idx) => {
                    const actionClass = `contact-action-btn contact-action-${act.type}`;

                    if (act.internal) {
                      return (
                        <Link
                          key={idx}
                          href={act.href}
                          className={actionClass}
                          onClick={handleClose}
                        >
                          {act.icon}
                          <span>{act.label}</span>
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={idx}
                        href={act.href}
                        className={actionClass}
                        target={act.external ? "_blank" : undefined}
                        rel={act.external ? "noopener noreferrer" : undefined}
                      >
                        {act.icon}
                        <span>{act.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="contact-float-footer">
            {/* <div className="contact-footer-note">
              <span>⏱️ Quick response within 1 business hour</span>
              <span>📍 Mumbai, IN</span>
            </div> */}
            <Link
              href="/contact"
              className="contact-footer-link"
              onClick={handleClose}
            >
              Open Full Contact Form &amp; Location Map →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
