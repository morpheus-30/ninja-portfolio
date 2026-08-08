import { useThemeTokens } from "../context/theme-context";

export default function MissionCard({ rank, title, desc, tags, link }) {
  const { theme, C, F, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <article
      style={{
        padding: isGameverse
          ? isMobile
            ? "0.8rem 0.82rem"
            : "1rem 1.02rem"
          : "1.2rem",
        borderRadius: isGameverse ? "12px" : "14px 26px 14px 22px",
        border: isGameverse
          ? "1px solid rgba(240, 214, 175, 0.22)"
          : UI.missionCardBorder,
        background: isGameverse
          ? "linear-gradient(180deg, rgba(22,17,13,0.42) 0%, rgba(10,7,6,0.56) 100%)"
          : UI.missionCardBackground,
        boxShadow: isGameverse
          ? "inset 0 1px 0 rgba(255,241,216,0.08), 0 10px 18px rgba(0,0,0,0.14)"
          : "inset 0 0 0 1px rgba(239,197,108,0.06)",
      }}
    >
      <div
        style={{
          color: isGameverse ? "#f3d18a" : C.gold,
          marginBottom: "0.48rem",
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          fontFamily: F.display,
          fontSize: isGameverse ? "1rem" : undefined,
        }}
      >
        Rank {rank}
      </div>
      <h3
        style={{
          fontSize: isGameverse ? "1.8rem" : "1.2rem",
          marginBottom: "0.42rem",
          fontFamily: isGameverse ? F.display : undefined,
          letterSpacing: isGameverse ? "0.03em" : undefined,
        }}
      >
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className={
              isGameverse
                ? "gameverse-project-title-link"
                : "project-title-link"
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.42rem",
              color: C.text,
              textDecoration: "none",
              transition: "color 140ms ease, text-shadow 140ms ease",
            }}
          >
            <span>{title}</span>
            <span
              aria-hidden="true"
              style={{
                color: isGameverse ? C.gold : C.sand,
                fontSize: isGameverse ? "0.42em" : "0.4em",
                lineHeight: 1,
              }}
            >
            </span>
            ↗
          </a>
        ) : (
          <span style={{ color: C.text }}>{title}</span>
        )}
      </h3>
      <p
        style={{
          color: isGameverse ? "#f0e2c4" : C.muted,
          lineHeight: 1.7,
          marginBottom: "0.82rem",
          fontSize: isGameverse ? "0.96rem" : undefined,
        }}
      >
        {desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: isGameverse ? "0.24rem 0.52rem" : "0.28rem 0.55rem",
              borderRadius: isGameverse ? "10px" : "999px",
              background: isGameverse
                ? "linear-gradient(180deg, rgba(86,57,33,0.68) 0%, rgba(57,37,21,0.8) 100%)"
                : UI.pillBackground,
              border: isGameverse
                ? "1px solid rgba(240, 214, 175, 0.18)"
                : `1px solid ${C.line}`,
              color: isGameverse ? "#f7e3b2" : C.sand,
              fontSize: isGameverse ? "0.72rem" : "0.78rem",
              boxShadow: isGameverse
                ? "inset 0 1px 0 rgba(247,227,178,0.06)"
                : "none",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
