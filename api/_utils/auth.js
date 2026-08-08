const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

// ─── Configuration ────────────────────────────────────────────────────────────

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const ALLOWED_USERNAME = "morpheus-30";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const COOKIE_NAME = "__session";
const STATE_COOKIE_NAME = "__oauth_state";

function getSiteUrl() {
  // SITE_URL should be set to your custom domain in production (e.g. https://iamnaksh.tech)
  // This takes priority over VERCEL_URL which returns the .vercel.app subdomain
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

function isSecure() {
  return getSiteUrl().startsWith("https");
}

function setSessionCookie(token) {
  return cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure(),
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

function clearSessionCookie() {
  return cookie.serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isSecure(),
    sameSite: "Lax",
    path: "/",
    maxAge: 0,
  });
}

function setStateCookie(state) {
  return cookie.serialize(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: isSecure(),
    sameSite: "Lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });
}

function clearStateCookie() {
  return cookie.serialize(STATE_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isSecure(),
    sameSite: "Lax",
    path: "/",
    maxAge: 0,
  });
}

// ─── Session Helpers ──────────────────────────────────────────────────────────

function parseCookies(req) {
  const cookieHeader = req.headers?.cookie || "";
  return cookie.parse(cookieHeader);
}

function createSessionToken(username) {
  return jwt.sign(
    { sub: username, iat: Math.floor(Date.now() / 1000) },
    SESSION_SECRET,
    { expiresIn: SESSION_MAX_AGE }
  );
}

function verifySessionToken(token) {
  try {
    const payload = jwt.verify(token, SESSION_SECRET);
    if (payload.sub !== ALLOWED_USERNAME) return null;
    return payload;
  } catch {
    return null;
  }
}

function generateState() {
  return crypto.randomBytes(20).toString("hex");
}

module.exports = {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SESSION_SECRET,
  ALLOWED_USERNAME,
  COOKIE_NAME,
  STATE_COOKIE_NAME,
  getSiteUrl,
  setSessionCookie,
  clearSessionCookie,
  setStateCookie,
  clearStateCookie,
  parseCookies,
  createSessionToken,
  verifySessionToken,
  generateState,
};
