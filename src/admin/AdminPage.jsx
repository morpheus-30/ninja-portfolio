import AdminGate from "./AdminGate";

/**
 * Placeholder admin page.
 * The CMS editor, content management, and publishing features
 * will be implemented in a future phase.
 */
export default function AdminPage() {
  return (
    <AdminGate>
      <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem", color: "#fff" }}>
          Welcome, morpheus-30
        </h2>
        <p style={{ color: "#888", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto" }}>
          The admin panel is authenticated and ready. Portfolio editor, content management,
          and CMS features will be built in the next phase.
        </p>
      </div>
    </AdminGate>
  );
}
