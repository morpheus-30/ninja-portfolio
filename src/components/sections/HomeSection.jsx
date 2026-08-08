import { useThemeTokens } from "../../context/theme-context";
import SectionShell from "../SectionShell";

export default function HomeSection({
  content,
  assets,
  activeTheme,
  isMobile,
  isTightViewport,
  isCompactHero,
  isTightGameverseHero,
  heroPortraitMaxHeight,
  triggerTransition,
}) {
  const { theme, C, F, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";

  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isGameverse && isTightViewport}
      titleStyle={{
        fontSize: isMobile
          ? "clamp(1.9rem, 10vw, 2.8rem)"
          : isCompactHero
            ? "clamp(2rem, 3.8vw, 3.4rem)"
            : "clamp(2.2rem, 4.5vw, 4rem)",
        lineHeight: isMobile ? 1 : 0.98,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            isMobile || isCompactHero
              ? "minmax(0, 1fr)"
              : isTightGameverseHero
                ? "minmax(0, 1.35fr) minmax(160px, 0.45fr)"
                : "minmax(0, 1.3fr) minmax(240px, 0.7fr)",
          gap: isMobile
            ? "1rem"
            : isTightGameverseHero
              ? "0.9rem"
              : isCompactHero
                ? "1.25rem"
                : "1.6rem",
          alignItems: isMobile || isCompactHero ? "start" : "center",
        }}
      >
        <div
          style={{
            maxWidth: isCompactHero ? "100%" : "720px",
            padding: isGameverse
              ? isMobile
                ? "1.15rem 1.2rem 1.25rem"
                : isTightGameverseHero
                  ? "1.25rem 1.45rem 1.35rem"
                  : "1.8rem 2rem 1.9rem"
              : 0,
            borderRadius: isGameverse ? "12px" : 0,
            border: isGameverse
              ? "1px solid rgba(240, 214, 175, 0.22)"
              : "none",
            background: isGameverse
              ? "linear-gradient(180deg, rgba(22,17,13,0.44) 0%, rgba(10,7,6,0.58) 100%)"
              : "transparent",
            boxShadow: isGameverse
              ? "inset 0 1px 0 rgba(255,241,216,0.08), 0 10px 18px rgba(0,0,0,0.12)"
              : "none",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              color: C.sand,
              marginBottom: isGameverse ? "1.1rem" : "0.8rem",
              lineHeight: isTightGameverseHero ? 1.42 : 1.5,
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
                maxWidth: "640px",
                marginBottom:
                  index === content.paragraphs.length - 1
                    ? isGameverse
                      ? "1.65rem"
                      : "1.4rem"
                    : isGameverse
                      ? "1.12rem"
                      : "1rem",
                fontSize: isMobile ? "0.96rem" : "1rem",
                ...(isTightGameverseHero
                  ? { fontSize: "0.92rem", lineHeight: 1.62 }
                  : null),
              }}
            >
              {paragraph}
            </p>
          ))}
          <div
            style={{
              display: "flex",
              gap: isGameverse ? "0.9rem 1rem" : "0.8rem",
              flexWrap: "wrap",
            }}
          >
            {content.ctas.map(([label, idx]) => (
              <button
                key={label}
                onClick={() => triggerTransition(idx)}
                className={
                  isGameverse ? "gameverse-hud-button" : undefined
                }
                style={{
                  padding: "0.8rem 1.15rem",
                  borderRadius: "999px",
                  border: `1px solid ${C.gold}`,
                  background:
                    label === "View Missions"
                      ? `linear-gradient(90deg, ${C.ember}, ${C.sunset})`
                      : "transparent",
                  color: C.text,
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: F.display,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {!isMobile && (
          <div
            style={{
              justifySelf: "center",
              width: isCompactHero
                ? "min(100%, 220px)"
                : isTightGameverseHero
                  ? "min(100%, 190px)"
                  : "min(100%, 290px)",
              aspectRatio: "4 / 5",
              maxHeight: `${heroPortraitMaxHeight}px`,
              borderRadius: "28px",
              overflow: "hidden",
              border: `1px solid ${C.line}`,
              background: UI.mediaFrameBackground,
              boxShadow: "0 18px 50px rgba(0,0,0,0.3)",
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
                filter: "saturate(0.94) contrast(1.03)",
              }}
            />
          </div>
        )}
      </div>
    </SectionShell>
  );
}
