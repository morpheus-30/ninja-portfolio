/**
 * Image format resolution and preloading.
 *
 * Every background ships as both WebP and its original JPEG. Rather than emit a
 * CSS `image-set()` (whose `type()` syntax needs prefixing for older Safari), we
 * probe WebP support once and then use plain URLs. That keeps the preloader and
 * the renderer in agreement — we warm exactly the file the browser will paint.
 */

// Smallest valid lossy WebP. Decodes only where WebP is actually supported.
const WEBP_PROBE =
  "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";

let webpSupport = null;
let webpSupportSync = null;

export function supportsWebp() {
  if (webpSupport) return webpSupport;

  webpSupport = new Promise((resolve) => {
    if (typeof Image === "undefined") {
      resolve(false);
      return;
    }
    const probe = new Image();
    const settle = (ok) => {
      webpSupportSync = ok;
      resolve(ok);
    };
    probe.onload = () => settle(probe.width > 0);
    probe.onerror = () => settle(false);
    probe.src = WEBP_PROBE;
  });

  return webpSupport;
}

/**
 * Already-known WebP support, or null before the probe has settled. Lets a
 * component render the right URL on its very first frame instead of flashing
 * an empty background for one tick.
 */
export function webpSupportIfKnown() {
  return webpSupportSync;
}

/** Swap a raster URL for its WebP sibling when the browser can decode it. */
export function resolveSrc(url, webpOk) {
  if (!webpOk || typeof url !== "string") return url;
  return url.replace(/\.(jpe?g|png)$/i, ".webp");
}

/**
 * Fetch and decode one image.
 *
 * `decode()` resolves once the bitmap is ready to paint, which is what we
 * actually care about — `onload` alone can still leave a decode hitch on the
 * first frame. Failures resolve rather than reject so one missing asset can
 * never stall the loading screen.
 */
export function preloadImage(url) {
  return new Promise((resolve) => {
    if (typeof Image === "undefined") {
      resolve(false);
      return;
    }

    const img = new Image();
    img.decoding = "async";

    const settle = (ok) => resolve(ok);

    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(
          () => settle(true),
          () => settle(true)
        );
      } else {
        settle(true);
      }
    };
    img.onerror = () => settle(false);
    img.src = url;
  });
}
