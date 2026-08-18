import { useEffect, useMemo, useRef, useState } from "react";
import { useThemeTokens } from "../context/theme-context";
import { useViewport } from "../hooks/useViewport";
import { useNavigation } from "../hooks/useNavigation";
import { useCharacterControls } from "../hooks/useCharacterControls";
import { buildGlobalStyles } from "../styles/globalStyles";
import ThreeScene from "./ThreeScene";
import SceneBackdrop from "./SceneBackdrop";
import NarutoWalker from "./NarutoWalker";
import HomeSection from "./sections/HomeSection";
import AboutSection from "./sections/AboutSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";

export default function PortfolioExperience({ activeTheme, onSwitchTheme }) {
  const { theme, C, F, MOTION, UI, W } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const { assets, content, sections } = activeTheme;
  const CONTROLS_CONTENT = content.controls;

  const { viewportWidth, viewportHeight, isMobile, isTightViewport } = useViewport();
  const [showCharacterHelp, setShowCharacterHelp] = useState(false);
  const [isThemeMounted, setIsThemeMounted] = useState(false);
  const pressedKeysRef = useRef(new Set());

  const isCompactHero = !isMobile && isGameverse && viewportWidth < 900;
  const isTightGameverseHero = isGameverse && isTightViewport && !isCompactHero;

  const {
    sectionIdx,
    displayIdx,
    spriteX,
    visible,
    characterAction,
    setCharacterAction,
    direction,
    triggerTransition,
    lockRef,
    spriteXRef,
  } = useNavigation({
    sections,
    MOTION,
    isMobile,
    pressedKeysRef,
  });

  useCharacterControls({
    activeTheme,
    sections,
    characterAction,
    setCharacterAction,
    triggerTransition,
    spriteXRef,
    pressedKeysRef,
    lockRef,
  });

  const gameverseCastleSilhouettes = useMemo(
    () =>
      isGameverse
        ? [
          {
            left: "-2%",
            width: isMobile ? "24%" : "14%",
            height: isMobile ? "76px" : "116px",
            bottom: isMobile ? "18px" : "24px",
            opacity: 0.22,
            blur: "1px",
            skew: "-5deg",
          },
          {
            left: isMobile ? "18%" : "16%",
            width: isMobile ? "18%" : "11%",
            height: isMobile ? "60px" : "92px",
            bottom: isMobile ? "28px" : "32px",
            opacity: 0.16,
            blur: "1px",
            skew: "4deg",
          },
          {
            left: isMobile ? "38%" : "37%",
            width: isMobile ? "22%" : "13%",
            height: isMobile ? "84px" : "124px",
            bottom: isMobile ? "16px" : "20px",
            opacity: 0.2,
            blur: "1px",
            skew: "-3deg",
          },
          {
            left: isMobile ? "60%" : "58%",
            width: isMobile ? "18%" : "10%",
            height: isMobile ? "64px" : "96px",
            bottom: isMobile ? "24px" : "30px",
            opacity: 0.17,
            blur: "1px",
            skew: "5deg",
          },
          {
            left: isMobile ? "74%" : "78%",
            width: isMobile ? "22%" : "12%",
            height: isMobile ? "72px" : "108px",
            bottom: isMobile ? "18px" : "24px",
            opacity: 0.19,
            blur: "1px",
            skew: "-4deg",
          },
        ]
        : [],
    [isGameverse, isMobile]
  );

  const heroPortraitMaxHeight = isMobile
    ? Math.min(Math.max(viewportHeight * 0.28, 180), 260)
    : isTightGameverseHero
      ? Math.min(Math.max(viewportHeight * 0.24, 160), 220)
      : isCompactHero
        ? Math.min(Math.max(viewportHeight * 0.34, 220), 300)
        : Math.min(Math.max(viewportHeight * 0.42, 240), 360);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsThemeMounted(true), 40);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={`t-${theme.id}`}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: UI.appBackground,
        fontFamily: F.body,
        color: C.text,
        opacity: isThemeMounted ? 1 : 0,
        transform: isThemeMounted ? "none" : "scale(1.025)",
        transition:
          "opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 760ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <style>{buildGlobalStyles({ assets, C, MOTION, UI, W })}</style>

      <SceneBackdrop sectionIndex={displayIdx} />
      {/* Top atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: UI.topAtmosphere,
        }}
      />
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.45,
          backgroundImage: UI.gridOverlay,
          backgroundSize: "84px 84px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.95), rgba(0,0,0,0.2))",
        }}
      />
      {/* Bottom atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: "45vh",
          background: UI.bottomAtmosphere,
          clipPath: isGameverse ? "none" : undefined,
        }}
      />

      <ThreeScene sectionIndex={displayIdx} />

      {/* Navigation bar */}
      <nav
        className={isGameverse ? "gameverse-nav" : undefined}
        style={{
          position: "fixed",
          top: isMobile ? "0.55rem" : "1.2rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile
            ? "calc(100vw - 0.75rem)"
            : "min(1120px, calc(100vw - 1.5rem))",
          zIndex: 30,
          padding: isMobile ? "0.55rem 0.6rem" : "0.75rem 1rem",
          borderRadius: isGameverse ? 0 : "999px",
          border: `1px solid ${C.line}`,
          background: UI.navBackground,
          backdropFilter: "blur(12px) saturate(115%)",
          boxShadow: "0 14px 30px -12px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "0.45rem" : "1rem",
        }}
      >
        <div
          style={{
            fontFamily: isGameverse
              ? "'VT323', 'PixelGame', monospace"
              : F.display,
            fontSize: isMobile ? "1.25rem" : "1.65rem",
            letterSpacing: isGameverse ? "0.18em" : "0.12em",
            color: isGameverse ? "#f2d48a" : C.gold,
            textTransform: isGameverse ? "uppercase" : undefined,
            textShadow: isGameverse
              ? "0 0 0.5px rgba(255,236,173,0.95), 0 0 8px rgba(233,199,116,0.18)"
              : undefined,
          }}
        >
          IAMNAKSH.TECH
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            flexWrap: isMobile ? "nowrap" : "wrap",
            justifyContent: isMobile ? "flex-start" : "flex-end",
            width: isMobile ? "100%" : "auto",
            overflowX: isMobile ? "auto" : "visible",
            paddingBottom: isMobile ? "0.1rem" : 0,
            scrollbarWidth: "none",
          }}
        >
          <button
            type="button"
            onClick={onSwitchTheme}
            className="nav-item"
            style={{
              border: `1px solid ${C.line}`,
              background: UI.themeButtonBackground,
              color: C.sand,
              borderRadius: isGameverse ? 0 : "999px",
              padding: isMobile ? "0.42rem 0.72rem" : "0.45rem 0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: isGameverse ? "'VT323', monospace" : F.display,
              fontSize: isGameverse ? "1.1rem" : isMobile ? "0.82rem" : "0.95rem",
              whiteSpace: "nowrap",
              flex: "0 0 auto",
            }}
          >
            {CONTROLS_CONTENT.switchTheme}
          </button>
          {sections.map((section, idx) => (
            <button
              key={section}
              type="button"
              onClick={() => triggerTransition(idx)}
              aria-current={idx === sectionIdx ? "page" : undefined}
              className={`nav-item ${idx === sectionIdx ? "is-active" : ""} ${
                isGameverse ? "gameverse-nav-button" : ""
              }`}
              style={{
                border: "1px solid transparent",
                borderRadius: isGameverse ? 0 : "999px",
                background: "transparent",
                color: idx === sectionIdx ? C.text : C.muted,
                padding: isMobile ? "0.42rem 0.72rem" : "0.45rem 0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontFamily: isGameverse ? "'VT323', monospace" : F.display,
                fontSize: isGameverse ? "1.1rem" : isMobile ? "0.82rem" : "0.95rem",
                whiteSpace: "nowrap",
              }}
            >
              <span className={isGameverse ? "gameverse-nav-label" : undefined}>
                {section}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main
        data-scrollable={
          isMobile || isTightViewport ? "" : undefined
        }
        style={{
          position: "relative",
          zIndex: 20,
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: isMobile || isTightViewport
            ? "start center"
            : "center",
          padding: isMobile
            ? "5.85rem 0.6rem 1.2rem"
            : isTightViewport
              ? "6.2rem 0.9rem 1.4rem"
              : "5.8rem 0.9rem 8.8rem",
          opacity: visible ? 1 : 0,
          // Exit fade only — the entrance is owned by the keyed
          // .section-enter-* animation below so it can be directional.
          transition: "opacity 260ms ease",
          overflowY: isMobile || isTightViewport
            ? "auto"
            : "hidden",
          overflowX: "hidden",
          WebkitOverflowScrolling:
            isMobile || isTightViewport ? "touch" : "auto",
        }}
      >
        <div
          key={displayIdx}
          className={
            direction === "left" ? "section-enter-left" : "section-enter-right"
          }
          style={{ width: "100%", display: "grid", placeItems: "inherit" }}
        >
        {displayIdx === 0 && (
          <HomeSection
            content={content.home}
            assets={assets}
            activeTheme={activeTheme}
            isMobile={isMobile}
            isTightViewport={isTightViewport}
            isCompactHero={isCompactHero}
            isTightGameverseHero={isTightGameverseHero}
            heroPortraitMaxHeight={heroPortraitMaxHeight}
            triggerTransition={triggerTransition}
          />
        )}
        {displayIdx === 1 && (
          <AboutSection
            content={content.about}
            isMobile={isMobile}
            isTightViewport={isTightViewport}
          />
        )}
        {displayIdx === 2 && (
          <SkillsSection
            content={content.skills}
            isMobile={isMobile}
            isTightViewport={isTightViewport}
          />
        )}
        {displayIdx === 3 && (
          <ProjectsSection
            content={content.projects}
            isMobile={isMobile}
            isTightViewport={isTightViewport}
          />
        )}
        {displayIdx === 4 && (
          <ContactSection
            content={content.contact}
            isMobile={isMobile}
            isTightViewport={isTightViewport}
          />
        )}
        </div>
      </main>

      {/* Character runner bar (desktop only) */}
      {!isMobile && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            height: "138px",
            zIndex: 25,
            pointerEvents: "none",
          }}
        >
          {isGameverse && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
              }}
            >
              {gameverseCastleSilhouettes.map((silhouette, index) => (
                <div
                  key={`${silhouette.left}-${index}`}
                  style={{
                    position: "absolute",
                    left: silhouette.left,
                    bottom: silhouette.bottom,
                    width: silhouette.width,
                    height: silhouette.height,
                    opacity: silhouette.opacity,
                    filter: `grayscale(1) blur(${silhouette.blur})`,
                    transform: `skewX(${silhouette.skew})`,
                    transformOrigin: "bottom center",
                    background:
                      "linear-gradient(180deg, rgba(176,171,162,0.68) 0%, rgba(122,118,110,0.8) 42%, rgba(68,65,60,0.92) 100%)",
                    clipPath:
                      "polygon(0 100%, 0 56%, 10% 56%, 10% 22%, 18% 22%, 18% 52%, 30% 52%, 30% 12%, 39% 12%, 39% 47%, 51% 47%, 51% 30%, 61% 30%, 61% 56%, 73% 56%, 73% 18%, 82% 18%, 82% 52%, 92% 52%, 92% 36%, 100% 36%, 100% 100%)",
                    boxShadow:
                      "0 10px 18px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "14% 8% 0",
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,0) 0 6%, rgba(58,55,51,0.48) 6% 10%, rgba(0,0,0,0) 10% 22%, rgba(58,55,51,0.4) 22% 26%, rgba(0,0,0,0) 26% 42%, rgba(58,55,51,0.46) 42% 46%, rgba(0,0,0,0) 46% 64%, rgba(58,55,51,0.38) 64% 68%, rgba(0,0,0,0) 68% 100%)",
                      mixBlendMode: "multiply",
                    }}
                  />
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: "12px",
                  height: "48px",
                  background:
                    "linear-gradient(180deg, rgba(84,80,73,0) 0%, rgba(84,80,73,0.12) 30%, rgba(48,45,40,0.24) 100%)",
                  filter: "blur(8px)",
                  opacity: 0.72,
                }}
              />
            </div>
          )}
          {/* Ground glow line — flares on arrival */}
          <div
            key={`ground-${displayIdx}`}
            className="ground-pulse"
            style={{
              position: "absolute",
              inset: isMobile ? "auto 0 12px 0" : "auto 0 18px 0",
              height: isMobile ? "16px" : "22px",
              background: UI.groundGlow,
              boxShadow: "0 0 28px rgba(216,90,26,0.2)",
            }}
          />
          {/* Character sprite */}
          <div
            onMouseEnter={() => setShowCharacterHelp(true)}
            onMouseLeave={() => setShowCharacterHelp(false)}
            style={{
              position: "absolute",
              left: `${spriteX}%`,
              bottom: isMobile ? "8px" : "12px",
              transform: "translateX(-50%)",
              transition: `left ${MOTION.runDurationMs}ms cubic-bezier(0.2, 0.9, 0.3, 1)`,
              pointerEvents: "auto",
            }}
          >
            {/* Help tooltip */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: isMobile ? "108px" : "168px",
                transform: showCharacterHelp
                  ? "translate(-50%, 0)"
                  : "translate(-50%, 8px)",
                opacity: showCharacterHelp ? 1 : 0,
                transition: "opacity 180ms ease, transform 180ms ease",
                padding: "0.65rem 0.85rem",
                borderRadius: "14px 20px 14px 18px",
                border: `1px solid ${C.line}`,
                background: UI.helpTooltipBackground,
                boxShadow: "0 16px 40px rgba(0,0,0,0.32)",
                color: C.sand,
                whiteSpace: "nowrap",
                fontSize: "0.82rem",
                lineHeight: 1.5,
                pointerEvents: "none",
              }}
            >
              <div style={{ fontFamily: F.display, color: C.gold }}>
                {CONTROLS_CONTENT.helpTitle}
              </div>
              <div>{CONTROLS_CONTENT.helpText}</div>
            </div>
            {/* Character shadow */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: isMobile ? "4px" : "6px",
                width: isMobile ? "78px" : "110px",
                height: isMobile ? "18px" : "28px",
                // The shadow answers to the sprite: it tightens and fades as
                // the character leaves the ground, and spreads when crouching.
                transform: `translateX(-50%) scale(${
                  characterAction === "jump"
                    ? 0.58
                    : characterAction === "crouch" ||
                        characterAction === "crouchWalk"
                      ? 1.16
                      : 1
                })`,
                opacity: characterAction === "jump" ? 0.45 : 1,
                transition:
                  "transform 240ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease",
                background:
                  "radial-gradient(ellipse, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0) 72%)",
              }}
            />
            <NarutoWalker
              action={characterAction}
              direction={direction}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
