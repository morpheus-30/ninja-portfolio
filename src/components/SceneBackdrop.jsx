import { useEffect, useState } from "react";
import { useThemeTokens } from "../context/theme-context";
import { resolveSrc, supportsWebp, webpSupportIfKnown } from "../utils/images";

/**
 * The scene behind everything.
 *
 * All section backgrounds are mounted as stacked layers and crossfaded by
 * opacity. Previously a single div swapped its `background-image` with no
 * transition, so every section change popped. Because the images are preloaded
 * during the theme loader, keeping all of them mounted costs no extra fetch, and
 * only the visible layer runs its drift animation.
 */
export default function SceneBackdrop({ sectionIndex }) {
  const { theme, UI, W } = useThemeTokens();
  // Seeded from the probe the loading screen already ran, so the first frame
  // paints a background rather than nothing.
  const [webpOk, setWebpOk] = useState(webpSupportIfKnown);
  const backgrounds = theme.assets.sectionBackgrounds;

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

  // Parallax: the scene slides a little against the character's travel, which
  // gives the traversal depth instead of swapping flat pictures.
  const spread = Math.max(backgrounds.length - 1, 1);
  const parallax = (sectionIndex / spread - 0.5) * 2;

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      {backgrounds.map((url, index) => {
        const isActive = index === sectionIndex;

        return (
          <div
            key={url}
            className={isActive ? "backdrop-layer is-active" : "backdrop-layer"}
            style={{
              backgroundImage:
                webpOk === null
                  ? undefined
                  : `${UI.backgroundImageOverlay}, url("${resolveSrc(url, webpOk)}")`,
              backgroundPosition: `calc(50% + ${parallax * 2.5}%) center`,
              filter: UI.backgroundFilter,
              opacity: isActive ? 1 : 0,
            }}
          />
        );
      })}

      {/* Per-world atmosphere, in motion. */}
      {theme.id === "pop" ? (
        <>
          {/* The bright band that rolls down a mistuned tube. */}
          <div className="crt-roll" />
          <div className="crt-flicker" style={{ background: W.inkBleed }} />
        </>
      ) : (
        <div
          className="ember-breathe"
          style={{
            background: `radial-gradient(120% 70% at 50% 100%, ${theme.design.colors.ember}2b 0%, ${theme.design.colors.ember}00 58%)`,
          }}
        />
      )}
    </div>
  );
}
