"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";

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
      return { label: "📝 Quote Submitted", bg: "rgba(16, 185, 129, 0.2)", border: "#10b981", text: "#34d399" };
    case "contact_submit":
      return { label: "✉️ Contact Submitted", bg: "rgba(59, 130, 246, 0.2)", border: "#3b82f6", text: "#60a5fa" };
    case "phone_click":
      return { label: "📞 Phone Call Click", bg: "rgba(245, 158, 11, 0.2)", border: "#f59e0b", text: "#fbbf24" };
    case "whatsapp_click":
      return { label: "💬 WhatsApp Click", bg: "rgba(34, 197, 94, 0.2)", border: "#22c55e", text: "#4ade80" };
    case "quote_intent":
      return { label: "🎯 Quote CTA Click", bg: "rgba(168, 85, 247, 0.2)", border: "#a855f7", text: "#c084fc" };
    case "chat_open":
      return { label: "🤖 AI Chat Opened", bg: "rgba(14, 165, 233, 0.2)", border: "#0ea5e9", text: "#38bdf8" };
    case "heartbeat":
      return { label: "💓 Active Heartbeat", bg: "rgba(100, 116, 139, 0.2)", border: "#475569", text: "#94a3b8" };
    default:
      return { label: "👁️ Page View", bg: "rgba(30, 41, 59, 0.4)", border: "#334155", text: "#94a3b8" };
  }
}

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
  const [isClearing, setIsClearing] = useState(false);

  // Check saved authentication
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

  const filteredVisits = useMemo(() => {
    if (!data?.recentVisits) return [];
    return data.recentVisits.filter((v) => {
      // Event type filter
      if (eventTypeFilter !== "all") {
        if (eventTypeFilter === "conversions") {
          if (!["quote_submit", "contact_submit", "phone_click", "whatsapp_click"].includes(v.type)) return false;
        } else if (v.type !== eventTypeFilter) {
          return false;
        }
      }

      // Search term filter
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
  }, [data?.recentVisits, eventTypeFilter, searchTerm]);

  const maxDailyViews = useMemo(() => {
    if (!data?.dailyActivity?.length) return 1;
    return Math.max(...data.dailyActivity.map((d) => d.views), 1);
  }, [data?.dailyActivity]);

  // Loading Screen while checking auth
  if (isCheckingAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b1120", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Loading Security Verification...</div>
      </div>
    );
  }

  // 🔒 PIN Protection Screen
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top, #0f172a, #0b1120)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "var(--font-b, sans-serif)" }}>
        <div style={{ background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(16px)", border: "1px solid #334155", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 420, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #0ea5e9, #0284c7)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: "0 0 24px rgba(14, 165, 233, 0.4)" }}>
            🔒
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Admin Analytics Portal
          </h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#94a3b8" }}>
            Please enter your Admin PIN to unlock the live visitor tracking dashboard.
          </p>

          <form onSubmit={handlePinSubmit}>
            <div style={{ marginBottom: 18 }}>
              <input
                type="password"
                placeholder="Enter PIN (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                maxLength={12}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "#0b1120",
                  border: pinError ? "1px solid #ef4444" : "1px solid #334155",
                  color: "#ffffff",
                  fontSize: 18,
                  textAlign: "center",
                  letterSpacing: "4px",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
              />
              {pinError && (
                <div style={{ color: "#f87171", fontSize: 12, marginTop: 8, fontWeight: 600 }}>
                  ⚠️ {pinError}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                border: "none",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(14, 165, 233, 0.4)",
                transition: "transform 0.15s ease",
              }}
            >
              Unlock Dashboard →
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
            <Link href="/" style={{ color: "#38bdf8", textDecoration: "none" }}>
              ← Return to Website
            </Link>
            <span style={{ color: "#64748b" }}>Default PIN: 1234</span>
          </div>
        </div>
      </div>
    );
  }

  // 📊 Authenticated Analytics Dashboard View
  const conv = data?.conversions || { quotes: 0, contacts: 0, phoneClicks: 0, whatsappClicks: 0, totalConversions: 0, conversionRate: 0 };

  return (
    <div style={{ paddingTop: "4rem", minHeight: "100vh", background: "#0b1120", color: "#f1f5f9", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Top Header Bar */}
      <header style={{ borderBottom: "1px solid #1e293b", background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(14px)", position: "sticky", top: 0, zIndex: 40, padding: "16px 24px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: "#38bdf8", fontWeight: 700, fontSize: 14, background: "#1e293b", padding: "6px 12px", borderRadius: 8, border: "1px solid #334155" }}>
              <span>← Back to Site</span>
            </Link>
            <span style={{ color: "#334155" }}>|</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                  MahaveerTrans Analytics
                </h1>
                <span style={{ background: "rgba(14, 165, 233, 0.2)", color: "#38bdf8", border: "1px solid #0ea5e9", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                  PRO
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: autoRefresh ? "#22c55e" : "#64748b", display: "inline-block", boxShadow: autoRefresh ? "0 0 10px #22c55e" : "none" }} />
                <span>{autoRefresh ? "Live tracking active (10s auto-refresh)" : "Auto-refresh paused"}</span>
                <span>•</span>
                <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Action & Filter Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: "#1e293b", borderRadius: 8, padding: 3, border: "1px solid #334155" }}>
              {["today", "7d", "30d", "all"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    border: "none",
                    background: range === r ? "#0ea5e9" : "transparent",
                    color: range === r ? "#ffffff" : "#94a3b8",
                    padding: "6px 13px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {r === "today" ? "Today" : r === "7d" ? "Last 7 Days" : r === "30d" ? "Last 30 Days" : "All Time"}
                </button>
              ))}
            </div>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                background: autoRefresh ? "#064e3b" : "#1e293b",
                border: `1px solid ${autoRefresh ? "#059669" : "#334155"}`,
                color: autoRefresh ? "#34d399" : "#94a3b8",
                padding: "7px 11px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔄 {autoRefresh ? "Live ON" : "Live OFF"}
            </button>

            <button
              onClick={() => fetchData(range, true)}
              disabled={loading}
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#e2e8f0",
                padding: "7px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading ? "..." : "Refresh"}
            </button>

            <a
              href="/api/analytics/stats?export=csv"
              style={{
                background: "#0369a1",
                color: "#ffffff",
                padding: "7px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              📥 CSV
            </a>

            <button
              onClick={handleClearData}
              disabled={isClearing}
              style={{
                background: "#7f1d1d",
                border: "1px solid #991b1b",
                color: "#fca5a5",
                padding: "7px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset
            </button>

            <button
              onClick={handleLogout}
              title="Lock Dashboard"
              style={{
                background: "#334155",
                border: "1px solid #475569",
                color: "#ffffff",
                padding: "7px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔒 Lock
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 60px" }}>
        {/* 🎯 SECTION 1: Conversions & Business Leads Banner */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#ffffff", display: "flex", alignItems: "center", gap: 8 }}>
              <span>🎯 Conversions & Customer Leads</span>
              <span style={{ fontSize: 12, color: "#38bdf8", background: "rgba(14, 165, 233, 0.15)", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                CR: {conv.conversionRate}%
              </span>
            </h2>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>High-intent actions taken by visitors</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {/* Quotes Submitted */}
            <div style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.8))", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399", textTransform: "uppercase" }}>📝 Quotes Submitted</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>{conv.quotes}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Full quotation requests</div>
            </div>

            {/* Contact Inquiries */}
            <div style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.8))", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase" }}>✉️ Contact Messages</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>{conv.contacts}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Direct contact queries</div>
            </div>

            {/* Phone Calls */}
            <div style={{ background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.8))", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase" }}>📞 Phone Call Clicks</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>{conv.phoneClicks}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Clicked to call number</div>
            </div>

            {/* WhatsApp Inquiries */}
            <div style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(15, 23, 42, 0.8))", border: "1px solid rgba(34, 197, 94, 0.4)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", textTransform: "uppercase" }}>💬 WhatsApp Clicks</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>{conv.whatsappClicks}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Direct WhatsApp chats</div>
            </div>

            {/* Total Leads */}
            <div style={{ background: "linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(15, 23, 42, 0.9))", border: "1px solid #0ea5e9", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>⚡ Total Inquiries</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>{conv.totalConversions}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Combined customer leads</div>
            </div>
          </div>
        </div>

        {/* 📊 SECTION 2: General Traffic KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          {/* Active Now */}
          <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid #059669", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", textTransform: "uppercase" }}>Active Right Now</span>
              <span style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                ● LIVE
              </span>
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>
              {data ? data.realtimeActiveVisitors : "—"}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Active on site in last 5 min</div>
          </div>

          {/* Total Views */}
          <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid #334155", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>Total Page Views</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>
              {data ? data.totalPageViews.toLocaleString() : "—"}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Total pages viewed</div>
          </div>

          {/* Unique Visitors */}
          <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid #334155", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase" }}>Unique Visitors</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>
              {data ? data.uniqueVisitors.toLocaleString() : "—"}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Distinct users / devices</div>
          </div>

          {/* Total Sessions */}
          <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid #334155", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase" }}>Browsing Sessions</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>
              {data ? data.totalSessions.toLocaleString() : "—"}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Total visits initiated</div>
          </div>

          {/* Pages per Session */}
          <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid #334155", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ec4899", textTransform: "uppercase" }}>Pages / Session</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#ffffff", marginTop: 8 }}>
              {data ? data.avgPagesPerSession : "—"}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Average depth per visit</div>
          </div>
        </div>

        {/* 🗺️ SECTION 3: Geographic & Location Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 28 }}>
          {/* Top Cities */}
          <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid #334155", borderRadius: 14, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#ffffff" }}>📍 Top Visitor Cities</h3>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>By transport demand</span>
            </div>
            {data?.cities && data.cities.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 200, overflowY: "auto", paddingRight: 4 }}>
                {data.cities.map((city) => (
                  <div key={city.name} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#e2e8f0", fontWeight: 600 }}>🏙️ {city.name}</span>
                      <span style={{ color: "#38bdf8", fontWeight: 700 }}>{city.percentage}% ({city.count})</span>
                    </div>
                    <div style={{ width: "100%", height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${city.percentage}%`, height: "100%", background: "linear-gradient(90deg, #0ea5e9, #38bdf8)", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "24px 0", color: "#64748b", textAlign: "center" }}>No city data yet.</div>
            )}
          </div>

          {/* Top States */}
          <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid #334155", borderRadius: 14, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#ffffff" }}>🗺️ Top States & Regions</h3>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Geographic hub</span>
            </div>
            {data?.states && data.states.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 200, overflowY: "auto", paddingRight: 4 }}>
                {data.states.map((st) => (
                  <div key={st.name} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#e2e8f0", fontWeight: 600 }}>📍 {st.name}</span>
                      <span style={{ color: "#a78bfa", fontWeight: 700 }}>{st.percentage}% ({st.count})</span>
                    </div>
                    <div style={{ width: "100%", height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${st.percentage}%`, height: "100%", background: "linear-gradient(90deg, #8b5cf6, #c084fc)", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "24px 0", color: "#64748b", textAlign: "center" }}>No state data yet.</div>
            )}
          </div>

          {/* Countries & Devices */}
          <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid #334155", borderRadius: 14, padding: 22 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#ffffff" }}>📱 Device & Country Share</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Device</div>
                {data?.devices?.map((dev) => (
                  <div key={dev.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", color: "#e2e8f0" }}>
                    <span>{dev.name === "Desktop" ? "💻 Desktop" : "📱 Mobile"}</span>
                    <span style={{ color: "#38bdf8", fontWeight: 600 }}>{dev.percentage}%</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Country</div>
                {data?.countries?.slice(0, 4).map((co) => (
                  <div key={co.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", color: "#e2e8f0" }}>
                    <span>🇮🇳 {co.name}</span>
                    <span style={{ color: "#a78bfa", fontWeight: 600 }}>{co.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 📅 SECTION 4: Daily Traffic Chart & Top Pages */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 18, marginBottom: 28 }}>
          {/* Daily Trend Chart */}
          <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid #334155", borderRadius: 14, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#ffffff" }}>📅 Daily Views & Conversions Trend</h3>
              <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#38bdf8" }}>
                  <span style={{ width: 10, height: 10, background: "#0ea5e9", borderRadius: 2 }} /> Views
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#34d399" }}>
                  <span style={{ width: 10, height: 10, background: "#10b981", borderRadius: 2 }} /> Conversions
                </span>
              </div>
            </div>

            {data?.dailyActivity && data.dailyActivity.length > 0 ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160, paddingTop: 20 }}>
                {data.dailyActivity.map((d) => {
                  const heightPercent = Math.max(10, Math.round((d.views / maxDailyViews) * 100));
                  return (
                    <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>{d.views}</div>
                      <div
                        title={`${d.date}: ${d.views} views, ${d.visitors} visitors, ${d.conversions} leads`}
                        style={{
                          width: "100%",
                          maxWidth: 28,
                          height: `${heightPercent}%`,
                          background: d.conversions > 0 ? "linear-gradient(to top, #059669, #34d399)" : "linear-gradient(to top, #0284c7, #38bdf8)",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.3s ease",
                          cursor: "pointer",
                        }}
                      />
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 6, whiteSpace: "nowrap" }}>
                        {d.date.slice(5)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                No traffic data recorded yet.
              </div>
            )}
          </div>

          {/* Top Pages */}
          <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid #334155", borderRadius: 14, padding: 22 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#ffffff" }}>📄 Top Visited Pages</h3>
            {data?.topPages && data.topPages.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 180, overflowY: "auto", paddingRight: 4 }}>
                {data.topPages.map((page, idx) => {
                  const total = data.totalPageViews || 1;
                  const pct = Math.round((page.views / total) * 100);
                  return (
                    <div key={page.path} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                          <span style={{ fontSize: 11, color: "#64748b", width: 18 }}>#{idx + 1}</span>
                          <Link href={page.path} target="_blank" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {page.path === "/" ? "/ (Homepage)" : page.path}
                          </Link>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", whiteSpace: "nowrap" }}>
                          <span style={{ fontWeight: 700, color: "#ffffff" }}>{page.views} views</span>
                          <span style={{ color: "#94a3b8", fontSize: 11 }}>({page.uniqueVisitors} users)</span>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #0ea5e9, #38bdf8)", borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                No page views recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* ⚡ SECTION 5: Real-Time Live Activity & Conversion Stream */}
        <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid #334155", borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
                ⚡ Real-Time Activity & Lead Stream
              </h3>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Showing latest {filteredVisits.length} recorded events
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {/* Event Type Filter */}
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  padding: "6px 12px",
                  color: "#ffffff",
                  fontSize: 13,
                  outline: "none",
                }}
              >
                <option value="all">All Events</option>
                <option value="conversions">🎯 Leads & Conversions Only</option>
                <option value="quote_submit">📝 Quote Submissions</option>
                <option value="contact_submit">✉️ Contact Messages</option>
                <option value="phone_click">📞 Phone Clicks</option>
                <option value="whatsapp_click">💬 WhatsApp Clicks</option>
                <option value="pageview">👁️ Page Views</option>
              </select>

              {/* Search input */}
              <input
                type="text"
                placeholder="Search city, IP, page, device..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  padding: "6px 12px",
                  color: "#ffffff",
                  fontSize: 13,
                  outline: "none",
                  width: 220,
                }}
              />
            </div>
          </div>

          {filteredVisits.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "10px 12px" }}>Time</th>
                    <th style={{ padding: "10px 12px" }}>Event Type</th>
                    <th style={{ padding: "10px 12px" }}>Page / Details</th>
                    <th style={{ padding: "10px 12px" }}>Location (City/State)</th>
                    <th style={{ padding: "10px 12px" }}>Device / Browser</th>
                    <th style={{ padding: "10px 12px" }}>Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisits.map((visit) => {
                    const badge = getEventBadge(visit.type);
                    return (
                      <tr key={visit.id} style={{ borderBottom: "1px solid rgba(51, 65, 85, 0.4)" }}>
                        <td style={{ padding: "12px", whiteSpace: "nowrap", color: "#38bdf8", fontWeight: 600 }}>
                          {timeAgo(visit.timestamp)}
                          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>
                            {new Date(visit.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </div>
                        </td>
                        <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                          <span style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text, padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: "12px", color: "#ffffff", fontWeight: 600 }}>
                          <Link href={visit.path || "/"} target="_blank" style={{ color: "#38bdf8", textDecoration: "none" }}>
                            {visit.path || "/"}
                          </Link>
                          {visit.meta && Object.keys(visit.meta).length > 0 && (
                            <div style={{ fontSize: 11, color: "#34d399", marginTop: 3 }}>
                              {visit.meta.reference ? `Ref: ${visit.meta.reference}` : ""} {visit.meta.service ? `• ${visit.meta.service}` : ""} {visit.meta.name ? `• ${visit.meta.name}` : ""}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                          <div style={{ color: "#e2e8f0", fontWeight: 600 }}>
                            📍 {visit.city ? `${visit.city}, ` : ""}{visit.state || "Maharashtra"}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{visit.ip || "127.0.0.1"}</div>
                        </td>
                        <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ background: "#1e293b", border: "1px solid #334155", padding: "2px 6px", borderRadius: 4, fontSize: 11, color: "#e2e8f0" }}>
                              {visit.device || "Desktop"}
                            </span>
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>
                              {visit.browser} / {visit.os}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "12px", color: "#94a3b8", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {visit.referrer ? <span title={visit.referrer} style={{ color: "#cbd5e1" }}>{visit.referrer}</span> : <span style={{ color: "#475569" }}>Direct</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "32px 0", textAlign: "center", color: "#64748b" }}>
              {searchTerm || eventTypeFilter !== "all" ? "No visits matching your filter criteria." : "No visits recorded yet. Open your website pages to start tracking!"}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
