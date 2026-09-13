import { authenticateAdminUser, generateSessionToken, verifySessionToken } from "@/utilities/adminAuth";

export const dynamic = "force-dynamic";

/**
 * POST /api/analytics/auth
 * Login and verify User ID and Password strictly against MariaDB
 */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId, username, password } = body;

    const userIdentifier = userId || username;
    
    if (!userIdentifier || !password) {
      return Response.json(
        { ok: false, error: "Please provide both User ID and Password." },
        { status: 400 }
      );
    }

    const authResult = await authenticateAdminUser(userIdentifier, password);
    
    if (!authResult.success) {
      return Response.json(
        { ok: false, verified: false, error: authResult.error || "Invalid User ID or Password." },
        { status: 401 }
      );
    }

    const token = generateSessionToken({
      userId: authResult.user.userId,
      role: authResult.user.role,
      roleName: "Analytics Administrator",
    }, 24); // 24 hours validity

    return Response.json({
      ok: true,
      verified: true,
      token,
      user: authResult.user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("[/api/analytics/auth] Error:", error);
    return Response.json(
      { ok: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/auth
 * Verify existing session token
 */
export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-admin-token");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return Response.json({ ok: false, verified: false, error: "No token provided" }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return Response.json({ ok: false, verified: false, error: "Session expired or invalid token" }, { status: 401 });
    }

    return Response.json({
      ok: true,
      verified: true,
      user: {
        userId: payload.userId,
        role: payload.role || "admin",
      },
      expiresAt: payload.exp,
    });
  } catch (error) {
    return Response.json({ ok: false, error: "Authentication verification failed" }, { status: 500 });
  }
}
