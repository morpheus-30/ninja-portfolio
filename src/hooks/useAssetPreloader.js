import { useEffect, useMemo, useRef, useState } from "react";
import { preloadImage, resolveSrc, supportsWebp } from "../utils/images";

/**
 * Warms a theme's images and reports progress.
 *
 * `critical` gates the caller (the loading screen waits on these); `deferred`
 * is fired afterwards and never gates, so heavy sprites keep downloading while
 * the visitor is already in the scene.
 */
export function useAssetPreloader({ critical = [], deferred = [] }) {
  const criticalKey = critical.join("|");
  const deferredKey = deferred.join("|");
  const [progress, setProgress] = useState({
    loaded: 0,
    total: critical.length,
    done: critical.length === 0,
  });

  // Read the lists through a ref so only their contents, not their identity,
  // restart the preload.
  const listsRef = useRef({ critical, deferred });
  listsRef.current = { critical, deferred };

  useEffect(() => {
    let cancelled = false;
    const { critical: crit, deferred: defer } = listsRef.current;

    setProgress({ loaded: 0, total: crit.length, done: crit.length === 0 });

    supportsWebp().then((webpOk) => {
      if (cancelled) return;

      let loaded = 0;
      const bump = () => {
        if (cancelled) return;
        loaded += 1;
        setProgress({ loaded, total: crit.length, done: loaded >= crit.length });
      };

      if (crit.length === 0) {
        setProgress({ loaded: 0, total: 0, done: true });
      }

      crit.forEach((url) => {
        preloadImage(resolveSrc(url, webpOk)).then(bump);
      });

      // Fire and forget: these must not hold up entry.
      defer.forEach((url) => {
        preloadImage(resolveSrc(url, webpOk));
      });
    });

    return () => {
      cancelled = true;
    };
  }, [criticalKey, deferredKey]);

  return progress;
}

/**
 * Splits a theme's assets into what must be ready before the scene appears and
 * what can keep loading behind it.
 *
 * Backgrounds and the portrait are full-bleed and instantly visible, so they
 * gate. Character GIFs are small and the sprite starts on `idle`, so only the
 * two the visitor sees first are critical.
 */
export function useThemeAssetLists(theme) {
  return useMemo(() => {
    if (!theme) return { critical: [], deferred: [] };

    const { assets } = theme;
    const character = assets.character ?? {};
    const ui = assets.ui ?? {};

    const critical = [
      ...assets.sectionBackgrounds,
      assets.heroProfile,
      character.idle,
      character.run,
    ].filter(Boolean);

    const criticalSet = new Set(critical);
    const deferred = [
      ...Object.values(character),
      ...Object.values(ui),
    ].filter((url) => typeof url === "string" && !criticalSet.has(url));

    return { critical, deferred: [...new Set(deferred)] };
  }, [theme]);
}
