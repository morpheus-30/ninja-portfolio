import { useThemeTokens } from "../../context/theme-context";
import SectionShell from "../SectionShell";

export default function HomeSection({
  content,
  assets,
  activeTheme,
  isMobile,
  isCompactHero,
  isTightGameverseHero,
  heroPortraitMaxHeight,
  triggerTransition,
  isTightViewport,
}) {
  const { C } = useThemeTokens();
  const stacked = isMobile || isCompactHero;

  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isTightViewport}
      titleStyle={{
        fontSize: isMobile
          ? "clamp(2rem, 11vw, 3rem)"
          : isCompactHero
            ? "clamp(2.1rem, 4vw, 3.4rem)"
            : "clamp(2.4rem, 5vw, 4.6rem)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: stacked
            ? "minmax(0, 1fr)"
            : isTightGameverseHero
              ? "minmax(0, 1.4fr) minmax(150px, 0.4fr)"
              : "minmax(0, 1.35fr) minmax(220px, 0.62fr)",
          gap: isMobile ? "1.1rem" : isTightGameverseHero ? "1.1rem" : "2rem",
          alignItems: stacked ? "start" : "center",
        }}
      >
        <div style={{ maxWidth: isCompactHero ? "100%" : "62ch" }}>
          <p
            style={{
              fontSize: "clamp(1.05rem, 1.9vw, 1.32rem)",
              color: C.sand,
              lineHeight: 1.55,
              marginBottom: "0.9rem",
            }}
          >
            {content.intro}
          </p>
          {content.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              style={{
                color: C.muted,
                lineHeight: 1.8,
                fontSize: isMobile || isTightGameverseHero ? "0.93rem" : "0.98rem",
                marginBottom:
                  index === content.paragraphs.length - 1 ? "1.5rem" : "0.85rem",
              }}
            >
              {paragraph}
            </p>
          ))}
          <div
            className="rise-stagger"
            style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}
          >
            {content.ctas.map(([label, idx], index) => (
              <button
                key={label}
                type="button"
                onClick={() => triggerTransition(idx)}
                className={`cta ${index === 0 ? "is-primary" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {!stacked && (
          <figure
            style={{
              justifySelf: "center",
              width: isTightGameverseHero ? "min(100%, 180px)" : "min(100%, 260px)",
              aspectRatio: "4 / 5",
              maxHeight: `${heroPortraitMaxHeight}px`,
              overflow: "hidden",
              position: "relative",
              border: `1px solid ${C.line}`,
              borderRadius: activeTheme.id === "pop" ? 0 : "4px 28px 4px 28px",
              boxShadow:
                "0 26px 50px -16px rgba(0,0,0,0.7), 0 6px 14px -6px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={assets.heroProfile}
              alt={`${activeTheme.label} portrait`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                filter: "saturate(0.92) contrast(1.05)",
              }}
            />
            {/* Ties the portrait into the world instead of leaving it a
                rectangle pasted on top. */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  activeTheme.id === "pop"
                    ? "linear-gradient(180deg, rgba(111,247,255,0.08), rgba(4,6,11,0.42))"
                    : "linear-gradient(180deg, rgba(194,65,12,0.08), rgba(12,8,6,0.44))",
              }}
            />
          </figure>
        )}
      </div>
    </SectionShell>
  );
}
