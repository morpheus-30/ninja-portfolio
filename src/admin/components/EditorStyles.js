/**
 * Shared styles for admin editor components.
 */

export const styles = {
  // Layout
  tabs: {
    display: "flex",
    gap: "0.25rem",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "1.5rem",
    overflowX: "auto",
  },
  tab: {
    padding: "0.6rem 1rem",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#888",
    fontSize: "0.85rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "color 150ms, border-color 150ms",
  },
  tabActive: {
    color: "#fff",
    borderBottomColor: "#4f9eff",
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#e0e0e0",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  // Form elements
  fieldGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "0.78rem",
    color: "#999",
    marginBottom: "0.35rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e8e8e8",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 150ms",
  },
  textarea: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e8e8e8",
    fontSize: "0.9rem",
    outline: "none",
    resize: "vertical",
    minHeight: "80px",
    lineHeight: 1.6,
    fontFamily: "inherit",
  },

  // Cards (for projects, skill groups)
  card: {
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
    marginBottom: "0.75rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  cardTitle: {
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#ccc",
  },

  // Buttons
  button: {
    padding: "0.5rem 0.9rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "#ccc",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "background 150ms",
  },
  buttonPrimary: {
    padding: "0.55rem 1rem",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: "0.82rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  buttonDanger: {
    padding: "0.45rem 0.7rem",
    borderRadius: "5px",
    border: "1px solid rgba(255,80,80,0.3)",
    background: "rgba(255,80,80,0.08)",
    color: "#ff7777",
    fontSize: "0.75rem",
    cursor: "pointer",
  },
  buttonSmall: {
    padding: "0.35rem 0.6rem",
    borderRadius: "5px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#aaa",
    fontSize: "0.75rem",
    cursor: "pointer",
  },

  // Inline group
  row: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-start",
  },
  flex1: {
    flex: 1,
  },

  // Status
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
    marginBottom: "1.5rem",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "0.82rem",
    color: "#888",
  },
};
