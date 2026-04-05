import { useEffect, useState } from "react";

export default function ThemeSelector({
  themes,
  onSelect,
  isEnteringTheme,
  pendingThemeId,
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 40);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#f6ecd4",
        padding: "clamp(1rem, 3vw, 2.5rem)",
        display: "grid",
        placeItems: "center",
        fontFamily: "'Oxanium', sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700&family=Teko:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes selectorFloat {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -10px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes selectorPulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.46; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          width: "min(60vw, 520px)",
          height: "min(60vw, 520px)",
          borderRadius: "50%",
          top: "-10%",
          right: "-8%",
          background:
            "radial-gradient(circle, rgba(239,197,108,0.22) 0%, rgba(216,90,26,0.08) 35%, rgba(216,90,26,0) 72%)",
          filter: "blur(8px)",
          animation: "selectorPulse 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "min(42vw, 360px)",
          height: "min(42vw, 360px)",
          borderRadius: "50%",
          bottom: "-12%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(216,90,26,0.18) 0%, rgba(216,90,26,0) 70%)",
          filter: "blur(10px)",
          animation: "selectorPulse 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "min(1080px, 100%)",
          display: "grid",
          gap: "1.5rem",
          position: "relative",
          zIndex: 1,
          opacity: isEnteringTheme ? 0 : 1,
          transform: isEnteringTheme ? "scale(0.965)" : "scale(1)",
          filter: isEnteringTheme ? "blur(3px)" : "blur(0px)",
          transition:
            "opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1), filter 560ms ease",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            opacity: isReady ? 1 : 0,
            transform: isReady ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 520ms ease, transform 520ms ease",
          }}
        >
          <div
            style={{
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#efc56c",
              fontSize: "0.76rem",
              marginBottom: "0.9rem",
            }}
          >
            Theme Selector
          </div>
          <h1
            style={{
              fontFamily: "'Teko', sans-serif",
              fontSize: "clamp(2.8rem, 9vw, 5.4rem)",
              lineHeight: 0.95,
              textTransform: "uppercase",
              marginBottom: "0.8rem",
            }}
          >
            Choose Your World
          </h1>
          <p style={{ color: "#cfbf9b", lineHeight: 1.7, fontSize: "1rem" }}>
            Themes now live as isolated data and asset bundles, so adding more
            universes later is just a matter of dropping in a new theme module.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 340px))",
            gap: "1.25rem",
            alignItems: "stretch",
          }}
        >
          {themes.map((theme, index) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              style={{
                border:
                  pendingThemeId === theme.id
                    ? "1px solid rgba(239,197,108,0.48)"
                    : "1px solid rgba(239,197,108,0.22)",
                borderRadius: "22px 36px 22px 28px",
                background:
                  "linear-gradient(180deg, rgba(58,29,18,0.92) 0%, rgba(22,12,9,0.96) 100%)",
                overflow: "hidden",
                color: "inherit",
                textAlign: "left",
                cursor: "pointer",
                padding: 0,
                minHeight: "100%",
                opacity: isReady ? 1 : 0,
                transform: isReady
                  ? pendingThemeId === theme.id && isEnteringTheme
                    ? "translateY(-14px) scale(1.08)"
                    : "translateY(0) scale(1)"
                  : "translateY(28px) scale(0.98)",
                transition: `opacity 540ms ease ${index * 90}ms, transform 720ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 90}ms, border-color 220ms ease, box-shadow 220ms ease`,
                animation: "selectorFloat 7s ease-in-out infinite",
                animationDelay: `${index * 180}ms`,
                pointerEvents: isEnteringTheme ? "none" : "auto",
                boxShadow:
                  pendingThemeId === theme.id
                    ? "0 30px 72px rgba(0,0,0,0.38), 0 0 0 1px rgba(239,197,108,0.12) inset"
                    : "0 26px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  height: "clamp(220px, 36vw, 300px)",
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.45)), url(${theme.selectorImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform:
                    pendingThemeId === theme.id && isEnteringTheme
                      ? "scale(1.14)"
                      : "scale(1)",
                  transition:
                    "transform 760ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
              <div
                style={{
                  padding: "1rem 1rem 1.2rem",
                  display: "grid",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Teko', sans-serif",
                    fontSize: "clamp(1.9rem, 6vw, 2.3rem)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {theme.label}
                </div>
                <div
                  style={{
                    color: "#cfbf9b",
                    lineHeight: 1.6,
                    fontSize: "0.96rem",
                  }}
                >
                  {theme.description}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 0.9rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(239,197,108,0.35)",
                    color: "#f3ddaf",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontSize: "0.82rem",
                    alignSelf: "start",
                  }}
                >
                  Open Theme
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          opacity: isEnteringTheme ? 1 : 0,
          transform: isEnteringTheme ? "scale(1)" : "scale(1.12)",
          transition:
            "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1), transform 760ms cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
}
