const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SESSION_SECRET,
  ALLOWED_USERNAME,
  STATE_COOKIE_NAME,
  getSiteUrl,
  setSessionCookie,
  clearSessionCookie,
  clearStateCookie,
  parseCookies,
  createSessionToken,
} = require("../_utils/auth");

module.exports = async function handler(req, res) {
  const siteUrl = getSiteUrl();

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !SESSION_SECRET) {
    return res.redirect(302, `${siteUrl}/admin?error=config`);
  }

  const { code, state, error: oauthError } = req.query;

  // User cancelled or GitHub returned an error
  if (oauthError || !code) {
    return res.redirect(302, `${siteUrl}/admin?error=${oauthError || "no_code"}`);
  }

  // Verify state parameter to prevent CSRF
  const cookies = parseCookies(req);
  const savedState = cookies[STATE_COOKIE_NAME];
  if (!savedState || savedState !== state) {
    res.setHeader("Set-Cookie", clearStateCookie());
    return res.redirect(302, `${siteUrl}/admin?error=state_mismatch`);
  }

  // Exchange code for access token
  let accessToken;
  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${siteUrl}/api/auth/callback`,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      return res.redirect(302, `${siteUrl}/admin?error=token_exchange`);
    }

    accessToken = tokenData.access_token;
  } catch {
    return res.redirect(302, `${siteUrl}/admin?error=token_exchange`);
  }

  // Fetch GitHub user profile
  let username;
  try {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!userResponse.ok) {
      return res.redirect(302, `${siteUrl}/admin?error=github_api`);
    }

    const userData = await userResponse.json();
    username = userData.login;
  } catch {
    return res.redirect(302, `${siteUrl}/admin?error=github_api`);
  }

  // Authorization check: only morpheus-30 is allowed
  if (username !== ALLOWED_USERNAME) {
    res.setHeader("Set-Cookie", [clearStateCookie(), clearSessionCookie()]);
    return res.redirect(302, `${siteUrl}/admin?error=unauthorized`);
  }

  // Create session and redirect to admin
  const sessionToken = createSessionToken(username);
  res.setHeader("Set-Cookie", [setSessionCookie(sessionToken), clearStateCookie()]);
  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, `${siteUrl}/admin`);
};
