"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "@/styles/analytics.module.css";

// ── Utility Functions ──────────────────────────────────────────────────────────

function timeAgo(dateString) {
  if (!dateString) return "just now";
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
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
      return { label: "Quote Submitted", icon: "📝", bg: "rgba(168, 85, 247, 0.14)", border: "rgba(168, 85, 247, 0.45)", text: "#c084fc", dot: "#a855f7" };
    case "contact_submit":
      return { label: "Contact Message", icon: "✉️", bg: "rgba(59, 130, 246, 0.14)", border: "rgba(59, 130, 246, 0.45)", text: "#60a5fa", dot: "#3b82f6" };
    case "phone_click":
      return { label: "Phone Call Click", icon: "📞", bg: "rgba(245, 158, 11, 0.14)", border: "rgba(245, 158, 11, 0.45)", text: "#fbbf24", dot: "#f59e0b" };
    case "whatsapp_click":
      return { label: "WhatsApp Click", icon: "💬", bg: "rgba(34, 197, 94, 0.14)", border: "rgba(34, 197, 94, 0.45)", text: "#4ade80", dot: "#22c55e" };
    case "quote_intent":
      return { label: "Quote CTA Click", icon: "🎯", bg: "rgba(236, 72, 153, 0.14)", border: "rgba(236, 72, 153, 0.45)", text: "#f472b6", dot: "#ec4899" };
    case "chat_open":
      return { label: "AI Chat Opened", icon: "🤖", bg: "rgba(14, 165, 233, 0.14)", border: "rgba(14, 165, 233, 0.45)", text: "#38bdf8", dot: "#0ea5e9" };
    case "heartbeat":
      return { label: "Active Heartbeat", icon: "💓", bg: "rgba(100, 116, 139, 0.14)", border: "rgba(100, 116, 139, 0.35)", text: "#94a3b8", dot: "#64748b" };
    default:
      return { label: "Page View", icon: "👁️", bg: "rgba(56, 189, 248, 0.10)", border: "rgba(56, 189, 248, 0.35)", text: "#0284c7", dot: "#0ea5e9" };
  }
}

// Generates smooth SVG mini sparkline path
function generateSparkline(data = [], color = "#38bdf8") {
  if (!data || data.length < 2) {
    return (
      <svg width="68" height="24" viewBox="0 0 68 24" fill="none">
        <path d="M0 12 L68 12" stroke={color} strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
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
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`} />
      <path d={pathD} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function KpiCard({ title, value, subtext, trend, sparkData, color, tooltip, isLive }) {
  return (
    <div
      className={styles.kpiCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}66`;
        e.currentTarget.style.boxShadow = `0 8px 24px -2px ${color}20, var(--shadow)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border, rgba(255, 255, 255, 0.07))";
        e.currentTarget.style.boxShadow = "var(--shadow, 0 4px 20px -2px rgba(0, 0, 0, 0.35))";
      }}
    >
      {/* Top row: Title and Tooltip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className={styles.kpiTitle}>{title}</span>
          {tooltip && (
            <Tooltip content={tooltip}>
              <span className={styles.tooltipTrigger}>?</span>
            </Tooltip>
          )}
        </div>

        {isLive ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(34, 197, 94, 0.16)", color: "#16a34a", padding: "2px 7px", borderRadius: "10px", fontSize: "10px", fontWeight: 800, border: "1px solid rgba(34, 197, 94, 0.35)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className={styles.kpiSubtext}>{subtext}</span>
        {trend && (
          <span style={{ color: trend.startsWith("+") ? "#16a34a" : trend.startsWith("-") ? "#ef4444" : "var(--muted)", fontWeight: 600, fontSize: "11px" }}>
            {trend}
          </span>
        )}
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

  const fetchData = useCallback(async (selectedRange = range, showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?range=${selectedRange}`, { cache: "no-store" });
      const json = await res.json();
      if (json.ok) {
        setData(json.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [range]);

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
    if (!window.confirm("Are you sure you want to reset all analytics tracking records? This cannot be undone.")) {
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
          if (!["quote_submit", "contact_submit", "phone_click", "whatsapp_click", "quote_intent"].includes(v.type)) return false;
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
      <div className={styles.dashboardWrapper} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent)", animation: "ping 1s infinite" }} />
          Verifying security access...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.dashboardWrapper} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className={styles.panelCard} style={{ maxWidth: 420, width: "100%", padding: "36px 32px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "14px", background: "linear-gradient(135deg, var(--accent), var(--accent-dk))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 24, boxShadow: "0 0 24px rgba(14, 165, 233, 0.35)", color: "#fff" }}>
            🔐
          </div>
          <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "var(--ink)" }}>
            MahaveerTrans Analytics
          </h2>
          <div className={styles.proBadge} style={{ display: "inline-block", marginBottom: 18 }}>
            ENTERPRISE PRO
          </div>
          <p style={{ margin: "0 0 22px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
            Enter your Admin PIN to unlock the live visitor tracking dashboard and fleet telemetry metrics.
          </p>

          <form onSubmit={handlePinSubmit}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="password"
                placeholder="Enter PIN (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                maxLength={12}
                className={styles.textInput}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 18,
                  textAlign: "center",
                  letterSpacing: "4px",
                }}
              />
              {pinError && (
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 8, fontWeight: 600 }}>
                  ⚠️ {pinError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.rangeBtnActive}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Unlock Analytics Dashboard →
            </button>
          </form>

          <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
            <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
              ← Return to Website
            </Link>
            <span style={{ color: "var(--muted)" }}>Default PIN: 1234</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated View ────────────────────────────────────────────────────────

  const conv = data?.conversions || { quotes: 0, contacts: 0, phoneClicks: 0, whatsappClicks: 0, totalConversions: 0, conversionRate: 0 };
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
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/" className={styles.backBtn}>
              <span>← Main Site</span>
            </Link>

            <span style={{ color: "var(--border)" }}>|</span>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} />
                <h1 className={styles.brandTitle}>
                  MahaveerTrans Analytics
                </h1>
                <span className={styles.proBadge}>PRO</span>
                {data?.isCloudStorage ? (
                  <span className={styles.cloudBadge}>☁️ Cloud Synced</span>
                ) : (
                  <span className={styles.serverlessBadge} title="Add Upstash Redis in .env to persist across Vercel deployments">
                    ⚡ Serverless Mode
                  </span>
                )}
              </div>

              <div className={styles.statusSubtext}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: autoRefresh ? "#22c55e" : "#94a3b8", display: "inline-block" }} />
                  <span style={{ color: autoRefresh ? "#16a34a" : "var(--muted)", fontWeight: 600 }}>{autoRefresh ? "Live Tracking Active" : "Auto-Refresh Paused"}</span>
                </span>
                <span>•</span>
                <span>Updated: {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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
              className={styles.actionBtn}
              style={{ color: autoRefresh ? "#16a34a" : "var(--muted)" }}
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
        <section style={{ marginBottom: 28 }}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                Executive Performance Overview
              </h2>
              <p className={styles.sectionSubtitle}>
                Key conversion metrics and high-intent customer actions ({range === "today" ? "Today" : range === "7d" ? "Past 7 Days" : range === "30d" ? "Past 30 Days" : "All Time"})
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(14, 165, 233, 0.1)", padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(14, 165, 233, 0.25)" }}>
              <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>Conversion Rate:</span>
              <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 800 }}>{conv.conversionRate}%</span>
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
              trend={conv.contacts > 0 ? `+${conv.contacts} new` : "0 in period"}
              sparkData={sparkConversions}
              color="#3b82f6"
              tooltip="Total submissions through the contact form"
            />

            <KpiCard
              title="Phone Call Clicks"
              value={conv.phoneClicks}
              subtext="Direct call actions"
              trend={conv.phoneClicks > 0 ? `+${conv.phoneClicks} calls` : "0 in period"}
              sparkData={sparkConversions}
              color="#f59e0b"
              tooltip="Total times visitors clicked the telephone number to call"
            />

            <KpiCard
              title="WhatsApp Clicks"
              value={conv.whatsappClicks}
              subtext="Instant chat initiates"
              trend={conv.whatsappClicks > 0 ? `+${conv.whatsappClicks} chats` : "0 in period"}
              sparkData={sparkConversions}
              color="#10b981"
              tooltip="Total clicks on WhatsApp chat buttons and floating contact links"
            />

            <KpiCard
              title="Total Inquiries"
              value={conv.totalConversions}
              subtext="All combined leads"
              trend={conv.totalConversions > 0 ? `${conv.conversionRate}% CR` : "0% CR"}
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
              trend={totalSessions > 0 ? `${totalSessions} sessions` : "0 sessions"}
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
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 28 }}>
          {/* Card 1: Top Visitor Cities */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: "6px", background: "rgba(14, 165, 233, 0.15)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                  🏙️
                </span>
                <h3 className={styles.cardTitle}>Top Visitor Cities</h3>
              </div>
              <span className={styles.cardSubtitle}>By Transport Demand</span>
            </div>

            {data?.cities && data.cities.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 11, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                {data.cities.map((city) => (
                  <div key={city.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "var(--ink2)", fontWeight: 600 }}>{city.name}</span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: "var(--muted)", fontSize: 11 }}>{city.count} visits</span>
                        <span style={{ color: "var(--accent)", fontWeight: 700 }}>{city.percentage}%</span>
                      </div>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div style={{ width: `${city.percentage}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-dk), var(--accent))", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "32px 0", color: "var(--muted)", textAlign: "center", fontSize: 12 }}>No city metrics recorded yet.</div>
            )}
          </div>

          {/* Card 2: Top States & Regions */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: "6px", background: "rgba(168, 85, 247, 0.15)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                  🗺️
                </span>
                <h3 className={styles.cardTitle}>Top States & Regions</h3>
              </div>
              <span className={styles.cardSubtitle}>Geographic Origin</span>
            </div>

            {data?.states && data.states.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 11, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                {data.states.map((st) => (
                  <div key={st.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "var(--ink2)", fontWeight: 600 }}>{st.name}</span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: "var(--muted)", fontSize: 11 }}>{st.count} visits</span>
                        <span style={{ color: "#a855f7", fontWeight: 700 }}>{st.percentage}%</span>
                      </div>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div style={{ width: `${st.percentage}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #a855f7)", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "32px 0", color: "var(--muted)", textAlign: "center", fontSize: 12 }}>No state metrics recorded yet.</div>
            )}
          </div>

          {/* Card 3: Device & Country Share */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: "6px", background: "rgba(16, 185, 129, 0.15)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                  📱
                </span>
                <h3 className={styles.cardTitle}>Device & Country Share</h3>
              </div>
              <span className={styles.cardSubtitle}>Distribution</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {/* Devices */}
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10, letterSpacing: "0.04em" }}>
                  Device Type
                </div>
                {data?.devices && data.devices.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {data.devices.map((dev) => (
                      <div key={dev.name} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "var(--ink2)" }}>{dev.name === "Desktop" ? "💻 Desktop" : "📱 Mobile"}</span>
                          <span style={{ color: "var(--accent)", fontWeight: 700 }}>{dev.percentage}%</span>
                        </div>
                        <div className={styles.progressBarBg}>
                          <div style={{ width: `${dev.percentage}%`, height: "100%", background: dev.name === "Desktop" ? "var(--accent)" : "#10b981", borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>No device data</span>
                )}
              </div>

              {/* Countries */}
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10, letterSpacing: "0.04em" }}>
                  Country
                </div>
                {data?.countries && data.countries.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {data.countries.slice(0, 4).map((co) => (
                      <div key={co.name} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "var(--ink2)" }}>🇮🇳 {co.name}</span>
                          <span style={{ color: "#8b5cf6", fontWeight: 700 }}>{co.percentage}%</span>
                        </div>
                        <div className={styles.progressBarBg}>
                          <div style={{ width: `${co.percentage}%`, height: "100%", background: "#8b5cf6", borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>No country data</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. ANALYTICS SECTION (2-COLUMN: CHART + TOP PAGES) ──────────────── */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 16, marginBottom: 28 }}>
          {/* Column 1: Daily Views & Conversions Trend */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader} style={{ marginBottom: 18 }}>
              <div>
                <h3 className={styles.cardTitle}>Daily Views & Conversions Trend</h3>
                <p className={styles.cardSubtitle}>Page views (Bars) with overlay of customer inquiries (Line)</p>
              </div>

              <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--accent)", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: "2px" }} /> Page Views
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#16a34a", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, background: "#16a34a", borderRadius: "50%" }} /> Conversions
                </span>
              </div>
            </div>

            {dailyData && dailyData.length > 0 ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 180, paddingTop: 24, paddingBottom: 6 }}>
                {dailyData.map((d, index) => {
                  const isLatest = index === dailyData.length - 1;
                  const viewHeight = Math.max(8, Math.round((d.views / maxDailyViews) * 100));

                  return (
                    <Tooltip
                      key={d.date}
                      content={`${d.date}: ${d.views} Page Views • ${d.visitors} Visitors • ${d.conversions || 0} Inquiries`}
                    >
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", cursor: "pointer" }}>
                        <div style={{ fontSize: 10, color: isLatest ? "var(--accent)" : "var(--muted)", fontWeight: isLatest ? 700 : 500, marginBottom: 4 }}>
                          {d.views}
                        </div>

                        <div style={{ width: "100%", maxWidth: 32, position: "relative", height: `${viewHeight}%` }}>
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: isLatest
                                ? "linear-gradient(to top, var(--accent-dk), var(--accent))"
                                : "linear-gradient(to top, rgba(2, 132, 199, 0.4), rgba(56, 189, 248, 0.6))",
                              borderRadius: "4px 4px 0 0",
                              transition: "all 0.2s ease",
                            }}
                          />

                          {d.conversions > 0 && (
                            <div
                              style={{
                                position: "absolute",
                                top: -8,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: "#10b981",
                                border: "2px solid var(--card)",
                                boxShadow: "0 0 8px #10b981",
                              }}
                            />
                          )}
                        </div>

                        <div style={{ fontSize: 10, color: isLatest ? "var(--accent)" : "var(--muted)", marginTop: 6, fontWeight: isLatest ? 700 : 400 }}>
                          {d.date.slice(5)}
                        </div>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 12 }}>
                No traffic data recorded in this period.
              </div>
            )}
          </div>

          {/* Column 2: Top Visited Pages */}
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Top Visited Pages</h3>
                <p className={styles.cardSubtitle}>Ranked by total page views and visitor engagement</p>
              </div>

              <select
                value={pageFilter}
                onChange={(e) => setPageFilter(e.target.value)}
                className={styles.selectInput}
                style={{ padding: "4px 8px", fontSize: "11px" }}
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
              <div style={{ display: "flex", flexDirection: "column", gap: 11, maxHeight: 200, overflowY: "auto", paddingRight: 4 }}>
                {data.topPages.map((page, idx) => {
                  const total = totalPageViews || 1;
                  const pct = Math.round((page.views / total) * 100);

                  return (
                    <div key={page.path} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                          <span style={{ fontSize: 11, color: idx === 0 ? "var(--accent)" : "var(--muted)", fontWeight: 700, width: 20 }}>
                            #{idx + 1}
                          </span>
                          <span style={{ fontSize: 12 }}>📄</span>
                          <Link
                            href={page.path}
                            target="_blank"
                            style={{
                              color: "var(--accent)",
                              textDecoration: "none",
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "220px",
                            }}
                          >
                            {page.path === "/" ? "/ (Homepage)" : page.path}
                          </Link>
                        </div>

                        <div style={{ display: "flex", gap: 10, alignItems: "center", whiteSpace: "nowrap" }}>
                          <span style={{ fontWeight: 700, color: "var(--ink)" }}>{page.views} views</span>
                          <span style={{ color: "var(--muted)", fontSize: 11 }}>({page.uniqueVisitors} unique)</span>
                        </div>
                      </div>

                      <div className={styles.progressBarBg}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-dk), var(--accent))", borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "32px 0", color: "var(--muted)", textAlign: "center", fontSize: 12 }}>No page views recorded yet.</div>
            )}
          </div>
        </section>

        {/* ── 4. REAL-TIME ACTIVITY & LEAD STREAM (DETAILED BOTTOM TABLE) ──────── */}
        <section className={styles.panelCard} style={{ padding: "22px" }}>
          {/* Header Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 className={styles.cardTitle} style={{ fontSize: 16 }}>
                Real-Time Activity & Lead Stream
              </h3>
              <span style={{ background: "rgba(34, 197, 94, 0.16)", color: "#16a34a", border: "1px solid rgba(34, 197, 94, 0.35)", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: 800 }}>
                ● LIVE STREAM
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>({filteredVisits.length} events)</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
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
                className={styles.textInput}
                style={{ width: 240 }}
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
                    <th className={styles.tableHeaderCell}>Location (City/State)</th>
                    <th className={styles.tableHeaderCell}>IP Address</th>
                    <th className={styles.tableHeaderCell}>Device</th>
                    <th className={styles.tableHeaderCell}>Browser / OS</th>
                    <th className={styles.tableHeaderCell}>Referrer</th>
                    <th className={styles.tableHeaderCell} style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisits.map((visit) => {
                    const badge = getEventBadge(visit.type);
                    const isCopied = copiedId === visit.id;

                    return (
                      <tr key={visit.id} className={styles.tableRow}>
                        <td className={styles.tableCell} style={{ whiteSpace: "nowrap" }}>
                          <div style={{ color: "var(--accent)", fontWeight: 700 }}>{timeAgo(visit.timestamp)}</div>
                          <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: 2 }}>
                            {new Date(visit.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </div>
                        </td>

                        <td className={styles.tableCell} style={{ whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              background: badge.bg,
                              border: `1px solid ${badge.border}`,
                              color: badge.text,
                              padding: "4px 9px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot }} />
                            {badge.icon} {badge.label}
                          </span>
                        </td>

                        <td className={styles.tableCell} style={{ color: "var(--ink)", fontWeight: 600 }}>
                          <Link href={visit.path || "/"} target="_blank" style={{ color: "var(--accent)", textDecoration: "none" }}>
                            {visit.path || "/"}
                          </Link>
                          {visit.meta && Object.keys(visit.meta).length > 0 && (
                            <div style={{ fontSize: 11, color: "#16a34a", marginTop: 3, fontWeight: 500 }}>
                              {visit.meta.reference ? `Ref: ${visit.meta.reference}` : ""}
                              {visit.meta.service ? ` • ${visit.meta.service}` : ""}
                              {visit.meta.name ? ` • ${visit.meta.name}` : ""}
                            </div>
                          )}
                        </td>

                        <td className={styles.tableCell} style={{ whiteSpace: "nowrap" }}>
                          <div style={{ color: "var(--ink2)", fontWeight: 600 }}>
                            📍 {visit.city ? `${visit.city}, ` : ""}{visit.state || "Maharashtra"}
                          </div>
                          <div style={{ fontSize: "10px", color: "var(--muted)" }}>{visit.country || "India"}</div>
                        </td>

                        <td className={styles.tableCell} style={{ whiteSpace: "nowrap", fontFamily: "monospace", fontSize: "11px", color: "var(--muted)" }}>
                          {visit.ip || "127.0.0.1"}
                        </td>

                        <td className={styles.tableCell} style={{ whiteSpace: "nowrap" }}>
                          <span style={{ background: "var(--bg2)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", color: "var(--ink2)" }}>
                            {visit.device === "Mobile" ? "📱 Mobile" : visit.device === "Tablet" ? "📟 Tablet" : "💻 Desktop"}
                          </span>
                        </td>

                        <td className={styles.tableCell} style={{ whiteSpace: "nowrap", color: "var(--muted)" }}>
                          <span style={{ color: "var(--ink2)", fontWeight: 500 }}>{visit.browser}</span> / {visit.os}
                        </td>

                        <td className={styles.tableCell} style={{ color: "var(--muted)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {visit.referrer ? (
                            <span title={visit.referrer} style={{ color: "var(--ink2)" }}>
                              {visit.referrer}
                            </span>
                          ) : (
                            <span style={{ color: "var(--muted)" }}>Direct</span>
                          )}
                        </td>

                        <td className={styles.tableCell} style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(visit, null, 2), visit.id)}
                            className={styles.actionBtn}
                            style={{ padding: "3px 8px", fontSize: "10px", color: isCopied ? "#16a34a" : "var(--muted)" }}
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
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
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
