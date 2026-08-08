import { useMemo } from "react";
import { useThemeTokens } from "../context/theme-context";

export default function SectionShell({
  title,
  kicker,
  children,
  isMobile,
  isTightViewport,
  titleStyle,
}) {
  const { theme, C, F, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const mobileGameverseShellPadding = "0.72rem 0.68rem 0.82rem";
  const mobileGameverseContentPaddingX = "1rem";
  const mobileGameverseContentPaddingTop = "0.42rem";
  const mobileGameverseContentPaddingBottom = "0.2rem";
  const gameverseClip =
    "polygon(var(--gv-cut) 0, calc(100% - var(--gv-cut)) 0, 100% var(--gv-cut), 100% calc(100% - var(--gv-cut)), calc(100% - var(--gv-cut)) 100%, var(--gv-cut) 100%, 0 calc(100% - var(--gv-cut)), 0 var(--gv-cut))";
  const gameverseContentInset = isMobile ? "6px" : "8px";
  const gameverseFrameSprite = {
    position: "absolute",
    pointerEvents: "none",
    imageRendering: "pixelated",
    filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.22))",
    opacity: 0.96,
  };
  const randomBottomStones = useMemo(
    () =>
      Array.from({ length: isMobile ? 5 : 8 }, (_, index) => ({
        id: index,
        left: 8 + Math.random() * 84,
        bottom: Math.random() * (isMobile ? 4 : 6),
        width: isMobile ? 22 + Math.random() * 8 : 42 + Math.random() * 18,
        flip: Math.random() > 0.5,
        opacity: 0.82 + Math.random() * 0.16,
      })),
    [isMobile]
  );

  return (
    <section
      className={isGameverse ? "gameverse-card gameverse-boot" : undefined}
      style={{
        "--gv-cut": isMobile ? "18px" : "26px",
        width: isMobile
          ? "calc(100vw - 1.5rem)"
          : "min(1120px, calc(100vw - 2.5rem))",
        minHeight: isMobile
          ? "calc(100vh - 7.5rem)"
          : isTightViewport
            ? "auto"
            : "min(70vh, 760px)",
        maxHeight: isMobile
          ? "calc(100vh - 7.5rem)"
          : isTightViewport
            ? "none"
            : "none",
        padding: isMobile
          ? isGameverse
            ? mobileGameverseShellPadding
            : "1rem"
          : isGameverse
            ? "clamp(2.25rem, 3vw, 3.15rem)"
            : "clamp(1.6rem, 2vw, 2.2rem)",
        border: UI.sectionBorder,
        borderRadius: isGameverse
          ? "0"
          : isMobile
            ? "14px 24px 14px 24px"
            : "18px 42px 18px 42px",
        background: UI.sectionBackground,
        boxShadow: UI.sectionShadow,
        display: "grid",
        alignItems: (isMobile || isTightViewport) && isGameverse
          ? "stretch"
          : "center",
        position: "relative",
        overflowX: "hidden",
        overflowY: isMobile || isTightViewport ? "auto" : "hidden",
        WebkitOverflowScrolling: isMobile || isTightViewport ? "touch" : "auto",
        overscrollBehavior: isMobile || isTightViewport ? "contain" : "auto",
        touchAction: isMobile || isTightViewport ? "pan-y" : "auto",
        clipPath: isGameverse
          ? gameverseClip
          : isMobile
            ? "polygon(0 12px, 12px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 14px 100%, 0 calc(100% - 14px))"
            : "polygon(0 18px, 18px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      {/* Shine overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isGameverse
            ? "linear-gradient(180deg, rgba(255,240,214,0.08) 0%, rgba(255,240,214,0.02) 18%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 74%, rgba(255,255,255,0.04) 100%)",
          opacity: isGameverse ? 0.9 : 0.55,
          pointerEvents: "none",
        }}
      />
      {/* Top-right corner accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: isMobile ? "96px" : "180px",
          height: isMobile ? "96px" : "180px",
          background: isGameverse
            ? "linear-gradient(135deg, rgba(231,197,146,0) 0%, rgba(231,197,146,0.14) 48%, rgba(231,197,146,0) 48%)"
            : `linear-gradient(135deg, ${C.ember}00 0%, ${C.ember}22 48%, ${C.ember}00 48%)`,
          pointerEvents: "none",
          opacity: isGameverse ? 0.75 : 0.95,
        }}
      />
      {/* Bottom-left corner accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: isMobile ? "110px" : "220px",
          height: isMobile ? "110px" : "220px",
          background: isGameverse
            ? "linear-gradient(315deg, rgba(108,71,39,0) 0%, rgba(108,71,39,0.18) 42%, rgba(108,71,39,0) 42%)"
            : `linear-gradient(315deg, ${C.gold}00 0%, ${C.gold}14 42%, ${C.gold}00 42%)`,
          pointerEvents: "none",
          opacity: isGameverse ? 0.8 : 0.9,
        }}
      />
      {/* Bottom-right line accent */}
      <div
        style={{
          position: "absolute",
          inset: isMobile ? "auto 10px 10px auto" : "auto 14px 14px auto",
          width: isMobile ? "68px" : "108px",
          height: "1px",
          background: isGameverse
            ? "linear-gradient(90deg, transparent, rgba(211,181,134,0.9))"
            : `linear-gradient(90deg, transparent, ${C.gold})`,
          opacity: isGameverse ? 0.5 : 0.72,
          pointerEvents: "none",
        }}
      />
      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: "14px",
          background: UI.sectionTopBar,
        }}
      />
      {/* Gameverse bottom stones */}
      {isGameverse && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: isMobile ? "44px" : "72px",
            pointerEvents: "none",
          }}
        >
          {randomBottomStones.map((stone) => (
            <img
              key={stone.id}
              src={theme.assets.ui.stoneSprite}
              alt=""
              style={{
                ...gameverseFrameSprite,
                left: `${stone.left}%`,
                bottom: `${stone.bottom}px`,
                width: `${stone.width}px`,
                transform: stone.flip
                  ? "translateX(-50%) scaleX(-1)"
                  : "translateX(-50%) scaleX(1)",
                opacity: stone.opacity,
              }}
            />
          ))}
        </div>
      )}
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isGameverse
            ? "linear-gradient(135deg, rgba(255,242,214,0.05) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isGameverse ? 0.06 : 0.08,
          backgroundImage: UI.sectionGrid,
          backgroundSize: isGameverse ? "100% 100%, 44px 44px" : "34px 34px",
          pointerEvents: "none",
        }}
      />
      {/* Naruto decorative lines (top-right) */}
      {!isGameverse && (
        <div
          style={{
            position: "absolute",
            top: isMobile ? "1rem" : "1.3rem",
            right: isMobile ? "0.9rem" : "1.4rem",
            display: "grid",
            gap: isMobile ? "0.32rem" : "0.42rem",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: isMobile ? "28px" : "42px",
                height: "2px",
                background:
                  index === 1
                    ? `linear-gradient(90deg, ${C.gold}, ${C.ember})`
                    : C.line,
              }}
            />
          ))}
        </div>
      )}
      {/* Content wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: (isMobile || isTightViewport) && isGameverse
            ? "100%"
            : "auto",
          overflow: "visible",
          paddingRight: isMobile
            ? isGameverse
              ? mobileGameverseContentPaddingX
              : "0.2rem"
            : isGameverse
              ? "0.9rem"
              : 0,
          paddingTop: isMobile
            ? isGameverse
              ? mobileGameverseContentPaddingTop
              : "0.15rem"
            : isGameverse
              ? "0.8rem"
              : "0.2rem",
          paddingBottom:
            isGameverse
              ? isMobile
                ? mobileGameverseContentPaddingBottom
                : "0.9rem"
              : 0,
          paddingLeft:
            isGameverse
              ? isMobile
                ? mobileGameverseContentPaddingX
                : "0.9rem"
              : 0,
        }}
      >
        {/* Gameverse content background layers */}
        {isGameverse && (
          <div
            style={{
              position: "absolute",
              inset: gameverseContentInset,
              clipPath: gameverseClip,
              background:
                "linear-gradient(180deg, rgba(152,108,63,0.46) 0%, rgba(112,74,40,0.5) 46%, rgba(85,53,29,0.56) 100%)",
              boxShadow:
                "inset 0 2px 0 rgba(255,233,188,0.16), inset 0 -3px 0 rgba(59,32,13,0.36)",
              opacity: 0.72,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
        {isGameverse && (
          <div
            style={{
              position: "absolute",
              inset: gameverseContentInset,
              clipPath: gameverseClip,
              background:
                "linear-gradient(180deg, rgba(255,221,165,0.07) 0 2%, rgba(0,0,0,0) 2% 24%, rgba(68,42,20,0.18) 24% 26%, rgba(0,0,0,0) 26% 48%, rgba(68,42,20,0.18) 48% 50%, rgba(0,0,0,0) 50% 72%, rgba(68,42,20,0.18) 72% 74%, rgba(0,0,0,0) 74% 100%), linear-gradient(90deg, rgba(247,221,168,0.05), rgba(95,58,29,0.12) 28%, rgba(247,221,168,0.03) 54%, rgba(95,58,29,0.12) 78%, rgba(247,221,168,0.05))",
              opacity: 0.46,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}
        {isGameverse && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "none",
              backgroundImage: `url(${theme.assets.ui.stoneTile})`,
              backgroundRepeat: "repeat",
              backgroundSize: isMobile ? "280px 280px" : "340px 340px",
              backgroundPosition: "center top",
              filter: "saturate(0.9) brightness(0.68)",
              opacity: 0.2,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        )}
        {isGameverse && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "4px solid rgba(86, 71, 56, 0.96)",
              borderRadius: 0,
              clipPath: gameverseClip,
              boxShadow:
                "inset 0 0 0 2px rgba(58,45,33,0.95), inset 0 0 0 8px rgba(191,168,125,0.12)",
              opacity: 1,
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        )}
        {/* Main content */}
        <div style={{ position: "relative", zIndex: 4 }}>
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              color: C.gold,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontSize: "0.74rem",
              marginBottom: "0.7rem",
              fontFamily: F.display,
            }}
          >
            <span
              style={{
                width: isMobile ? "24px" : "34px",
                height: "2px",
                background: `linear-gradient(90deg, ${C.ember}, ${C.gold})`,
                display: "inline-block",
                flex: "0 0 auto",
              }}
            />
            {kicker}
          </p>
          <h2
            style={{
              fontFamily: F.display,
              fontSize: isMobile
                ? "clamp(1.9rem, 11vw, 3rem)"
                : "clamp(2.4rem, 5vw, 4.8rem)",
              lineHeight: isMobile ? 1 : 0.95,
              color: C.text,
              marginBottom: isMobile ? "0.9rem" : "1.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              textShadow: `0 0 24px ${C.ember}22`,
              ...titleStyle,
            }}
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}
