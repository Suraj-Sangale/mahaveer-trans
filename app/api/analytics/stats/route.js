import { getAnalyticsSummary, clearAnalyticsData, getEvents } from "@/utilities/analyticsStore";

export const dynamic = "force-dynamic";

const ADMIN_PIN = process.env.ADMIN_ANALYTICS_PIN || "1234";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";
    const exportFormat = searchParams.get("export");
    const pin = searchParams.get("pin");

    // Optional PIN verification check via query/header
    const authHeader = req.headers.get("x-admin-pin");
    const providedPin = pin || authHeader;

    if (providedPin && providedPin !== ADMIN_PIN) {
      return Response.json({ ok: false, error: "Invalid PIN" }, { status: 401 });
    }

    if (exportFormat === "csv") {
      const events = getEvents();
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

    const summary = getAnalyticsSummary(range);
    return Response.json({ ok: true, data: summary });
  } catch (error) {
    console.error("[/api/analytics/stats] Error:", error);
    return Response.json({ ok: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, pin } = body;

    if (action === "verify_pin") {
      if (pin === ADMIN_PIN) {
        return Response.json({ ok: true, verified: true });
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
    clearAnalyticsData();
    return Response.json({ ok: true, message: "Analytics data cleared successfully" });
  } catch (error) {
    console.error("[/api/analytics/stats] Delete error:", error);
    return Response.json({ ok: false, error: "Failed to clear data" }, { status: 500 });
  }
}
