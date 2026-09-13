import crypto from "crypto";
import mysql from "mysql2/promise";

const JWT_SECRET = process.env.SESSION_SECRET;
if (!JWT_SECRET) {
  // Fail fast rather than silently signing tokens with a predictable secret.
  throw new Error(
    "[Auth] SESSION_SECRET environment variable is required and was not set.",
  );
}

// MariaDB / MySQL environment variables
const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DATABASE_URL = process.env.DATABASE_URL;

let dbPool = null;

/**
 * Get or initialize the MariaDB/MySQL connection pool.
 * @returns {Promise<import('mysql2/promise').Pool|null>}
 */
async function getDbPool() {
  if (dbPool) return dbPool;

  const hasConfig = Boolean(DATABASE_URL || (DB_HOST && DB_USER && DB_NAME));
  if (!hasConfig) {
    console.error(
      "[Auth] Database configuration missing (need DATABASE_URL, or DB_HOST/DB_USER/DB_NAME/DB_PASSWORD).",
    );
    return null;
  }

  try {
    dbPool = DATABASE_URL
      ? mysql.createPool({
          uri: DATABASE_URL,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        })
      : mysql.createPool({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });

    return dbPool;
  } catch (err) {
    console.error("[Auth] Failed to initialize database connection pool:", err?.message || err);
    return null;
  }
}

/**
 * Hash a password using PBKDF2-SHA512.
 * @param {string} password
 * @param {string} [salt] Existing salt (hex); a new one is generated if omitted.
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
 * Verify a plaintext password against a stored PBKDF2-SHA512 hash + salt.
 * Only this one scheme is accepted — no plaintext/MD5/unsalted fallbacks.
 * @param {string} password
 * @param {string} storedHash
 * @param {string} salt
 * @returns {boolean}
 */
export function verifyPassword(password, storedHash, salt) {
  try {
    // console.log("🚀 ~ verifyPassword ~ password:", password)
    // console.log("🚀 ~ verifyPassword ~ storedHash:", storedHash)
    // console.log("🚀 ~ verifyPassword ~ salt:", salt)
    if (!password || !storedHash || !salt) return false;

    const computedHash = crypto
      .pbkdf2Sync(String(password), String(salt), 10000, 64, "sha512")
      .toString("hex");

    const a = Buffer.from(computedHash, "hex");
    const b = Buffer.from(String(storedHash), "hex");
    if (a.length !== b.length) return false;

    return crypto.timingSafeEqual(a, b);
  } catch (err) {
    console.error("[Auth] verifyPassword error:", err?.message || err);
    return false;
  }
}

/**
 * Generate a signed session token.
 * @param {object} payload
 * @param {number} [expiresInHours]
 * @returns {string}
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
 * Verify and decode a session token.
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
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedData, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

/**
 * Authenticate credentials against MariaDB `admin_users` table.
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
      return { success: false, error: "Database configuration error. Please check server logs." };
    }

    const [rows] = await pool.query(
      `SELECT id, user_id, username, email, password_hash, salt, role, is_active
       FROM admin_users
       WHERE (LOWER(user_id) = LOWER(?) OR LOWER(email) = LOWER(?))
         AND is_active = 1
       LIMIT 1`,
      [cleanUser, cleanUser],
    );

    // console.log('rows', rows)
    // console.log('rows 1', Array.isArray(rows) && rows.length > 0)
    if (Array.isArray(rows) && rows.length > 0) {
      const dbUser = rows[0];
      const isMatch = verifyPassword(
        cleanPass,
        dbUser.password_hash,
        dbUser.salt,
      );

      // console.log('isMatch', isMatch)
      if (isMatch) {
        // Fire-and-forget last-login update
        pool
          .query(`UPDATE admin_users SET last_login_at = NOW() WHERE id = ?`, [dbUser.id])
          .catch((err) => console.error("[Auth] Failed to update last_login_at:", err?.message || err));

        return {
          success: true,
          user: {
            id: dbUser.id,
            userId: dbUser.user_id,
            username: dbUser.username || dbUser.user_id,
            email: dbUser.email,
            role: dbUser.role || "admin",
            permissions: ["analytics:view", "analytics:export", "analytics:manage"],
          },
        };
      }
    }

    return { success: false, error: "Invalid User ID or Password." };
  } catch (dbErr) {
    console.error("[Auth] Database query error:", dbErr?.message || dbErr);
    return { success: false, error: "Database error occurred while authenticating. Please try again." };
  }
}