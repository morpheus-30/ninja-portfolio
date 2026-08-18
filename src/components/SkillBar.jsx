import { useThemeTokens } from "../context/theme-context";

/**
 * One skill as a labelled meter.
 *
 * Naruto fills a continuous bar; Gameverse shows heart containers, which is how
 * a platformer reports capacity. Both are a row inside the panel, not a card.
 */
export default function SkillBar({ label, value, color }) {
  const { theme, C } = useThemeTokens();
  const isGameverse = theme.id === "pop";

  const heartUnits = Math.max(0, Math.min(10, Math.round(value / 10)));
  const full = Math.floor(heartUnits / 2);
  const half = heartUnits % 2 === 1;
  const empty = 5 - full - (half ? 1 : 0);
  const hearts = [
    ...Array.from({ length: full }, () => theme.assets.ui.heartFull),
    ...(half ? [theme.assets.ui.heartHalf] : []),
    ...Array.from({ length: empty }, () => theme.assets.ui.heartEmpty),
  ];

  return (
    <div className="meter-row">
      <div className="meter-head">
        <span className="meter-label">{label}</span>
        <span className="meter-value tnum">{value}%</span>
      </div>

      {isGameverse ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.24rem" }}>
          {hearts.map((sprite, index) => (
            <img
              key={`${label}-${index}`}
              src={sprite}
              alt=""
              aria-hidden="true"
              className="heart-pop"
              style={{
                animationDelay: `${180 + index * 70}ms`,
                width: "18px",
                height: "18px",
                objectFit: "contain",
                imageRendering: "pixelated",
                filter: `drop-shadow(0 2px 3px rgba(0,0,0,0.5)) drop-shadow(0 0 6px ${color}44)`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="meter-track">
          <div
            className="meter-fill"
            style={{
              width: `${value}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${color}, ${C.gold})`,
            }}
          />
        </div>
      )}
    </div>
  );
}
