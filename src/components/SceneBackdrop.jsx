import { useEffect, useRef, useState } from "react";
import { useThemeTokens } from "../context/theme-context";
import { usePointerParallax } from "../hooks/usePointerParallax";
import { resolveSrc, supportsWebp, webpSupportIfKnown } from "../utils/images";

/**
 * The scene behind everything, built as real CSS 3D planes.
 *
 * A single `perspective` on the root plus a different `translateZ` per plane
 * means one shared rotation moves each plane by a different amount — genuine
 * depth rather than layers sliding at hand-tuned speeds.
 *
 * Two things drive the camera:
 *  - `travel`, from the character's own position. The sprite moves via a CSS
 *    transition on `left`, so matching its duration and easing here makes the
 *    scene pan in lockstep with it without a single frame of JS.
 *  - the pointer, eased onto the root as `--mx` / `--my`.
 *
 * Section changes additionally dolly the whole stack forward and back.
 */
export default function SceneBackdrop({ sectionIndex, spriteX, travelMs }) {
  const { theme, UI, W, C } = useThemeTokens();
  const sceneRef = useRef(null);
  const [webpOk, setWebpOk] = useState(webpSupportIfKnown);
  const backgrounds = theme.assets.sectionBackgrounds;

  usePointerParallax(sceneRef);

  useEffect(() => {
    if (webpOk !== null) return undefined;
    let cancelled = false;
    supportsWebp().then((ok) => {
      if (!cancelled) setWebpOk(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [webpOk]);

  // The sprite runs between 10% and 90%, so this lands in -1..1.
  const travel = Math.max(-1, Math.min(1, (spriteX - 50) / 40));

  return (
    <div
      ref={sceneRef}
      className="scene"
      aria-hidden="true"
      style={{ "--travel": travel, "--travel-ms": `${travelMs}ms` }}
    >
      <div className="scene-dolly" key={`dolly-${sectionIndex}`}>
        <div className="scene-inner">
          {/* Farthest: the wallpaper itself. */}
          <div className="scene-plane" style={{ "--depth": 1, "--shift": 16 }}>
            {backgrounds.map((url, index) => (
              <div
                key={url}
                className={
                  index === sectionIndex
                    ? "backdrop-layer is-active"
                    : "backdrop-layer"
                }
                style={{
                  backgroundImage:
                    webpOk === null
                      ? undefined
                      : `${UI.backgroundImageOverlay}, url("${resolveSrc(url, webpOk)}")`,
                  filter: UI.backgroundFilter,
                  opacity: index === sectionIndex ? 1 : 0,
                }}
              />
            ))}
          </div>

          {/* Mid: haze above and below, which reads as air between the
              wallpaper and the content. */}
          <div className="scene-plane" style={{ "--depth": 0.55, "--shift": 30 }}>
            <div
              className="scene-fill"
              style={{ background: UI.topAtmosphere }}
            />
            <div
              className="scene-fill"
              style={{
                top: "auto",
                height: "45vh",
                background: UI.bottomAtmosphere,
              }}
            />
          </div>

          {/* Nearest: the grid, which moves most and sells the perspective. */}
          <div className="scene-plane" style={{ "--depth": 0.18, "--shift": 52 }}>
            <div
              className="scene-fill scene-grid"
              style={{ backgroundImage: UI.gridOverlay }}
            />
          </div>
        </div>
      </div>

      {/* Screen-space, deliberately outside the 3D stack: these are the lamp and
          the glass, not objects in the scene, so they must not parallax. */}
      {theme.id === "pop" ? (
        <>
          <div className="crt-roll" />
          <div className="crt-flicker" style={{ background: W.inkBleed }} />
        </>
      ) : (
        <div
          className="ember-breathe"
          style={{
            background: `radial-gradient(120% 70% at 50% 100%, ${C.ember}2b 0%, ${C.ember}00 58%)`,
          }}
        />
      )}
    </div>
  );
}
