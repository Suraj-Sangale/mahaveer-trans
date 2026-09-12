"use client";

export function getOrCreateVisitorId() {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem("_mt_vid");
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem("_mt_vid", vid);
    }
    return vid;
  } catch {
    return "v_anon_" + Date.now().toString(36);
  }
}

export function getOrCreateSessionId() {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem("_mt_sid");
    if (!sid) {
      sid = "s_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem("_mt_sid", sid);
    }
    return sid;
  } catch {
    return "s_anon_" + Date.now().toString(36);
  }
}

export function trackCustomEvent(type, meta = {}) {
  if (typeof window === "undefined") return;

  try {
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();

    const payload = {
      type, // "phone_click", "whatsapp_click", "quote_submit", "contact_submit", "chat_open", "track_lookup", etc.
      visitorId,
      sessionId,
      path: window.location.pathname || "/",
      title: document.title || "",
      referrer: document.referrer || "",
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language || "",
      meta,
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // ignore
  }
}
