import { recordEvent, lookupGeo } from "@/utilities/analyticsStore";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      type = "pageview",
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

    // Vercel / Cloudflare Geolocation headers
    let country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");
    let state = req.headers.get("x-vercel-ip-country-region") || req.headers.get("cf-region");
    let city = req.headers.get("x-vercel-ip-city") || req.headers.get("cf-ipcity");
    let postalCode = req.headers.get("x-vercel-ip-postal-code") || req.headers.get("cf-postal-code");
    let lat = req.headers.get("x-vercel-ip-latitude") || req.headers.get("cf-iplatitude");
    let lon = req.headers.get("x-vercel-ip-longitude") || req.headers.get("cf-iplongitude");
    let isp = req.headers.get("x-vercel-ip-as-number");

    if (city) {
      try {
        city = decodeURIComponent(city);
      } catch (e) {}
    }

    // Fallback to IP lookup if no headers or incomplete location
    if (!city || !country || country === "Unknown" || !lat || !postalCode) {
      const geo = await lookupGeo(ip);
      country = country || geo.country || "India";
      state = state || geo.state || "Maharashtra";
      city = city || geo.city || "Mumbai";
      postalCode = postalCode || geo.postalCode || "";
      lat = lat || geo.lat;
      lon = lon || geo.lon;
      isp = isp || geo.isp || "";
    }

    const event = await recordEvent({
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
      postalCode,
      lat,
      lon,
      isp,
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
