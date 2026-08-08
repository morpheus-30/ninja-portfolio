import { useThemeTokens } from "../context/theme-context";

export default function StatCard({ label, value }) {
  const { theme, C, F, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <div
      className={isGameverse ? "gameverse-stat" : undefined}
      style={{
        padding: isGameverse
          ? isMobile
            ? "0.68rem 0.72rem 0.72rem"
            : "0.78rem 0.9rem 0.82rem"
          : "1rem 1.1rem",
        borderRadius: isGameverse ? "12px" : "12px 22px 12px 18px",
        border: UI.statCardBorder,
        background: UI.statCardBackground,
        boxShadow: isGameverse
          ? "inset 0 1px 0 rgba(255,240,214,0.12), 0 10px 22px rgba(0,0,0,0.16)"
          : "inset 0 0 0 1px rgba(239,197,108,0.07)",
      }}
    >
      <div
        className={isGameverse ? "gameverse-stat-label" : undefined}
        style={{
          color: isGameverse ? "#f0d39d" : C.gold,
          fontSize: isGameverse ? "0.66rem" : "0.72rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontFamily: isGameverse ? F.body : F.display,
        }}
      >
        {label}
      </div>
      <div
        className={isGameverse ? "gameverse-stat-value" : undefined}
        style={{
          color: C.text,
          fontSize: isGameverse ? "0.95rem" : "1rem",
          marginTop: "0.32rem",
          fontWeight: 600,
          lineHeight: 1.35,
        }}
      >
        {value}
      </div>
    </div>
  );
}
