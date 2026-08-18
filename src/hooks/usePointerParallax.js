import { useEffect } from "react";

/**
 * Eases two normalised pointer coordinates (-1..1) onto an element as the CSS
 * custom properties `--mx` / `--my`.
 *
 * Written straight to the node rather than held in state: a pointer move would
 * otherwise re-render the whole scene on every frame. The rAF loop lerps toward
 * the target so the camera glides instead of snapping, and parks itself once it
 * has settled so an idle pointer costs nothing.
 */
export function usePointerParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window.matchMedia !== "function") return undefined;

    // Pointless without a real pointer, and unwelcome if motion is reduced.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return undefined;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      el.style.setProperty("--mx", currentX.toFixed(4));
      el.style.setProperty("--my", currentY.toFixed(4));

      const settled =
        Math.abs(targetX - currentX) < 0.0015 &&
        Math.abs(targetY - currentY) < 0.0015;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}
