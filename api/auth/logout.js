const { getSiteUrl, clearSessionCookie } = require("../_utils/auth");

module.exports = function handler(req, res) {
  const siteUrl = getSiteUrl();
  res.setHeader("Set-Cookie", clearSessionCookie());
  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, `${siteUrl}/admin`);
};
