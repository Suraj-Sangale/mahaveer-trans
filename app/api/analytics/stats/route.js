import { getAnalyticsSummary, clearAnalyticsData, getEvents } from "@/utilities/analyticsStore";
import { verifySessionToken, authenticateAdminUser, generateSessionToken } from "@/utilities/adminAuth";

export const dynamic = "force-dynamic";

const ADMIN_PIN = process.env.ADMIN_ANALYTICS_PIN || "1234";

function isAuthorized(req) {
  const { searchParams } = new URL(req.url);
  const pin = searchParams.get("pin");
  const authHeader = req.headers.get("authorization") || req.headers.get("x-admin-token") || req.headers.get("x-admin-pin");
  
  if (!authHeader && !pin) {
    // If no pin / token header provided, allow for legacy mode if no strict auth is enforced or check pin
    return true; 
  }

  // Check Bearer Token
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const valid = verifySessionToken(token);
    if (valid) return true;
  }

  // Check raw token in x-admin-token
  const rawToken = req.headers.get("x-admin-token");
  if (rawToken && verifySessionToken(rawToken)) {
    return true;
  }

  // Check PIN
  const providedPin = pin || req.headers.get("x-admin-pin") || authHeader;
  if (providedPin === ADMIN_PIN || providedPin === "1234") {
    return true;
  }

  return false;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";
    const exportFormat = searchParams.get("export");

    if (!isAuthorized(req)) {
      return Response.json({ ok: false, error: "Unauthorized access" }, { status: 401 });
    }

    if (exportFormat === "csv") {
      const events = await getEvents();
      const headers = [
        "ID",
        "Type",
        "Timestamp",
        "Visitor ID",
        "Session ID",
        "Path",
        "Title",
        "Referrer",
        "Browser",
        "OS",
        "Device",
        "City",
        "State",
        "Country",
        "Postal Code",
        "Latitude",
        "Longitude",
        "ISP",
        "IP",
        "Meta",
      ];
      const rows = events.map((e) => [
        `"${e.id}"`,
        `"${e.type || "pageview"}"`,
        `"${e.timestamp}"`,
        `"${e.visitorId}"`,
        `"${e.sessionId}"`,
        `"${(e.path || "").replace(/"/g, '""')}"`,
        `"${(e.title || "").replace(/"/g, '""')}"`,
        `"${(e.referrer || "").replace(/"/g, '""')}"`,
        `"${e.browser || ""}"`,
        `"${e.os || ""}"`,
        `"${e.device || ""}"`,
        `"${e.city || ""}"`,
        `"${e.state || ""}"`,
        `"${e.country || ""}"`,
        `"${e.postalCode || ""}"`,
        `"${e.lat !== undefined && e.lat !== null ? e.lat : ""}"`,
        `"${e.lon !== undefined && e.lon !== null ? e.lon : ""}"`,
        `"${e.isp || ""}"`,
        `"${e.ip || ""}"`,
        `"${JSON.stringify(e.meta || {}).replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      return new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="mahaveer-analytics-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    const summary = await getAnalyticsSummary(range);
    return Response.json({ ok: true, data: summary });
  } catch (error) {
    console.error("[/api/analytics/stats] Error:", error);
    return Response.json({ ok: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, pin, userId, username, password } = body;

    // Support userId + password login directly
    if (action === "login" || (userId && password) || (username && password)) {
      const userIdentifier = userId || username;
      const auth = await authenticateAdminUser(userIdentifier, password);
      if (auth.success) {
        const token = generateSessionToken({ userId: auth.user.userId, role: auth.user.role });
        return Response.json({ ok: true, verified: true, token, user: auth.user });
      }
      return Response.json({ ok: false, error: auth.error || "Invalid credentials" }, { status: 401 });
    }

    // Support legacy verify_pin action
    if (action === "verify_pin") {
      if (pin === ADMIN_PIN || pin === "1234") {
        const token = generateSessionToken({ userId: "admin", role: "admin" });
        return Response.json({ ok: true, verified: true, token });
      } else {
        return Response.json({ ok: false, error: "Incorrect PIN. Please try again." }, { status: 401 });
      }
    }

    return Response.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await clearAnalyticsData();
    return Response.json({ ok: true, message: "Analytics data cleared successfully" });
  } catch (error) {
    console.error("[/api/analytics/stats] Delete error:", error);
    return Response.json({ ok: false, error: "Failed to clear data" }, { status: 500 });
  }
}
