import { useEffect, useRef } from "react";
import { useThemeTokens } from "../context/theme-context";
import { buildCharacterActions, getCharacterFrame } from "../utils/character";

/**
 * Preloads all character GIF URLs into browser cache.
 * Called once on mount so action transitions are instant.
 */
function usePreloadCharacterGifs(characterAssets) {
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;

    const urls = new Set(Object.values(characterAssets));
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [characterAssets]);
}

export default function NarutoWalker({ action, direction, isMobile }) {
  const { theme } = useThemeTokens();
  const characterActions = buildCharacterActions(theme.assets.character);
  const actionConfig = characterActions[action] ?? characterActions.idle;

  // Preload all GIFs so transitions are instant
  usePreloadCharacterGifs(theme.assets.character);

  const { frameWidth, frameHeight, height, bottom, blend } = getCharacterFrame(
    theme,
    action,
    isMobile
  );
  const isRunning = action === "run" || action === "crouchWalk";

  return (
    <div
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        overflow: "hidden",
        position: "relative",
        display: "block",
      }}
    >
      {/* Motion streaks trailing the sprite while it travels */}
      {isRunning && (
        <div
          aria-hidden="true"
          className="speed-lines"
          style={{
            transform: direction === "left" ? "scaleX(-1)" : "none",
          }}
        >
          <span style={{ "--y": "28%", "--len": "62px", "--delay": "0ms" }} />
          <span style={{ "--y": "48%", "--len": "88px", "--delay": "90ms" }} />
          <span style={{ "--y": "68%", "--len": "54px", "--delay": "40ms" }} />
        </div>
      )}
      {/* key forces a new <img> element on action change so the GIF replays from frame 1 */}
      <img
        key={action}
        src={actionConfig.src}
        alt="Character"
        style={{
          position: "absolute",
          height: `${height}px`,
          width: "auto",
          left: "50%",
          bottom: `${bottom}px`,
          display: "block",
          transform:
            direction === "left"
              ? "translateX(-50%) scaleX(-1)"
              : "translateX(-50%) scaleX(1)",
          transformOrigin: "center center",
          mixBlendMode: blend,
          filter: isRunning
            ? "drop-shadow(0 10px 18px rgba(0,0,0,0.62)) drop-shadow(0 0 14px rgba(216,90,26,0.28))"
            : "drop-shadow(0 10px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 14px rgba(216,90,26,0.3)) saturate(1.05) contrast(1.04)",
          userSelect: "none",
          WebkitUserDrag: "none",
        }}
      />
    </div>
  );
}
