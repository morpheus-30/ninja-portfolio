import { useCallback, useEffect, useState } from "react";
import { checkSession, redirectToLogin, redirectToLogout } from "./auth";

/**
 * Error messages for various OAuth/auth failure states.
 */
const ERROR_MESSAGES = {
  access_denied: "GitHub login was cancelled.",
  no_code: "GitHub login was cancelled or failed.",
  state_mismatch: "Authentication failed (state mismatch). Please try again.",
  token_exchange: "Failed to complete GitHub authentication. Please try again.",
  github_api: "Could not verify your GitHub identity. Please try again.",
  unauthorized: "Access denied. Only the portfolio owner can access this area.",
  config: "OAuth is not configured on this deployment.",
  network_error: "Network error. Please check your connection and try again.",
  invalid_session: "Your session has expired. Please log in again.",
  no_session: null, // Not an error — just not logged in
};

function getErrorFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("error");
}

/**
 * AdminGate wraps the admin panel.
 * - Shows a login screen if unauthenticated
 * - Shows error messages for OAuth failures
 * - Renders children only when authenticated
 */
export default function AdminGate({ children }) {
  const [authState, setAuthState] = useState("loading"); // loading | authenticated | unauthenticated
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for error in URL params (from OAuth redirect)
    const urlError = getErrorFromUrl();
    if (urlError) {
      setError(urlError);
      // Clean URL without reload
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Verify session with server
    checkSession().then((result) => {
      if (result.authenticated) {
        setAuthState("authenticated");
        setUser(result.user);
        setError(null);
      } else {
        setAuthState("unauthenticated");
        if (result.error && result.error !== "no_session") {
          setError(result.error);
        }
      }
    });
  }, []);

  const handleLogin = useCallback(() => {
    setError(null);
    redirectToLogin();
  }, []);

  const handleLogout = useCallback(() => {
    redirectToLogout();
  }, []);

  // Loading state
  if (authState === "loading") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={styles.text}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Authenticated — render admin content
  if (authState === "authenticated" && user) {
    return (
      <div style={styles.adminWrapper}>
        <header style={styles.adminHeader}>
          <span style={styles.adminTitle}>Admin Panel</span>
          <div style={styles.adminHeaderRight}>
            <span style={styles.username}>@{user.username}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </header>
        <main style={styles.adminContent}>{children}</main>
      </div>
    );
  }

  // Unauthenticated — show login screen
  const errorMessage = error ? ERROR_MESSAGES[error] || `Authentication error: ${error}` : null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Admin Access</h1>
        <p style={styles.text}>
          Sign in with GitHub to access the portfolio admin panel.
        </p>

        {errorMessage && (
          <div
            style={
              error === "unauthorized" ? styles.errorBoxDenied : styles.errorBox
            }
          >
            {errorMessage}
          </div>
        )}

        <button onClick={handleLogin} style={styles.loginButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ marginRight: "0.5rem" }}
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Sign in with GitHub
        </button>

        <a href="/" style={styles.backLink}>
          ← Back to portfolio
        </a>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  container: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0a0a0a",
    fontFamily: "'Oxanium', system-ui, sans-serif",
    padding: "1rem",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "2.5rem 2rem",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
    textAlign: "center",
    color: "#e8e8e8",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    color: "#ffffff",
  },
  text: {
    fontSize: "0.92rem",
    color: "#999",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
  },
  errorBox: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,180,50,0.3)",
    background: "rgba(255,180,50,0.08)",
    color: "#ffcc66",
    fontSize: "0.85rem",
    marginBottom: "1.25rem",
    lineHeight: 1.5,
  },
  errorBoxDenied: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,60,60,0.35)",
    background: "rgba(255,60,60,0.08)",
    color: "#ff7777",
    fontSize: "0.85rem",
    marginBottom: "1.25rem",
    lineHeight: 1.5,
  },
  loginButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "0.85rem 1.25rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#24292e",
    color: "#ffffff",
    fontSize: "0.95rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 150ms ease, border-color 150ms ease",
    marginBottom: "1.25rem",
  },
  backLink: {
    display: "inline-block",
    color: "#666",
    fontSize: "0.85rem",
    textDecoration: "none",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "2px solid rgba(255,255,255,0.1)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    margin: "0 auto 1rem",
    animation: "spin 0.6s linear infinite",
  },
  adminWrapper: {
    minHeight: "100vh",
    background: "#0a0a0a",
    fontFamily: "'Oxanium', system-ui, sans-serif",
    color: "#e8e8e8",
  },
  adminHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(15,15,15,0.95)",
  },
  adminTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#fff",
  },
  adminHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  username: {
    fontSize: "0.85rem",
    color: "#888",
  },
  logoutButton: {
    padding: "0.4rem 0.85rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    color: "#ccc",
    fontSize: "0.82rem",
    cursor: "pointer",
  },
  adminContent: {
    padding: "2rem 1.5rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
};
