import fs from "fs";
import path from "path";
import os from "os";

// Detect if running on Vercel / Serverless
const IS_VERCEL = process.env.VERCEL === "1" || process.env.NOW_REGION !== undefined;
const DATA_DIR = IS_VERCEL ? path.join(os.tmpdir(), "mahaveer_analytics") : path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "analytics_events.json");
const MAX_STORED_EVENTS = 30000;

// Upstash Redis / Vercel KV REST config (if provided in environment variables)
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "mahaveer_analytics_events";

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // ignore
  }
}

// ── Upstash / Vercel KV REST Helper ──
async function redisRequest(command, ...args) {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}/${command}/${args.map(encodeURIComponent).join("/")}`, {
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result;
  } catch (err) {
    console.error("[analyticsStore Redis Error]:", err);
    return null;
  }
}

export function parseUserAgent(ua = "") {
  let browser = "Other";
  let os = "Other";
  let device = "Desktop";

  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = "Mobile";
  } else if (/ipad|tablet|playbook|silk/i.test(ua)) {
    device = "Tablet";
  }

  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";

  return { browser, os, device };
}

const geoCache = new Map();

export async function lookupGeo(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { country: "India", state: "Maharashtra", city: "Mumbai" };
  }

  if (geoCache.has(ip)) {
    return geoCache.get(ip);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        const geo = {
          country: data.country || "India",
          state: data.regionName || "Maharashtra",
          city: data.city || "Mumbai",
        };
        geoCache.set(ip, geo);
        return geo;
      }
    }
  } catch (err) {
    // fallback
  }

  const fallback = { country: "India", state: "Maharashtra", city: "Mumbai" };
  geoCache.set(ip, fallback);
  return fallback;
}

export async function recordEvent(eventData) {
  const { browser, os, device } = parseUserAgent(eventData.userAgent || "");
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type: eventData.type || "pageview",
    visitorId: eventData.visitorId || "anonymous",
    sessionId: eventData.sessionId || `s_${Date.now()}`,
    path: eventData.path || "/",
    title: eventData.title || "",
    referrer: eventData.referrer || "",
    browser,
    os,
    device,
    ip: eventData.ip || "127.0.0.1",
    country: eventData.country || "India",
    state: eventData.state || "Maharashtra",
    city: eventData.city || "Mumbai",
    screen: eventData.screen || "",
    language: eventData.language || "",
    meta: eventData.meta || {},
    timestamp: new Date().toISOString(),
  };

  // 1. If Redis / Vercel KV is configured, store in cloud Redis
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      await redisRequest("lpush", REDIS_KEY, JSON.stringify(event));
      await redisRequest("ltrim", REDIS_KEY, 0, MAX_STORED_EVENTS - 1);
      return event;
    } catch (err) {
      console.error("[analyticsStore] Cloud storage failed, falling back to local:", err);
    }
  }

  // 2. Fallback to file storage (local or /tmp on Vercel)
  try {
    ensureDataDir();
    let events = [];
    if (fs.existsSync(EVENTS_FILE)) {
      try {
        const raw = fs.readFileSync(EVENTS_FILE, "utf8");
        events = JSON.parse(raw);
        if (!Array.isArray(events)) events = [];
      } catch (e) {
        events = [];
      }
    }

    events.push(event);

    if (events.length > MAX_STORED_EVENTS) {
      events = events.slice(events.length - MAX_STORED_EVENTS);
    }

    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf8");
  } catch (err) {
    console.error("[analyticsStore] Error saving event to file:", err);
  }

  return event;
}

export async function getEvents() {
  // 1. If Redis / Vercel KV is configured, fetch from cloud
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const items = await redisRequest("lrange", REDIS_KEY, 0, -1);
      if (Array.isArray(items)) {
        return items.map((it) => (typeof it === "string" ? JSON.parse(it) : it));
      }
    } catch (err) {
      console.error("[analyticsStore] Redis fetch error:", err);
    }
  }

  // 2. Fallback to file storage
  try {
    ensureDataDir();
    if (!fs.existsSync(EVENTS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(EVENTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function clearAnalyticsData() {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      await redisRequest("del", REDIS_KEY);
    } catch (e) {
      console.error("[analyticsStore] Clear redis error:", e);
    }
  }

  try {
    ensureDataDir();
    fs.writeFileSync(EVENTS_FILE, JSON.stringify([], null, 2), "utf8");
  } catch (err) {
    console.error("[analyticsStore] Error clearing data:", err);
  }
}

export async function getAnalyticsSummary(timeRange = "7d") {
  const allEvents = await getEvents();
  const now = new Date();

  let cutoff = new Date(0);
  if (timeRange === "today") {
    cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (timeRange === "7d") {
    cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timeRange === "30d") {
    cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const events = allEvents.filter((ev) => new Date(ev.timestamp) >= cutoff);

  // Active in last 5 minutes
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const activeSessions = new Set(
    allEvents
      .filter((ev) => new Date(ev.timestamp) >= fiveMinAgo)
      .map((ev) => ev.visitorId || ev.sessionId)
  );

  const pageviews = events.filter((e) => !e.type || e.type === "pageview");
  const totalPageViews = pageviews.length;
  const uniqueVisitors = new Set(events.map((e) => e.visitorId).filter(Boolean)).size || (events.length > 0 ? 1 : 0);
  const totalSessions = new Set(events.map((e) => e.sessionId).filter(Boolean)).size || (events.length > 0 ? 1 : 0);
  const avgPagesPerSession = totalSessions > 0 ? Number((totalPageViews / totalSessions).toFixed(1)) : 0;

  // Conversions
  const conversions = {
    quotes: events.filter((e) => e.type === "quote_submit").length,
    contacts: events.filter((e) => e.type === "contact_submit").length,
    phoneClicks: events.filter((e) => e.type === "phone_click").length,
    whatsappClicks: events.filter((e) => e.type === "whatsapp_click").length,
    chatInteractions: events.filter((e) => e.type === "chat_open" || e.type === "chat_message").length,
    trackingLookups: events.filter((e) => e.type === "track_lookup").length,
    totalConversions: 0,
    conversionRate: 0,
  };
  conversions.totalConversions =
    conversions.quotes +
    conversions.contacts +
    conversions.phoneClicks +
    conversions.whatsappClicks;
  conversions.conversionRate =
    uniqueVisitors > 0 ? Number(((conversions.totalConversions / uniqueVisitors) * 100).toFixed(1)) : 0;

  // Top Pages
  const pageMap = {};
  pageviews.forEach((e) => {
    const p = e.path || "/";
    if (!pageMap[p]) pageMap[p] = { views: 0, visitors: new Set() };
    pageMap[p].views += 1;
    if (e.visitorId) pageMap[p].visitors.add(e.visitorId);
  });

  const topPages = Object.entries(pageMap)
    .map(([path, data]) => ({
      path,
      views: data.views,
      uniqueVisitors: data.visitors.size || 1,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 15);

  // Geographic Breakdown
  const cityMap = {};
  const stateMap = {};
  const countryMap = {};

  events.forEach((e) => {
    const c = e.city && e.city !== "Unknown" ? e.city : "Mumbai";
    const s = e.state && e.state !== "Unknown" ? e.state : "Maharashtra";
    const co = e.country && e.country !== "Unknown" ? e.country : "India";

    cityMap[c] = (cityMap[c] || 0) + 1;
    stateMap[s] = (stateMap[s] || 0) + 1;
    countryMap[co] = (countryMap[co] || 0) + 1;
  });

  const toPercentageList = (map) => {
    const total = Object.values(map).reduce((sum, v) => sum + v, 0) || 1;
    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  };

  const cities = toPercentageList(cityMap).slice(0, 12);
  const states = toPercentageList(stateMap).slice(0, 10);
  const countries = toPercentageList(countryMap).slice(0, 8);

  // Referrers
  const refMap = {};
  pageviews.forEach((e) => {
    let source = "Direct / Bookmark";
    if (e.referrer) {
      try {
        const url = new URL(e.referrer);
        if (url.hostname.includes("google")) source = "Google Search";
        else if (url.hostname.includes("bing")) source = "Bing Search";
        else if (url.hostname.includes("facebook") || url.hostname.includes("fb.com")) source = "Facebook";
        else if (url.hostname.includes("instagram")) source = "Instagram";
        else if (url.hostname.includes("linkedin")) source = "LinkedIn";
        else if (url.hostname.includes("twitter") || url.hostname.includes("x.com")) source = "X / Twitter";
        else if (url.hostname.includes("whatsapp")) source = "WhatsApp";
        else source = url.hostname;
      } catch {
        source = e.referrer;
      }
    }
    refMap[source] = (refMap[source] || 0) + 1;
  });

  const referrers = Object.entries(refMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Devices, Browsers, OS
  const devMap = {};
  const browserMap = {};
  const osMap = {};

  events.forEach((e) => {
    const dev = e.device || "Desktop";
    const br = e.browser || "Other";
    const op = e.os || "Other";
    devMap[dev] = (devMap[dev] || 0) + 1;
    browserMap[br] = (browserMap[br] || 0) + 1;
    osMap[op] = (osMap[op] || 0) + 1;
  });

  const devices = toPercentageList(devMap);
  const browsers = toPercentageList(browserMap);
  const operatingSystems = toPercentageList(osMap);

  // Daily / Hourly Activity
  let dailyActivity = [];

  if (timeRange === "today") {
    // 24 Hourly Buckets for Today
    const hourlyMap = {};
    for (let h = 0; h < 24; h++) {
      const label = `${h.toString().padStart(2, "0")}:00`;
      hourlyMap[label] = { views: 0, visitors: new Set(), conversions: 0 };
    }

    events.forEach((e) => {
      const d = new Date(e.timestamp);
      const h = d.getHours();
      const label = `${h.toString().padStart(2, "0")}:00`;
      if (hourlyMap[label]) {
        if (!e.type || e.type === "pageview") {
          hourlyMap[label].views += 1;
        } else {
          hourlyMap[label].conversions += 1;
        }
        if (e.visitorId) hourlyMap[label].visitors.add(e.visitorId);
      }
    });

    dailyActivity = Object.entries(hourlyMap).map(([date, d]) => ({
      date,
      views: d.views,
      visitors: d.visitors.size,
      conversions: d.conversions,
    }));
  } else {
    // Daily Activity for 7d, 30d, all
    const dailyMap = {};
    const daysToShow = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 30;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyMap[key] = { views: 0, visitors: new Set(), conversions: 0 };
    }

    events.forEach((e) => {
      const key = e.timestamp.split("T")[0];
      if (!dailyMap[key]) {
        dailyMap[key] = { views: 0, visitors: new Set(), conversions: 0 };
      }
      if (!e.type || e.type === "pageview") {
        dailyMap[key].views += 1;
      } else {
        dailyMap[key].conversions += 1;
      }
      if (e.visitorId) dailyMap[key].visitors.add(e.visitorId);
    });

    dailyActivity = Object.entries(dailyMap).map(([date, d]) => ({
      date,
      views: d.views,
      visitors: d.visitors.size,
      conversions: d.conversions,
    }));
  }

  const recentVisits = [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 60);

  return {
    isCloudStorage: !!(REDIS_URL && REDIS_TOKEN),
    realtimeActiveVisitors: activeSessions.size,
    totalPageViews,
    uniqueVisitors,
    totalSessions,
    avgPagesPerSession,
    conversions,
    cities,
    states,
    countries,
    topPages,
    referrers,
    devices,
    browsers,
    operatingSystems,
    dailyActivity,
    recentVisits,
  };
}
