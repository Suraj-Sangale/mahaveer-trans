"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "@/styles/analytics.module.css";

// ── Utility Functions ──────────────────────────────────────────────────────────

function timeAgo(dateString) {
  if (!dateString) return "just now";
  const seconds = Math.floor(
    (new Date().getTime() - new Date(dateString).getTime()) / 1000,
  );
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getEventBadge(type) {
  switch (type) {
    case "quote_submit":
      return {
        label: "Quote Submitted",
        icon: "📝",
        badgeClass: "badgeQuote",
        dotClass: "badgeDotQuote",
      };
    case "contact_submit":
      return {
        label: "Contact Message",
        icon: "✉️",
        badgeClass: "badgeContact",
        dotClass: "badgeDotContact",
      };
    case "phone_click":
      return {
        label: "Phone Call Click",
        icon: "📞",
        badgeClass: "badgePhone",
        dotClass: "badgeDotPhone",
      };
    case "whatsapp_click":
      return {
        label: "WhatsApp Click",
        icon: "💬",
        badgeClass: "badgeWhatsapp",
        dotClass: "badgeDotWhatsapp",
      };
    case "quote_intent":
      return {
        label: "Quote CTA Click",
        icon: "🎯",
        badgeClass: "badgeIntent",
        dotClass: "badgeDotIntent",
      };
    case "chat_open":
      return {
        label: "AI Chat Opened",
        icon: "🤖",
        badgeClass: "badgeChat",
        dotClass: "badgeDotChat",
      };
    case "heartbeat":
      return {
        label: "Active Heartbeat",
        icon: "💓",
        badgeClass: "badgeHeartbeat",
        dotClass: "badgeDotHeartbeat",
      };
    default:
      return {
        label: "Page View",
        icon: "👁️",
        badgeClass: "badgePageview",
        dotClass: "badgeDotPageview",
      };
  }
}

// Generates smooth SVG mini sparkline path
function generateSparkline(data = [], color = "#38bdf8") {
  if (!data || data.length < 2) {
    return (
      <svg
        width="68"
        height="24"
        viewBox="0 0 68 24"
        fill="none"
        className={styles.sparklineSvg}
      >
        <path
          d="M0 12 L68 12"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.4"
        />
      </svg>
    );
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 68;
  const step = width / (data.length - 1);

  const points = data.map((val, idx) => {
    const x = idx * step;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={styles.sparklineSvg}
    >
      <defs>
        <linearGradient
          id={`grad-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`} />
      <path
        d={pathD}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Component: Tooltip Wrapper ──────────────────────────────────────────────────

function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={styles.tooltipBox}>
          {content}
          <div className={styles.tooltipArrow} />
        </div>
      )}
    </div>
  );
}

// ── Component: KPI Card ─────────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  subtext,
  trend,
  sparkData,
  color,
  tooltip,
  isLive,
}) {
  const trendClass = trend?.startsWith("+")
    ? styles.trendUp
    : trend?.startsWith("-")
      ? styles.trendDown
      : styles.trendNeutral;

  return (
    <div className={styles.kpiCard}>
      {/* Top row: Title and Tooltip */}
      <div className={styles.kpiTopRow}>
        <div className={styles.kpiTitleGroup}>
          <span className={styles.kpiTitle}>{title}</span>
          {tooltip && (
            <Tooltip content={tooltip}>
              <span className={styles.tooltipTrigger}>?</span>
            </Tooltip>
          )}
        </div>

        {isLive ? (
          <span className={styles.kpiLiveBadge}>
            <span className={styles.kpiLiveDot} />
            LIVE
          </span>
        ) : (
          <div>{generateSparkline(sparkData, color)}</div>
        )}
      </div>

      {/* Primary Value */}
      <div className={styles.kpiValue}>
        {value !== undefined && value !== null ? value : "—"}
      </div>

      {/* Subtext and Trend */}
      <div className={styles.kpiBottomRow}>
        <span className={styles.kpiSubtext}>{subtext}</span>
        {trend && <span className={trendClass}>{trend}</span>}
      </div>
    </div>
  );
}

// ── Main Dashboard Component ───────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [range, setRange] = useState("7d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");
  const [isClearing, setIsClearing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);


  // Authentication Check
  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem("_mt_admin_auth");
      if (savedAuth === "verified") {
        setIsAuthenticated(true);
      }
    } catch (e) {
      // ignore
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handlePinSubmit = async (e) => {
    if (e) e.preventDefault();
    setPinError("");
    try {
      const res = await fetch("/api/analytics/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_pin", pin: pinInput.trim() }),
      });
      const json = await res.json();
      if (json.ok && json.verified) {
        setIsAuthenticated(true);
        sessionStorage.setItem("_mt_admin_auth", "verified");
        fetchData(range, true);
      } else {
        setPinError(json.error || "Incorrect PIN. Default is 1234.");
      }
    } catch (err) {
      setPinError("Failed to verify PIN. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("_mt_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const fetchData = useCallback(
    async (selectedRange = range, showSpinner = false) => {
      if (showSpinner) setLoading(true);
      try {
        const res = await fetch(`/api/analytics/stats?range=${selectedRange}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.ok) {
        const sampl =  {
  "isCloudStorage": true,
  "realtimeActiveVisitors": 1,
  "totalPageViews": 5,
  "uniqueVisitors": 2,
  "totalSessions": 3,
  "avgPagesPerSession": 1.7,
  "conversions": {
    "quotes": 0,
    "contacts": 0,
    "phoneClicks": 1,
    "whatsappClicks": 0,
    "chatInteractions": 0,
    "trackingLookups": 0,
    "totalConversions": 1,
    "conversionRate": 50
  },
  "cities": [
    {
      "name": "Mumbai",
      "count": 9,
      "percentage": 100
    },
    {
      "name": "pune",
      "count": 9,
      "percentage": 101
    },
    {
      "name": "Goa",
      "count": 9,
      "percentage": 10
    },
     {
      "name": "Nashik",
      "count": 9,
      "percentage": 10
    },
  {
      "name": "Kolkata",
      "count": 9,
      "percentage": 10
    },
  ],
  "states": [
    {
      "name": "Maharashtra",
      "count": 9,
      "percentage": 100
    }
  ],
  "countries": [
    {
      "name": "India",
      "count": 9,
      "percentage": 100
    }
  ],
  "topPages": [
    {
      "path": "/contact",
      "views": 3,
      "uniqueVisitors": 2
    },
    {
      "path": "/",
      "views": 1,
      "uniqueVisitors": 1
    },
    {
      "path": "/services",
      "views": 1,
      "uniqueVisitors": 1
    }
  ],
  "referrers": [
    {
      "source": "localhost",
      "count": 4
    },
    {
      "source": "Direct / Bookmark",
      "count": 1
    }
  ],
  "devices": [
    {
      "name": "Desktop",
      "count": 9,
      "percentage": 100
    }
  ],
  "browsers": [
    {
      "name": "Chrome",
      "count": 9,
      "percentage": 100
    }
  ],
  "operatingSystems": [
    {
      "name": "Windows",
      "count": 9,
      "percentage": 100
    }
  ],
  "dailyActivity": [
    {
      "date": "2026-09-06",
      "views": 1,
      "visitors": 2,
      "conversions": 3
    },
    {
      "date": "2026-09-07",
      "views": 0,
      "visitors": 0,
      "conversions": 0
    },
    {
      "date": "2026-09-08",
      "views": 0,
      "visitors": 0,
      "conversions": 0
    },
    {
      "date": "2026-09-09",
      "views": 20,
      "visitors": 10,
      "conversions": 50
    },
    {
      "date": "2026-09-10",
      "views": 0,
      "visitors": 0,
      "conversions": 0
    },
    {
      "date": "2026-09-11",
      "views": 0,
      "visitors": 0,
      "conversions": 0
    },
    {
      "date": "2026-09-12",
      "views": 5,
      "visitors": 2,
      "conversions": 4
    }
  ],
  "recentVisits": [
    {
      "id": "1789234369485-s1ohk8c",
      "type": "pageview",
      "visitorId": "v_33rx80908mtyhyzjn",
      "sessionId": "s_8rjh0nttjmtymlyed",
      "path": "/",
      "title": "MahaveerTrans — Modern Logistics",
      "referrer": "http://localhost:3000/",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1366x768",
      "language": "en",
      "meta": {
        "path": "/"
      },
      "timestamp": "2026-09-12T17:32:49.485Z"
    },
    {
      "id": "1789234360892-5gvv3aw",
      "type": "pageview",
      "visitorId": "v_33rx80908mtyhyzjn",
      "sessionId": "s_azr7yk20nmtymu99m",
      "path": "/contact",
      "title": "Contact Us — MahaveerTrans",
      "referrer": "http://localhost:3000/contact",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1366x768",
      "language": "en",
      "meta": {
        "path": "/contact"
      },
      "timestamp": "2026-09-12T17:32:40.892Z"
    },
    {
      "id": "1789232986706-c9amapy",
      "type": "heartbeat",
      "visitorId": "v_ci4e4vgywmtyid4uo",
      "sessionId": "s_drc7derdgmtyid4up",
      "path": "/services",
      "title": "MahaveerTrans — Modern Logistics",
      "referrer": "http://localhost:3000/contact",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1440x900",
      "language": "en-US",
      "meta": {
        "path": "/services"
      },
      "timestamp": "2026-09-12T17:09:46.706Z"
    },
    {
      "id": "1789232835761-37jupdp",
      "type": "heartbeat",
      "visitorId": "v_ci4e4vgywmtyid4uo",
      "sessionId": "s_drc7derdgmtyid4up",
      "path": "/services",
      "title": "MahaveerTrans — Modern Logistics",
      "referrer": "http://localhost:3000/contact",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1440x900",
      "language": "en-US",
      "meta": {
        "path": "/services"
      },
      "timestamp": "2026-09-12T17:07:15.761Z"
    },
    {
      "id": "1789232685802-r89wzm1",
      "type": "pageview",
      "visitorId": "v_ci4e4vgywmtyid4uo",
      "sessionId": "s_drc7derdgmtyid4up",
      "path": "/services",
      "title": "",
      "referrer": "http://localhost:3000/contact",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1440x900",
      "language": "en-US",
      "meta": {
        "path": "/services"
      },
      "timestamp": "2026-09-12T17:04:45.803Z"
    },
    {
      "id": "1789232683627-4j45zfl",
      "type": "pageview",
      "visitorId": "v_ci4e4vgywmtyid4uo",
      "sessionId": "s_drc7derdgmtyid4up",
      "path": "/contact",
      "title": "Contact Us — MahaveerTrans",
      "referrer": "http://localhost:3000/contact",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1440x900",
      "language": "en-US",
      "meta": {
        "path": "/contact"
      },
      "timestamp": "2026-09-12T17:04:43.627Z"
    },
    {
      "id": "1789232680190-cq3zpb5",
      "type": "heartbeat",
      "visitorId": "v_33rx80908mtyhyzjn",
      "sessionId": "s_azr7yk20nmtymu99m",
      "path": "/contact",
      "title": "Contact Us — MahaveerTrans",
      "referrer": "",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1366x768",
      "language": "en",
      "meta": {
        "path": "/contact"
      },
      "timestamp": "2026-09-12T17:04:40.190Z"
    },
    {
      "id": "1789232530188-qqcedfd",
      "type": "pageview",
      "visitorId": "v_33rx80908mtyhyzjn",
      "sessionId": "s_azr7yk20nmtymu99m",
      "path": "/contact",
      "title": "",
      "referrer": "",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1366x768",
      "language": "en",
      "meta": {
        "path": "/contact"
      },
      "timestamp": "2026-09-12T17:02:10.188Z"
    },
    {
      "id": "1789232205391-s81vm0p",
      "type": "phone_click",
      "visitorId": "v_33rx80908mtyhyzjn",
      "sessionId": "s_8rjh0nttjmtymlyed",
      "path": "/",
      "title": "MahaveerTrans — Modern Logistics",
      "referrer": "",
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop",
      "ip": "127.0.0.1",
      "country": "India",
      "state": "Maharashtra",
      "city": "Mumbai",
      "screen": "1366x768",
      "language": "en",
      "meta": {
        "href": "tel:+917039529129",
        "label": "Call"
      },
      "timestamp": "2026-09-12T16:56:45.391Z"
    }
  ]
}
          setData(sampl);
          // setData(json.data);
          setLastRefreshed(new Date());
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    },
    [range],
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(range, true);
    }
  }, [isAuthenticated, range, fetchData]);

  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(range, false);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh, range, fetchData]);

  const handleClearData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all analytics tracking records? This cannot be undone.",
      )
    ) {
      return;
    }
    setIsClearing(true);
    try {
      const res = await fetch("/api/analytics/stats", { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        fetchData(range, true);
      }
    } catch (err) {
      console.error("Failed to clear data:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const copyToClipboard = (text, id) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filtered Events
  const filteredVisits = useMemo(() => {
    if (!data?.recentVisits) return [];
    return data.recentVisits.filter((v) => {
      if (eventTypeFilter !== "all") {
        if (eventTypeFilter === "conversions") {
          if (
            ![
              "quote_submit",
              "contact_submit",
              "phone_click",
              "whatsapp_click",
              "quote_intent",
            ].includes(v.type)
          )
            return false;
        } else if (v.type !== eventTypeFilter) {
          return false;
        }
      }

      if (pageFilter !== "all" && v.path !== pageFilter) {
        return false;
      }

      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        (v.path && v.path.toLowerCase().includes(q)) ||
        (v.browser && v.browser.toLowerCase().includes(q)) ||
        (v.os && v.os.toLowerCase().includes(q)) ||
        (v.device && v.device.toLowerCase().includes(q)) ||
        (v.ip && v.ip.toLowerCase().includes(q)) ||
        (v.city && v.city.toLowerCase().includes(q)) ||
        (v.state && v.state.toLowerCase().includes(q)) ||
        (v.country && v.country.toLowerCase().includes(q)) ||
        (v.visitorId && v.visitorId.toLowerCase().includes(q)) ||
        (v.referrer && v.referrer.toLowerCase().includes(q)) ||
        (v.type && v.type.toLowerCase().includes(q))
      );
    });
  }, [data?.recentVisits, eventTypeFilter, pageFilter, searchTerm]);

  // Chart Calculations
  const dailyData = data?.dailyActivity || [];
  const maxDailyViews = useMemo(() => {
    if (!dailyData.length) return 1;
    return Math.max(...dailyData.map((d) => d.views), 1);
  }, [dailyData]);

  // Sparkline arrays
  const sparkViews = dailyData.map((d) => d.views);
  const sparkVisitors = dailyData.map((d) => d.visitors);
  const sparkConversions = dailyData.map((d) => d.conversions || 0);

  // ── PIN Screen ───────────────────────────────────────────────────────────────

  if (isCheckingAuth) {
    return (
      <div className={`${styles.dashboardWrapper} ${styles.authCenterWrapper}`}>
        <div className={styles.authLoadingBox}>
          <span className={styles.authLoadingDot} />
          Verifying security access...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`${styles.dashboardWrapper} ${styles.authCenterWrapper}`}>
        <div className={`${styles.panelCard} ${styles.authCard}`}>
          <div className={styles.authIcon}>🔐</div>
          <h2 className={styles.authTitle}>MahaveerTrans Analytics</h2>
          <div className={`${styles.proBadge} ${styles.authProBadge}`}>
            ENTERPRISE PRO
          </div>
          <p className={styles.authDesc}>
            Enter your Admin PIN to unlock the live visitor tracking dashboard
            and fleet telemetry metrics.
          </p>

          <form onSubmit={handlePinSubmit}>
            <div className={styles.authInputGroup}>
              <input
                type="password"
                placeholder="Enter PIN (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                maxLength={12}
                className={`${styles.textInput} ${styles.pinInput}`}
              />
              {pinError && <div className={styles.pinError}>⚠️ {pinError}</div>}
            </div>

            <button
              type="submit"
              className={`${styles.rangeBtnActive} ${styles.authSubmitBtn}`}
            >
              Unlock Analytics Dashboard →
            </button>
          </form>

          <div className={styles.authFooter}>
            <Link href="/" className={styles.authBackLink}>
              ← Return to Website
            </Link>
            <span className={styles.authFooterText}>Default PIN: 1234</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated View ────────────────────────────────────────────────────────

  const conv = data?.conversions || {
    quotes: 0,
    contacts: 0,
    phoneClicks: 0,
    whatsappClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
  };
  const uniqueVisitors = data?.uniqueVisitors || 0;
  const totalPageViews = data?.totalPageViews || 0;
  const totalSessions = data?.totalSessions || 0;
  const avgPagesPerSession = data?.avgPagesPerSession || 0;
  const realtimeActive = data?.realtimeActiveVisitors || 0;

  return (
    <div className={styles.dashboardWrapper}>
      {/* ── TOP HEADER ──────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Brand & Status */}
          <div className={styles.headerBrandSection}>
            <Link href="/" className={styles.backBtn}>
              <span>← Main Site</span>
            </Link>

            <span className={styles.headerDivider}>|</span>

            <div>
              <div className={styles.headerBrandRow}>
                <div className={styles.brandDot} />
                <h1 className={styles.brandTitle}>MahaveerTrans Analytics</h1>
                <span className={styles.proBadge}>PRO</span>
                {data?.isCloudStorage ? (
                  <span className={styles.cloudBadge}>☁️ Cloud Synced</span>
                ) : (
                  <span
                    className={styles.serverlessBadge}
                    title="Add Upstash Redis in .env to persist across Vercel deployments"
                  >
                    ⚡ Serverless Mode
                  </span>
                )}
              </div>

              <div className={styles.statusSubtext}>
                <span className={styles.liveStatusBadge}>
                  <span
                    className={
                      autoRefresh
                        ? styles.statusIndicatorDot
                        : styles.statusIndicatorDotInactive
                    }
                  />
                  <span
                    className={
                      autoRefresh
                        ? styles.statusIndicatorText
                        : styles.statusIndicatorTextInactive
                    }
                  >
                    {autoRefresh
                      ? "Live Tracking Active"
                      : "Auto-Refresh Paused"}
                  </span>
                </span>
                <span>•</span>
                <span>
                  Updated:{" "}
                  {lastRefreshed.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className={styles.headerActions}>
            {/* Date Range Selector */}
            <div className={styles.rangeContainer}>
              {[
                { id: "today", label: "Today" },
                { id: "7d", label: "Last 7 Days" },
                { id: "30d", label: "Last 30 Days" },
                { id: "all", label: "All Time" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`${styles.rangeBtn} ${range === r.id ? styles.rangeBtnActive : ""}`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Live Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`${styles.actionBtn} ${autoRefresh ? styles.liveToggleBtnActive : styles.liveToggleBtnInactive}`}
            >
              🔄 {autoRefresh ? "Live ON" : "Live OFF"}
            </button>

            {/* Refresh */}
            <button
              onClick={() => fetchData(range, true)}
              disabled={loading}
              className={styles.actionBtn}
            >
              {loading ? "..." : "Refresh"}
            </button>

            {/* CSV Export */}
            <a
              href="/api/analytics/stats?export=csv"
              className={`${styles.actionBtn} ${styles.exportBtn}`}
            >
              📥 Export CSV
            </a>

            {/* Reset Data */}
            <button
              onClick={handleClearData}
              disabled={isClearing}
              className={`${styles.actionBtn} ${styles.resetBtn}`}
            >
              Reset
            </button>

            {/* Lock */}
            <button
              onClick={handleLogout}
              title="Lock Dashboard"
              className={styles.actionBtn}
            >
              🔒 Lock
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ───────────────────────────────────────────── */}
      <main className={styles.mainContent}>
        {/* ── 1. EXECUTIVE OVERVIEW (10 KPI CARDS GRID) ──────────────────────── */}
        <section className={styles.executiveSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                Executive Performance Overview
              </h2>
              <p className={styles.sectionSubtitle}>
                Key conversion metrics and high-intent customer actions (
                {range === "today"
                  ? "Today"
                  : range === "7d"
                    ? "Past 7 Days"
                    : range === "30d"
                      ? "Past 30 Days"
                      : "All Time"}
                )
              </p>
            </div>
            <div className={styles.crPill}>
              <span className={styles.crPillLabel}>Conversion Rate:</span>
              <span className={styles.crPillValue}>{conv.conversionRate}%</span>
            </div>
          </div>

          <div className={styles.kpiGrid}>
            <KpiCard
              title="Quotes Submitted"
              value={conv.quotes}
              subtext="Full freight inquiries"
              trend={conv.quotes > 0 ? `+${conv.quotes} new` : "0 in period"}
              sparkData={sparkConversions}
              color="#a855f7"
              tooltip="Total detailed freight quote requests submitted by potential clients"
            />

            <KpiCard
              title="Contact Messages"
              value={conv.contacts}
              subtext="Direct customer inquiries"
              trend={
                conv.contacts > 0 ? `+${conv.contacts} new` : "0 in period"
              }
              sparkData={sparkConversions}
              color="#3b82f6"
              tooltip="Total submissions through the contact form"
            />

            <KpiCard
              title="Phone Call Clicks"
              value={conv.phoneClicks}
              subtext="Direct call actions"
              trend={
                conv.phoneClicks > 0
                  ? `+${conv.phoneClicks} calls`
                  : "0 in period"
              }
              sparkData={sparkConversions}
              color="#f59e0b"
              tooltip="Total times visitors clicked the telephone number to call"
            />

            <KpiCard
              title="WhatsApp Clicks"
              value={conv.whatsappClicks}
              subtext="Instant chat initiates"
              trend={
                conv.whatsappClicks > 0
                  ? `+${conv.whatsappClicks} chats`
                  : "0 in period"
              }
              sparkData={sparkConversions}
              color="#10b981"
              tooltip="Total clicks on WhatsApp chat buttons and floating contact links"
            />

            <KpiCard
              title="Total Inquiries"
              value={conv.totalConversions}
              subtext="All combined leads"
              trend={
                conv.totalConversions > 0
                  ? `${conv.conversionRate}% CR`
                  : "0% CR"
              }
              sparkData={sparkConversions}
              color="#06b6d4"
              tooltip="Aggregate sum of Quotes, Contacts, Phone Calls, and WhatsApp inquiries"
            />

            <KpiCard
              title="Active Visitors"
              value={realtimeActive}
              subtext="Active in last 5 min"
              trend="Real-time pulse"
              sparkData={sparkVisitors}
              color="#22c55e"
              tooltip="Current users actively browsing pages on the website right now"
              isLive={true}
            />

            <KpiCard
              title="Total Page Views"
              value={totalPageViews.toLocaleString()}
              subtext="Total page impressions"
              trend={totalPageViews > 0 ? "100% traffic" : "0 views"}
              sparkData={sparkViews}
              color="#38bdf8"
              tooltip="Total volume of pages served across all visitor sessions"
            />

            <KpiCard
              title="Unique Visitors"
              value={uniqueVisitors.toLocaleString()}
              subtext="Distinct devices/clients"
              trend={uniqueVisitors > 0 ? `${uniqueVisitors} users` : "0 users"}
              sparkData={sparkVisitors}
              color="#8b5cf6"
              tooltip="Number of distinct individuals or browsers that visited the site"
            />

            <KpiCard
              title="Browsing Sessions"
              value={totalSessions.toLocaleString()}
              subtext="Visits initiated"
              trend={
                totalSessions > 0 ? `${totalSessions} sessions` : "0 sessions"
              }
              sparkData={sparkVisitors}
              color="#fb923c"
              tooltip="Total browsing sessions initiated by visitors"
            />

            <KpiCard
              title="Pages / Session"
              value={avgPagesPerSession}
              subtext="Average depth per visit"
              trend={avgPagesPerSession >= 2 ? "High Engagement" : "Standard"}
              sparkData={sparkViews}
              color="#ec4899"
              tooltip="Average number of pages explored by a user during each visit"
            />
          </div>
        </section>

        {/* ── 2. GEOGRAPHIC & DEVICE ANALYTICS (3-COLUMN SECTION) ─────────────── */}
        <section className={styles.geoGrid}>
          {/* Card 1: Top Visitor Cities */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTitle}>
                <span className={styles.cardIconBlue}>🏙️</span>
                <h3 className={styles.cardTitle}>Top Visitor Cities</h3>
              </div>
              <span className={styles.cardSubtitle}>By Transport Demand</span>
            </div>

            {data?.cities && data.cities.length > 0 ? (
              <div className={styles.scrollList}>
                {data.cities.map((city) => (
                  <div key={city.name} className={styles.listItem}>
                    <div className={styles.listItemHeader}>
                      <span className={styles.listItemName}>{city.name}</span>
                      <div className={styles.listItemMeta}>
                        <span className={styles.listItemCount}>
                          {city.count} visits
                        </span>
                        <span className={styles.cityPct}>
                          {city.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFillCity}
                        style={{ width: `${city.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                No city metrics recorded yet.
              </div>
            )}
          </div>

          {/* Card 2: Top States & Regions */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTitle}>
                <span className={styles.cardIconPurple}>🗺️</span>
                <h3 className={styles.cardTitle}>Top States & Regions</h3>
              </div>
              <span className={styles.cardSubtitle}>Geographic Origin</span>
            </div>

            {data?.states && data.states.length > 0 ? (
              <div className={styles.scrollList}>
                {data.states.map((st) => (
                  <div key={st.name} className={styles.listItem}>
                    <div className={styles.listItemHeader}>
                      <span className={styles.listItemName}>{st.name}</span>
                      <div className={styles.listItemMeta}>
                        <span className={styles.listItemCount}>
                          {st.count} visits
                        </span>
                        <span className={styles.statePct}>
                          {st.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFillState}
                        style={{ width: `${st.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                No state metrics recorded yet.
              </div>
            )}
          </div>

          {/* Card 3: Device & Country Share */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTitle}>
                <span className={styles.cardIconGreen}>📱</span>
                <h3 className={styles.cardTitle}>Device & Country Share</h3>
              </div>
              <span className={styles.cardSubtitle}>Distribution</span>
            </div>

            <div className={styles.deviceCountryGrid}>
              {/* Devices */}
              <div>
                <div className={styles.subSectionTitle}>Device Type</div>
                {data?.devices && data.devices.length > 0 ? (
                  <div className={styles.subSectionList}>
                    {data.devices.map((dev) => (
                      <div key={dev.name} className={styles.subSectionItem}>
                        <div className={styles.subSectionItemHeader}>
                          <span className={styles.subSectionLabel}>
                            {dev.name === "Desktop"
                              ? "💻 Desktop"
                              : "📱 Mobile"}
                          </span>
                          <span className={styles.cityPct}>
                            {dev.percentage}%
                          </span>
                        </div>
                        <div className={styles.progressBarBg}>
                          <div
                            className={
                              dev.name === "Desktop"
                                ? styles.progressBarFillDesktop
                                : styles.progressBarFillMobile
                            }
                            style={{ width: `${dev.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className={styles.directText}>No device data</span>
                )}
              </div>

              {/* Countries */}
              <div>
                <div className={styles.subSectionTitle}>Country</div>
                {data?.countries && data.countries.length > 0 ? (
                  <div className={styles.subSectionList}>
                    {data.countries.slice(0, 4).map((co) => (
                      <div key={co.name} className={styles.subSectionItem}>
                        <div className={styles.subSectionItemHeader}>
                          <span className={styles.subSectionLabel}>
                            🇮🇳 {co.name}
                          </span>
                          <span className={styles.countryPct}>
                            {co.percentage}%
                          </span>
                        </div>
                        <div className={styles.progressBarBg}>
                          <div
                            className={styles.progressBarFillCountry}
                            style={{ width: `${co.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className={styles.directText}>No country data</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. ANALYTICS SECTION (2-COLUMN: CHART + TOP PAGES) ──────────────── */}
        <section className={styles.trendsGrid}>
          {/* Column 1: Daily Views & Conversions Trend */}
          <div className={styles.panelCard}>
            <div className={`${styles.cardHeader} ${styles.chartHeader}`}>
              <div>
                <h3 className={styles.cardTitle}>
                  {range === "today"
                    ? "🕒 Today's Hourly Views & Conversions"
                    : range === "7d"
                      ? "📅 7-Day Views & Conversions Trend"
                      : range === "30d"
                        ? "📅 30-Day Views & Conversions Trend"
                        : "📅 Overall Views & Conversions Trend"}
                </h3>
                <p className={styles.cardSubtitle}>
                  {range === "today"
                    ? "24-hour activity distribution across today"
                    : "Page views (Bars) with overlay of customer inquiries (Line)"}
                </p>
              </div>

              <div className={styles.chartLegend}>
                <span className={styles.legendViews}>
                  <span className={styles.legendViewsDot} /> Views
                </span>
                <span className={styles.legendConversions}>
                  <span className={styles.legendConversionsDot} /> Conversions
                </span>
              </div>
            </div>

            {dailyData && dailyData.length > 0 ? (
              <div
                className={styles.chartContainer}
                style={{
                  gap:
                    dailyData.length > 20 ? 4 : dailyData.length > 10 ? 8 : 12,
                }}
              >
                {dailyData.map((d, index) => {
                  const isLatest = index === dailyData.length - 1;
                  const viewHeight = Math.max(
                    8,
                    Math.round((d.views / maxDailyViews) * 100),
                  );

                  // Determine label display interval
                  let showLabel = true;
                  if (dailyData.length >= 24) {
                    // For 24h or 30d, show label every 4 or 5 intervals
                    const step = dailyData.length === 24 ? 4 : 5;
                    showLabel = index % step === 0 || isLatest;
                  }

                  const barMaxWidth =
                    dailyData.length > 20
                      ? 14
                      : dailyData.length > 10
                        ? 22
                        : 36;
                  const isVisibleValue =
                    dailyData.length <= 10 || (isLatest && d.views > 0);

                  return (
                    <Tooltip
                      key={d.date}
                      content={`${d.date} • ${d.views} Views • ${d.visitors} Visitors • ${d.conversions || 0} Inquiries`}
                    >
                      <div className={styles.chartBarColumn}>
                        {/* Number above bar (only for compact ranges or non-zero latest) */}
                        <div
                          className={`${isLatest ? styles.chartValueLabelLatest : styles.chartValueLabel} ${
                            isVisibleValue ? "" : styles.chartValueHidden
                          }`}
                        >
                          {d.views}
                        </div>

                        {/* Bar + Conversion dot */}
                        <div
                          className={styles.chartBarWrapper}
                          style={{
                            maxWidth: barMaxWidth,
                            height: `${viewHeight}%`,
                          }}
                        >
                          <div
                            className={
                              isLatest ? styles.chartBarLatest : styles.chartBar
                            }
                          />

                          {d.conversions > 0 && (
                            <div
                              className={
                                dailyData.length > 20
                                  ? styles.chartConversionDotSmall
                                  : styles.chartConversionDot
                              }
                            />
                          )}
                        </div>

                        {/* Date / Hour Label */}
                        <div
                          className={`${isLatest ? styles.chartDateLabelLatest : styles.chartDateLabel} ${
                            showLabel ? "" : styles.chartDateHidden
                          }`}
                        >
                          {d.date.length > 5 ? d.date.slice(5) : d.date}
                        </div>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                No traffic data recorded in this period.
              </div>
            )}
          </div>

          {/* Column 2: Top Visited Pages */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Top Visited Pages</h3>
                <p className={styles.cardSubtitle}>
                  Ranked by total page views and visitor engagement
                </p>
              </div>

              <select
                value={pageFilter}
                onChange={(e) => setPageFilter(e.target.value)}
                className={`${styles.selectInput} ${styles.selectInputSmall}`}
              >
                <option value="all">All Pages</option>
                {data?.topPages?.map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.path}
                  </option>
                ))}
              </select>
            </div>

            {data?.topPages && data.topPages.length > 0 ? (
              <div className={styles.scrollListPage}>
                {data.topPages.map((page, idx) => {
                  const total = totalPageViews || 1;
                  const pct = Math.round((page.views / total) * 100);

                  return (
                    <div key={page.path} className={styles.pageRow}>
                      <div className={styles.pageRowHeader}>
                        <div className={styles.pageInfo}>
                          <span
                            className={
                              idx === 0 ? styles.pageRankTop : styles.pageRank
                            }
                          >
                            #{idx + 1}
                          </span>
                          <span className={styles.pageIcon}>📄</span>
                          <Link
                            href={page.path}
                            target="_blank"
                            className={styles.pageLink}
                          >
                            {page.path === "/" ? "/ (Homepage)" : page.path}
                          </Link>
                        </div>

                        <div className={styles.pageStats}>
                          <span className={styles.pageViewsCount}>
                            {page.views} views
                          </span>
                          <span className={styles.pageUniqueCount}>
                            ({page.uniqueVisitors} unique)
                          </span>
                        </div>
                      </div>

                      <div className={styles.progressBarBg}>
                        <div
                          className={styles.progressBarFillCity}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                No page views recorded yet.
              </div>
            )}
          </div>
        </section>

        {/* ── 4. REAL-TIME ACTIVITY & LEAD STREAM (DETAILED BOTTOM TABLE) ──────── */}
        <section className={`${styles.panelCard} ${styles.leadStreamPanel}`}>
          {/* Header Controls */}
          <div className={styles.streamHeader}>
            <div className={styles.streamTitleGroup}>
              <h3 className={`${styles.cardTitle} ${styles.streamTitle}`}>
                Real-Time Activity & Lead Stream
              </h3>
              <span className={styles.streamLiveBadge}>● LIVE STREAM</span>
              <span className={styles.streamCount}>
                ({filteredVisits.length} events)
              </span>
            </div>

            <div className={styles.streamControls}>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">All Events</option>
                <option value="conversions">🎯 Leads & Inquiries Only</option>
                <option value="quote_submit">📝 Quotes Submitted</option>
                <option value="contact_submit">✉️ Contact Messages</option>
                <option value="phone_click">📞 Phone Clicks</option>
                <option value="whatsapp_click">💬 WhatsApp Clicks</option>
                <option value="pageview">👁️ Page Views</option>
              </select>

              <input
                type="text"
                placeholder="Search city, IP, page, OS, referrer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${styles.textInput} ${styles.searchInput}`}
              />

              <a
                href="/api/analytics/stats?export=csv"
                className={styles.actionBtn}
              >
                📥 Export Log
              </a>
            </div>
          </div>

          {/* Table */}
          {filteredVisits.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr className={styles.tableHeaderRow}>
                    <th className={styles.tableHeaderCell}>Time</th>
                    <th className={styles.tableHeaderCell}>Event Type</th>
                    <th className={styles.tableHeaderCell}>Page / Details</th>
                    <th className={styles.tableHeaderCell}>
                      Location (City/State)
                    </th>
                    <th className={styles.tableHeaderCell}>IP Address</th>
                    <th className={styles.tableHeaderCell}>Device</th>
                    <th className={styles.tableHeaderCell}>Browser / OS</th>
                    <th className={styles.tableHeaderCell}>Referrer</th>
                    <th
                      className={`${styles.tableHeaderCell} ${styles.thRight}`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisits.map((visit) => {
                    const badge = getEventBadge(visit.type);
                    const isCopied = copiedId === visit.id;

                    return (
                      <tr key={visit.id} className={styles.tableRow}>
                        <td
                          className={`${styles.tableCell} ${styles.cellNowrap}`}
                        >
                          <div className={styles.timeAgoText}>
                            {timeAgo(visit.timestamp)}
                          </div>
                          <div className={styles.timeExactText}>
                            {new Date(visit.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                        </td>

                        <td
                          className={`${styles.tableCell} ${styles.cellNowrap}`}
                        >
                          <span
                            className={`${styles.eventBadge} ${styles[badge.badgeClass] || ""}`}
                          >
                            <span
                              className={`${styles.eventBadgeDot} ${styles[badge.dotClass] || ""}`}
                            />
                            {badge.icon} {badge.label}
                          </span>
                        </td>

                        <td
                          className={`${styles.tableCell} ${styles.pageCell}`}
                        >
                          <Link
                            href={visit.path || "/"}
                            target="_blank"
                            className={styles.tableLink}
                          >
                            {visit.path || "/"}
                          </Link>
                          {visit.meta && Object.keys(visit.meta).length > 0 && (
                            <div className={styles.metaText}>
                              {visit.meta.reference
                                ? `Ref: ${visit.meta.reference}`
                                : ""}
                              {visit.meta.service
                                ? ` • ${visit.meta.service}`
                                : ""}
                              {visit.meta.name ? ` • ${visit.meta.name}` : ""}
                            </div>
                          )}
                        </td>

                        <td
                          className={`${styles.tableCell} ${styles.cellNowrap}`}
                        >
                          <div className={styles.locationPrimary}>
                            📍 {visit.city ? `${visit.city}, ` : ""}
                            {visit.state || "Maharashtra"}
                          </div>
                          <div className={styles.locationCountry}>
                            {visit.country || "India"}
                          </div>
                        </td>

                        <td className={`${styles.tableCell} ${styles.ipCell}`}>
                          {visit.ip || "127.0.0.1"}
                        </td>

                        <td
                          className={`${styles.tableCell} ${styles.cellNowrap}`}
                        >
                          <span className={styles.deviceBadge}>
                            {visit.device === "Mobile"
                              ? "📱 Mobile"
                              : visit.device === "Tablet"
                                ? "📟 Tablet"
                                : "💻 Desktop"}
                          </span>
                        </td>

                        <td
                          className={`${styles.tableCell} ${styles.browserCell}`}
                        >
                          <span className={styles.browserName}>
                            {visit.browser}
                          </span>{" "}
                          / {visit.os}
                        </td>

                        <td
                          className={`${styles.tableCell} ${styles.referrerCell}`}
                        >
                          {visit.referrer ? (
                            <span
                              title={visit.referrer}
                              className={styles.referrerText}
                            >
                              {visit.referrer}
                            </span>
                          ) : (
                            <span className={styles.directText}>Direct</span>
                          )}
                        </td>

                        <td
                          className={`${styles.tableCell} ${styles.actionCell}`}
                        >
                          <button
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(visit, null, 2),
                                visit.id,
                              )
                            }
                            className={`${styles.actionBtn} ${isCopied ? styles.copyJsonBtnCopied : styles.copyJsonBtn}`}
                          >
                            {isCopied ? "✓ Copied" : "Copy JSON"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.tableEmptyState}>
              {searchTerm || eventTypeFilter !== "all" || pageFilter !== "all"
                ? "No visits matching your filter criteria."
                : "No events recorded yet. Open your website pages to begin tracking!"}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
