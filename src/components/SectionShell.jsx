import { useMemo } from "react";
import { useThemeTokens } from "../context/theme-context";

/**
 * The panel every section sits in.
 *
 * `kicker` is deliberately not rendered above the heading. In Naruto it runs
 * down the left margin as an annotation; in Gameverse it becomes the cabinet's
 * HUD title bar. Both give the label a structural job instead of stacking a
 * second, smaller heading on top of the real one.
 */
export default function SectionShell({
  title,
  kicker,
  children,
  isMobile,
  isTightViewport,
  titleStyle,
  contentFills = false,
}) {
  const { theme, C, F, UI, W } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const scrolls = isMobile || isTightViewport;

  // In-game props scattered along the cabinet floor. Seeded per breakpoint so
  // they do not jump on every render.
  const groundProps = useMemo(
    () =>
      isGameverse
        ? Array.from({ length: isMobile ? 4 : 7 }, (_, index) => ({
            id: index,
            left: 6 + Math.random() * 86,
            bottom: Math.random() * (isMobile ? 4 : 6),
            width: isMobile ? 20 + Math.random() * 8 : 36 + Math.random() * 16,
            flip: Math.random() > 0.5,
            opacity: 0.7 + Math.random() * 0.24,
          }))
        : [],
    [isGameverse, isMobile]
  );

  return (
    <section
      className="panel"
      data-scrollable={scrolls ? "" : undefined}
      style={{
        "--gv-cut": isMobile ? "14px" : "22px",
        width: isMobile
          ? "calc(100vw - 1.5rem)"
          : "min(1120px, calc(100vw - 2.5rem))",
        minHeight: isMobile
          ? "calc(100vh - 7.5rem)"
          : isTightViewport
            ? "auto"
            : "min(70vh, 760px)",
        maxHeight: isMobile ? "calc(100vh - 7.5rem)" : "none",
        padding: isMobile
          ? `1.05rem 1rem 1.15rem ${isGameverse ? "1rem" : "2.4rem"}`
          : `clamp(1.7rem, 2.4vw, 2.4rem) clamp(1.7rem, 2.4vw, 2.4rem) clamp(1.7rem, 2.4vw, 2.4rem) ${
              isGameverse ? "clamp(1.7rem, 2.4vw, 2.4rem)" : "3.3rem"
            }`,
        border: UI.sectionBorder,
        borderRadius: isGameverse ? 0 : isMobile ? "4px 16px 4px 16px" : "6px 26px 6px 26px",
        background: UI.sectionBackground,
        boxShadow: UI.sectionShadow,
        display: "grid",
        gridTemplateRows: isGameverse ? "auto auto 1fr" : "auto 1fr",
        gap: isMobile ? "0.7rem" : "0.9rem",
        alignContent: "start",
        position: "relative",
        overflowX: "hidden",
        overflowY: scrolls ? "auto" : "hidden",
        WebkitOverflowScrolling: scrolls ? "touch" : "auto",
        overscrollBehavior: scrolls ? "contain" : "auto",
        touchAction: scrolls ? "pan-y" : "auto",
        clipPath: W.panelClip,
      }}
    >
      {/* World texture: paper fibre and ink bleed, or dither, phosphor stripe
          and scanlines. Order matters — grain under content, scanlines over. */}
      <div className="panel-layer panel-bleed" aria-hidden="true" />
      <div className="panel-layer panel-grain" aria-hidden="true" />
      <div className="panel-layer panel-fibre" aria-hidden="true" />
      {isGameverse && (
        <div className="panel-layer panel-scanline" aria-hidden="true" />
      )}
      {!isGameverse && <div className="panel-seal" aria-hidden="true" />}

      {/* Top bar */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: isGameverse ? "3px" : "2px",
          background: UI.sectionTopBar,
          zIndex: 4,
        }}
      />

      {/* Naruto: the section name as a margin annotation. */}
      {!isGameverse && (
        <div className="panel-rail" aria-hidden="true">
          <span>{kicker}</span>
        </div>
      )}

      {/* Gameverse: in-game props along the cabinet floor. */}
      {isGameverse && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: isMobile ? "40px" : "62px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${theme.assets.ui.stoneTile})`,
              backgroundSize: isMobile ? "180px" : "220px",
              backgroundRepeat: "repeat",
              imageRendering: "pixelated",
              filter: "saturate(0.45) brightness(0.42)",
              opacity: 0.5,
              maskImage: "linear-gradient(180deg, transparent, #000 70%)",
              WebkitMaskImage: "linear-gradient(180deg, transparent, #000 70%)",
            }}
          />
          {groundProps.map((prop) => (
            <img
              key={prop.id}
              src={theme.assets.ui.stoneSprite}
              alt=""
              style={{
                position: "absolute",
                left: `${prop.left}%`,
                bottom: `${prop.bottom}px`,
                width: `${prop.width}px`,
                opacity: prop.opacity,
                imageRendering: "pixelated",
                transform: prop.flip
                  ? "translateX(-50%) scaleX(-1)"
                  : "translateX(-50%)",
                filter: "saturate(0.6) brightness(0.7) drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
              }}
            />
          ))}
        </div>
      )}

      {/* Gameverse: HUD title bar carries the label instead of an eyebrow. */}
      {isGameverse && (
        <div className="hud-bar" style={{ position: "relative", zIndex: 6 }}>
          <span className="hud-dot" aria-hidden="true" />
          <span>{kicker}</span>
          <span className="hud-fill" aria-hidden="true" />
        </div>
      )}

      <header style={{ position: "relative", zIndex: 6, display: "grid", gap: "0.5rem" }}>
        <h2
          className="display-title"
          style={{
            fontFamily: F.display,
            fontSize: isMobile
              ? "clamp(1.9rem, 10vw, 2.9rem)"
              : "clamp(2.3rem, 4.6vw, 4.2rem)",
            lineHeight: isMobile ? 1 : 0.95,
            textTransform: "uppercase",
            color: C.text,
            ...titleStyle,
          }}
        >
          {title}
        </h2>
        <div
          className="title-rule"
          aria-hidden="true"
          style={{ width: isMobile ? "62%" : "42%" }}
        />
      </header>

      <div
        style={{
          position: "relative",
          zIndex: 6,
          minHeight: 0,
          display: contentFills ? "grid" : "block",
        }}
      >
        {children}
      </div>
    </section>
  );
}
