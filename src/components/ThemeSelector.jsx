import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

/**
 * World select.
 *
 * Each card is rendered in its own world's palette, so the choice is made by
 * looking rather than by reading the label — you can feel the difference
 * between the two before committing to one.
 */
const WORLD_PREVIEW = {
  naruto: {
    accent: "#e8b563",
    ember: "#c2410c",
    ink: "#0c0806",
    surface: "linear-gradient(168deg, rgba(40,23,14,0.92) 0%, rgba(14,9,6,0.96) 100%)",
    tags: ["Ink", "Ember", "Scroll"],
  },
  pop: {
    accent: "#6ff7ff",
    ember: "#ff2e88",
    ink: "#04050a",
    surface: "linear-gradient(180deg, rgba(11,17,28,0.94) 0%, rgba(4,7,12,0.97) 100%)",
    tags: ["CRT", "Arcade", "Pixel"],
  },
};

export default function ThemeSelector({
  themes,
  onSelect,
  isEnteringTheme,
  pendingThemeId,
}) {
  const [isReady, setIsReady] = useState(false);
  const [hovered, setHovered] = useState(null);
  const bufferRef = useRef("");

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 40);
    return () => window.clearTimeout(timer);
  }, []);

  // Secret "admin" keyword redirects to /admin
  useEffect(() => {
    const resetTimer = { current: null };

    const onKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (key.length !== 1 || !/[a-z]/.test(key)) return;

      bufferRef.current += key;
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        bufferRef.current = "";
      }, 1500);

      if (bufferRef.current.includes("admin")) {
        bufferRef.current = "";
        window.location.href = "/admin";
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(resetTimer.current);
    };
  }, []);

  const activeAccent =
    WORLD_PREVIEW[hovered ?? pendingThemeId]?.accent ?? "#8a7f6d";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05040a",
        color: "#f4efe4",
        padding: "clamp(1.25rem, 4vw, 3rem)",
        display: "grid",
        placeItems: "center",
        fontFamily: "'Oxanium', sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: rgba(232,181,99,0.34); }
        :focus-visible { outline: 2px solid ${activeAccent}; outline-offset: 4px; }
        .world-card {
          position: relative;
          display: grid;
          grid-template-rows: auto 1fr;
          text-align: left;
          padding: 0;
          overflow: hidden;
          color: inherit;
          border: 1px solid rgba(255,255,255,0.09);
          cursor: pointer;
          transition:
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 300ms ease,
            box-shadow 420ms ease;
        }
        .world-card:hover, .world-card:focus-visible {
          transform: translateY(-8px);
          box-shadow: 0 40px 70px -24px rgba(0,0,0,0.85);
        }
        .world-card .shot {
          transition: transform 720ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms ease;
        }
        .world-card:hover .shot, .world-card:focus-visible .shot {
          transform: scale(1.06);
          filter: saturate(1.05) brightness(1.04);
        }
        .world-card .enter { transition: gap 280ms cubic-bezier(0.22, 1, 0.36, 1); }
        .world-card:hover .enter { gap: 0.85rem; }
        @keyframes driftGlow {
          0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: 0.34; }
          50% { transform: translate3d(0,-18px,0) scale(1.06); opacity: 0.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 1ms !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>

      {/* Two coloured fields, one per world, so the background itself hints at
          the choice. They swell toward whichever card is under the cursor. */}
      {Object.entries(WORLD_PREVIEW).map(([id, world], index) => (
        <div
          key={id}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "min(64vw, 620px)",
            height: "min(64vw, 620px)",
            borderRadius: "50%",
            top: index === 0 ? "-16%" : "auto",
            bottom: index === 0 ? "auto" : "-20%",
            right: index === 0 ? "-10%" : "auto",
            left: index === 0 ? "auto" : "-12%",
            background: `radial-gradient(circle, ${world.ember}44 0%, ${world.accent}14 34%, transparent 70%)`,
            filter: "blur(14px)",
            animation: `driftGlow ${7 + index}s ease-in-out infinite`,
            opacity: hovered === null || hovered === id ? 1 : 0.35,
            transition: "opacity 420ms ease",
            pointerEvents: "none",
          }}
        />
      ))}

      <div
        style={{
          width: "min(1120px, 100%)",
          display: "grid",
          gap: "clamp(1.5rem, 4vw, 2.75rem)",
          position: "relative",
          zIndex: 1,
          opacity: isEnteringTheme ? 0 : 1,
          transform: isEnteringTheme ? "scale(0.97)" : "none",
          filter: isEnteringTheme ? "blur(4px)" : "none",
          transition:
            "opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1), filter 560ms ease",
        }}
      >
        <header
          style={{
            maxWidth: "44ch",
            opacity: isReady ? 1 : 0,
            transform: isReady ? "none" : "translateY(22px)",
            transition: "opacity 560ms ease, transform 620ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <h1
            style={{
              fontFamily: "'Teko', sans-serif",
              fontSize: "clamp(3rem, 10vw, 5.6rem)",
              lineHeight: 0.92,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              textWrap: "balance",
              marginBottom: "0.85rem",
            }}
          >
            Choose your world
          </h1>
          <p style={{ color: "#a99f8d", lineHeight: 1.7, fontSize: "1rem", maxWidth: "52ch" }}>
            The same work, two worlds. Pick one and run the character through it
            with <Kbd>W</Kbd> <Kbd>A</Kbd> <Kbd>S</Kbd> <Kbd>D</Kbd>.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
            gap: "clamp(0.9rem, 2vw, 1.5rem)",
          }}
        >
          {themes.map((theme, index) => {
            const world = WORLD_PREVIEW[theme.id] ?? WORLD_PREVIEW.naruto;
            const isPending = pendingThemeId === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                className="world-card"
                onClick={() => onSelect(theme.id)}
                onMouseEnter={() => setHovered(theme.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(theme.id)}
                onBlur={() => setHovered(null)}
                style={{
                  background: world.surface,
                  borderColor: isPending ? world.accent : undefined,
                  borderRadius: theme.id === "pop" ? 0 : "4px 26px 4px 26px",
                  opacity: isReady ? 1 : 0,
                  transform: isReady
                    ? isPending && isEnteringTheme
                      ? "translateY(-12px) scale(1.05)"
                      : "none"
                    : "translateY(26px)",
                  transitionDelay: `${index * 90}ms`,
                  pointerEvents: isEnteringTheme ? "none" : "auto",
                  boxShadow: "0 30px 60px -22px rgba(0,0,0,0.8)",
                }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <div
                    className="shot"
                    style={{
                      height: "clamp(200px, 30vw, 268px)",
                      backgroundImage: `url(${theme.selectorImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(180deg, ${world.ink}00 34%, ${world.ink}dd 100%)`,
                    }}
                  />
                  {/* Each world signs its own preview. */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "3px",
                      background: `linear-gradient(90deg, ${world.ember}, ${world.accent})`,
                    }}
                  />
                  {theme.id === "pop" && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "repeating-linear-gradient(180deg, rgba(0,0,0,0.3) 0 1px, rgba(255,255,255,0.02) 1px 3px)",
                        opacity: 0.45,
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    padding: "1.1rem 1.15rem 1.25rem",
                    display: "grid",
                    gap: "0.7rem",
                    alignContent: "start",
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        theme.id === "pop" ? "'VT323', monospace" : "'Teko', sans-serif",
                      fontSize: theme.id === "pop" ? "2rem" : "2.15rem",
                      lineHeight: 1,
                      textTransform: "uppercase",
                      letterSpacing: theme.id === "pop" ? "0.06em" : "0.01em",
                      color: "#f6f1e6",
                    }}
                  >
                    {theme.label}
                  </div>
                  <p style={{ color: "#a99f8d", lineHeight: 1.6, fontSize: "0.93rem" }}>
                    {theme.description}
                  </p>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {world.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "0.14rem 0.5rem",
                          fontSize: "0.68rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: world.accent,
                          border: `1px solid ${world.accent}3d`,
                          borderRadius: theme.id === "pop" ? 0 : "999px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    className="enter"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      marginTop: "0.2rem",
                      color: world.accent,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontSize: "0.74rem",
                    }}
                  >
                    Enter world
                    <Icon name="arrowRight" size={14} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <a
        href="/admin"
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          padding: "0.35rem 0.65rem",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "999px",
          color: "#4a4540",
          fontSize: "0.62rem",
          letterSpacing: "0.06em",
          textDecoration: "none",
          zIndex: 3,
        }}
      >
        for the boss only
      </a>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "#05040a",
          opacity: isEnteringTheme ? 1 : 0,
          transition: "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
}

function Kbd({ children }) {
  return (
    <kbd
      style={{
        display: "inline-block",
        minWidth: "1.5em",
        padding: "0.08em 0.35em",
        margin: "0 0.05em",
        border: "1px solid rgba(255,255,255,0.16)",
        borderBottomWidth: "2px",
        borderRadius: "4px",
        background: "rgba(255,255,255,0.05)",
        color: "#d9cfbb",
        fontSize: "0.82em",
        fontFamily: "inherit",
        textAlign: "center",
      }}
    >
      {children}
    </kbd>
  );
}
