const {
  SESSION_SECRET,
  COOKIE_NAME,
  parseCookies,
  verifySessionToken,
} = require("../_utils/auth");

module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!SESSION_SECRET) {
    return res.status(500).json({ error: "Server misconfigured." });
  }

  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ authenticated: false, error: "no_session" });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return res.status(401).json({ authenticated: false, error: "invalid_session" });
  }

  return res.status(200).json({
    authenticated: true,
    user: { username: payload.sub },
  });
};
