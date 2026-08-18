import { useEffect, useRef, useState } from "react";
import {
  useAssetPreloader,
  useThemeAssetLists,
} from "../hooks/useAssetPreloader";

/** Show the loader long enough to read, but never trap entry on a slow asset. */
const MIN_VISIBLE_MS = 900;
const MAX_WAIT_MS = 7000;

export default function ThemeLoadingScreen({ theme, onReady }) {
  const { colors: C, fonts: F } = theme.design;
  const { critical, deferred } = useThemeAssetLists(theme);
  const progress = useAssetPreloader({ critical, deferred });
  const [minElapsed, setMinElapsed] = useState(false);
  const firedRef = useRef(false);

  const fraction = progress.total ? progress.loaded / progress.total : 1;

  useEffect(() => {
    const floor = window.setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    // A stalled CDN must never strand the visitor on the loader; the scene
    // degrades to loading its own images, which is the old behaviour.
    const ceiling = window.setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onReady?.();
      }
    }, MAX_WAIT_MS);

    return () => {
      window.clearTimeout(floor);
      window.clearTimeout(ceiling);
    };
  }, [onReady]);

  useEffect(() => {
    if (progress.done && minElapsed && !firedRef.current) {
      firedRef.current = true;
      onReady?.();
    }
  }, [progress.done, minElapsed, onReady]);
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const loaderFrameWidth = isMobile ? "min(78vw, 280px)" : "min(44vw, 220px)";
  const loaderFrameHeight = isMobile ? "min(30vh, 220px)" : "220px";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000000",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        color: C.text,
        fontFamily: F.body,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, ${C.ember}2e 0%, ${C.gold}14 18%, rgba(0,0,0,0) 46%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          justifyItems: "center",
          gap: isMobile ? "0.85rem" : "1rem",
          padding: isMobile ? "1.1rem" : "1.5rem",
          textAlign: "center",
          isolation: "isolate",
          width: "100%",
        }}
      >
        {theme.assets.ui.loader && (
          <div
            style={{
              width: loaderFrameWidth,
              height: loaderFrameHeight,
              display: "grid",
              placeItems: "center",
            }}
          >
            <img
              src={theme.assets.ui.loader}
              alt={`${theme.label} loading`}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: loaderFrameWidth,
                maxHeight: loaderFrameHeight,
                minWidth: isMobile ? "140px" : "120px",
                objectFit: "contain",
                display: "block",
                opacity: 1,
                filter:
                  "contrast(1.04) brightness(1.02) drop-shadow(0 14px 28px rgba(0,0,0,0.45))",
              }}
            />
          </div>
        )}
        <div
          style={{
            fontFamily: F.display,
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          {theme.content.controls.loadingText}
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(fraction * 100)}
          aria-label={theme.content.controls.loadingText}
          style={{
            width: isMobile ? "58vw" : "240px",
            height: "3px",
            background: "rgba(255,255,255,0.09)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, ${C.ember}, ${C.gold})`,
              // scaleX rather than width: a growing bar should not relayout on
              // every decoded image.
              transform: `scaleX(${Math.max(fraction, 0.04)})`,
              transformOrigin: "left center",
              transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
        <div
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.muted,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {progress.total > 0
            ? `${progress.loaded} / ${progress.total} assets`
            : "Ready"}
        </div>
      </div>
    </div>
  );
}
