const { SESSION_SECRET, COOKIE_NAME, parseCookies, verifySessionToken } = require("./auth");

/**
 * Middleware-style auth check for admin API routes.
 * Returns the authenticated username or sends a 401 and returns null.
 */
function requireAuth(req, res) {
  if (!SESSION_SECRET) {
    res.status(500).json({ error: "Server misconfigured." });
    return null;
  }

  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return null;
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired session." });
    return null;
  }

  return payload.sub;
}

module.exports = { requireAuth };
