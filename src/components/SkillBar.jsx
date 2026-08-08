import { useThemeTokens } from "../context/theme-context";

export default function SkillBar({ label, value, color, compact = false }) {
  const { theme, C, F } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const totalHeartUnits = Math.max(0, Math.min(10, Math.round(value / 10)));
  const fullHearts = Math.floor(totalHeartUnits / 2);
  const hasHalfHeart = totalHeartUnits % 2 === 1;
  const emptyHearts = 5 - fullHearts - (hasHalfHeart ? 1 : 0);
  const heartSprites = [
    ...Array.from({ length: fullHearts }, () => theme.assets.ui.heartFull),
    ...(hasHalfHeart ? [theme.assets.ui.heartHalf] : []),
    ...Array.from({ length: emptyHearts }, () => theme.assets.ui.heartEmpty),
  ];

  return (
    <div
      style={{
        marginBottom: isGameverse ? (compact ? "0.38rem" : "0.65rem") : "1rem",
        padding: isGameverse
          ? isMobile
            ? "0.6rem 0.68rem"
            : compact
              ? "0.42rem 0.58rem"
              : "0.7rem 0.82rem"
          : 0,
        borderRadius: isGameverse ? "12px" : 0,
        border: isGameverse ? "1px solid rgba(232, 206, 166, 0.24)" : "none",
        background: isGameverse
          ? "linear-gradient(180deg, rgba(31,24,19,0.58) 0%, rgba(18,13,10,0.7) 100%)"
          : "transparent",
        boxShadow: isGameverse
          ? "inset 0 1px 0 rgba(255,240,214,0.1), 0 8px 18px rgba(0,0,0,0.12)"
          : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: compact ? "0.2rem" : "0.35rem",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span
          style={{
            color: isGameverse ? "#f6e7c3" : C.text,
            fontFamily: isGameverse ? F.body : undefined,
            letterSpacing: isGameverse ? "0.04em" : undefined,
            fontSize: isGameverse ? (compact ? "0.82rem" : "0.95rem") : undefined,
          }}
        >
          {label}
        </span>
        <span
          style={{
            color: isGameverse ? "#f3d18a" : C.gold,
            fontFamily: isGameverse ? F.body : undefined,
            fontSize: isGameverse ? (compact ? "0.8rem" : "0.92rem") : undefined,
            fontWeight: isGameverse ? 700 : undefined,
            letterSpacing: isGameverse ? "0.04em" : undefined,
            flex: "0 0 auto",
          }}
        >
          {value}%
        </span>
      </div>

      {isGameverse ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.26rem",
            minHeight: compact ? "17px" : "22px",
          }}
        >
          {heartSprites.map((sprite, index) => (
            <img
              key={`${label}-${index}`}
              src={sprite}
              alt=""
              aria-hidden="true"
              style={{
                width: compact ? "16px" : "20px",
                height: compact ? "16px" : "20px",
                objectFit: "contain",
                imageRendering: "pixelated",
                filter: `drop-shadow(0 0 6px ${color}33)`,
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            height: "8px",
            borderRadius: "2px",
            background: "rgba(0,0,0,0.3)",
            overflow: "hidden",
            border: "1px solid rgba(239,197,108,0.12)",
          }}
        >
          <div
            style={{
              width: `${value}%`,
              height: "100%",
              borderRadius: "1px",
              background: `linear-gradient(90deg, ${color}, ${C.gold})`,
              boxShadow: `0 0 18px ${color}55`,
            }}
          />
        </div>
      )}
    </div>
  );
}
