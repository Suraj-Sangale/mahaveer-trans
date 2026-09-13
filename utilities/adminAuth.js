import crypto from "crypto";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  process.env.SESSION_SECRET ||
  "mahaveer-trans-analytics-secret-key-2026";

// MariaDB / MySQL Environment Variables
const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DATABASE_URL = process.env.DATABASE_URL;

let dbPool = null;

/**
 * Get or initialize MariaDB connection pool
 */
async function getDbPool() {
  if (dbPool) return dbPool;

  const hasConfig = DATABASE_URL || (DB_HOST && DB_USER && DB_NAME);
  if (!hasConfig) {
    console.error("[MariaDB Auth]: Database configuration missing in .env (DB_HOST, DB_USER, DB_NAME, DB_PASSWORD).");
    return null;
  }

  try {
    const mysql = await import("mysql2/promise");

    if (DATABASE_URL) {
      dbPool = mysql.createPool({
        uri: DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    } else {
      dbPool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    return dbPool;
  } catch (err) {
    console.error(
      "[MariaDB Auth]: Failed to initialize database connection pool.",
      err?.message || err,
    );
    return null;
  }
}

/**
 * Hash password using PBKDF2 with SHA-512
 * @param {string} password
 * @param {string} salt (optional)
 * @returns {{ hash: string, salt: string }}
 */
export function hashPassword(password, salt = null) {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, generatedSalt, 10000, 64, "sha512")
    .toString("hex");
  return { hash, salt: generatedSalt };
}

/**
 * Verify a plain text password against stored hash & salt
 * @param {string} password
 * @param {string} storedHash
 * @param {string} salt
 * @returns {boolean}
 */
export function verifyPassword(password, storedHash, salt) {
  try {
    if (!password || !storedHash) return false;

    // If salt is provided, verify using PBKDF2
    if (salt) {
      const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
      const hashBuffer = Buffer.from(hash, "hex");
      const storedBuffer = Buffer.from(storedHash, "hex");
      if (hashBuffer.length !== storedBuffer.length) return false;
      return crypto.timingSafeEqual(hashBuffer, storedBuffer);
    }

    // Direct comparison (for plain match or direct hash)
    const passBuf = Buffer.from(password);
    const storedBuf = Buffer.from(storedHash);
    if (passBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(passBuf, storedBuf);
  } catch {
    return false;
  }
}

/**
 * Generate a signed session token
 * @param {object} payload
 * @param {number} expiresInHours
 * @returns {string} token
 */
export function generateSessionToken(payload, expiresInHours = 24) {
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  const data = JSON.stringify({ ...payload, exp: expiresAt });
  const encodedData = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encodedData)
    .digest("base64url");
  return `${encodedData}.${signature}`;
}

/**
 * Verify and decode session token
 * @param {string} token
 * @returns {object|null}
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedData, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encodedData)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (
    sigBuf.length !== expBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedData, "base64url").toString("utf-8"),
    );
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Authenticate credentials strictly against MariaDB admin_users table
 * @param {string} userId
 * @param {string} password
 * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
 */
export async function authenticateAdminUser(userId, password) {
  if (!userId || !password) {
    return { success: false, error: "User ID and password are required." };
  }

  const cleanUser = String(userId).trim();
  const cleanPass = String(password).trim();

  try {
    const pool = await getDbPool();
    if (!pool) {
      return {
        success: false,
        error: "Database configuration error. Please check server logs.",
      };
    }

    const [rows] = await pool.query(
      `SELECT id, user_id, username, email, password_hash, salt, role, is_active 
       FROM admin_users 
       WHERE (LOWER(user_id) = LOWER(?) OR LOWER(email) = LOWER(?)) 
         AND is_active = 1 
       LIMIT 1`,
      [cleanUser, cleanUser],
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const dbUser = rows[0];
      const isMatch = verifyPassword(
        cleanPass,
        dbUser.password_hash,
        dbUser.salt,
      );

      if (isMatch) {
        // Update last_login_at timestamp asynchronously
        pool
          .query(
            `UPDATE admin_users SET last_login_at = NOW() WHERE id = ?`,
            [dbUser.id],
          )
          .catch(() => {});

        return {
          success: true,
          user: {
            id: dbUser.id,
            userId: dbUser.user_id,
            username: dbUser.username || dbUser.user_id,
            email: dbUser.email,
            role: dbUser.role || "admin",
            permissions: [
              "analytics:view",
              "analytics:export",
              "analytics:manage",
            ],
          },
        };
      }
    }

    return {
      success: false,
      error: "Invalid User ID or Password.",
    };
  } catch (dbErr) {
    console.error("[MariaDB Query Error]:", dbErr?.message || dbErr);
    return {
      success: false,
      error: "Database error occurred while authenticating. Please try again.",
    };
  }
}
