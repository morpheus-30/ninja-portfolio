const {
  GITHUB_CLIENT_ID,
  SESSION_SECRET,
  getSiteUrl,
  setStateCookie,
  generateState,
} = require("../_utils/auth");

module.exports = function handler(req, res) {
  if (!GITHUB_CLIENT_ID || !SESSION_SECRET) {
    return res.status(500).json({ error: "OAuth is not configured on this deployment." });
  }

  const state = generateState();
  const siteUrl = getSiteUrl();
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${siteUrl}/api/auth/callback`,
    scope: "read:user",
    state,
  });

  res.setHeader("Set-Cookie", setStateCookie(state));
  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
