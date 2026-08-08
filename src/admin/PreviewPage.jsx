import { useEffect, useState } from "react";
import { checkSession } from "./auth";
import { fetchDraft } from "./api";
import Portfolio from "../Portfolio";

/**
 * PreviewPage renders the actual portfolio with draft data overridden.
 * It temporarily overrides the data module, then renders the full Portfolio.
 *
 * This is wrapped in auth so only morpheus-30 can access it.
 */
export default function PreviewPage() {
  const [state, setState] = useState("loading"); // loading | authenticated | denied
  const [draftData, setDraftData] = useState(null);

  useEffect(() => {
    checkSession().then((result) => {
      if (result.authenticated) {
        setState("authenticated");
        fetchDraft().then((res) => {
          setDraftData(res.data);
        }).catch(() => {
          setState("error");
        });
      } else {
        setState("denied");
      }
    });
  }, []);

  if (state === "loading" || (state === "authenticated" && !draftData)) {
    return (
      <div style={previewStyles.loading}>
        <p>Loading preview...</p>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div style={previewStyles.loading}>
        <p>Access denied. Please log in at /admin first.</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div style={previewStyles.loading}>
        <p>Failed to load draft data.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Preview banner */}
      <div style={previewStyles.banner}>
        <span>PREVIEW MODE — Showing draft content</span>
        <button
          style={previewStyles.bannerButton}
          onClick={() => window.close()}
        >
          Close Preview
        </button>
      </div>
      {/* Render portfolio with draft data override */}
      <Portfolio overrideData={draftData} />
    </div>
  );
}

const previewStyles = {
  loading: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0a0a0a",
    color: "#888",
    fontFamily: "system-ui, sans-serif",
  },
  banner: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    padding: "0.5rem 1rem",
    background: "rgba(37, 99, 235, 0.95)",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    backdropFilter: "blur(4px)",
  },
  bannerButton: {
    padding: "0.3rem 0.7rem",
    borderRadius: "4px",
    border: "1px solid rgba(255,255,255,0.4)",
    background: "transparent",
    color: "#fff",
    fontSize: "0.75rem",
    cursor: "pointer",
  },
};
