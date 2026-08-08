/**
 * Client-side auth utilities.
 *
 * These do NOT enforce authorization — that's done server-side.
 * They simply query the server-verified session to determine
 * what UI to show.
 */

const AUTH_BASE = "/api/auth";

/**
 * Check current session status with the server.
 * Returns { authenticated: boolean, user?: { username: string }, error?: string }
 */
export async function checkSession() {
  try {
    const response = await fetch(`${AUTH_BASE}/session`, {
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch {
    return { authenticated: false, error: "network_error" };
  }
}

/**
 * Redirect to GitHub OAuth login.
 */
export function redirectToLogin() {
  window.location.href = `${AUTH_BASE}/login`;
}

/**
 * Redirect to logout endpoint (clears server session cookie).
 */
export function redirectToLogout() {
  window.location.href = `${AUTH_BASE}/logout`;
}
