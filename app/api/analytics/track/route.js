import { recordEvent, lookupGeo } from "@/utilities/analyticsStore";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      type = "pageview", // "pageview", "phone_click", "whatsapp_click", "quote_submit", "contact_submit", "chat_open", "track_lookup"
      visitorId,
      sessionId,
      path,
      title,
      referrer,
      screen,
      language,
      meta,
    } = body;

    // Ignore admin paths
    if (typeof path === "string" && path.startsWith("/admin")) {
      return Response.json({ ok: true, ignored: true });
    }

    const userAgent = req.headers.get("user-agent") || "";

    // IP extraction
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfIp = req.headers.get("cf-connecting-ip");
    let ip = (forwarded ? forwarded.split(",")[0].trim() : (realIp || cfIp || "127.0.0.1"));
    if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";

    // Cloudflare / Vercel Geo headers if available
    let country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");
    let state = req.headers.get("x-vercel-ip-country-region") || req.headers.get("cf-region");
    let city = req.headers.get("x-vercel-ip-city") || req.headers.get("cf-ipcity");

    // Fallback to IP lookup
    if (!city || !country || country === "Unknown") {
      const geo = await lookupGeo(ip);
      country = geo.country || "India";
      state = geo.state || "Maharashtra";
      city = geo.city || "Mumbai";
    }

    const event = recordEvent({
      type,
      visitorId: visitorId || "anonymous",
      sessionId: sessionId || `session-${Date.now()}`,
      path: path || "/",
      title: title || "",
      referrer: referrer || "",
      userAgent,
      ip,
      country,
      state,
      city,
      screen: screen || "",
      language: language || "",
      meta: meta || {},
    });

    return Response.json({ ok: true, eventId: event.id });
  } catch (error) {
    console.error("[/api/analytics/track] Error:", error);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
