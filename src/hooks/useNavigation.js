import { useCallback, useEffect, useRef, useState } from "react";

export function useNavigation({ sections, MOTION, isMobile, pressedKeysRef }) {
  const initialSpriteX = 10;
  const [sectionIdx, setSectionIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [spriteX, setSpriteX] = useState(initialSpriteX);
  const [visible, setVisible] = useState(true);
  const [characterAction, setCharacterAction] = useState("idle");
  const [direction, setDirection] = useState("right");

  const sectionRef = useRef(0);
  const runningTimerRef = useRef(null);
  const swapTimerRef = useRef(null);
  const lockRef = useRef(false);
  const touchStartRef = useRef(null);
  const spriteXRef = useRef(initialSpriteX);

  const triggerTransition = useCallback(
    (nextIdx) => {
      if (
        lockRef.current ||
        nextIdx < 0 ||
        nextIdx >= sections.length ||
        nextIdx === sectionRef.current
      ) {
        return;
      }

      lockRef.current = true;
      const currentX = spriteXRef.current;
      const nextX = 10 + (nextIdx / Math.max(sections.length - 1, 1)) * 80;

      setDirection(nextX >= currentX ? "right" : "left");
      setCharacterAction(
        pressedKeysRef.current.has("s") ? "crouchWalk" : "run"
      );
      setSpriteX(nextX);
      spriteXRef.current = nextX;
      setVisible(false);
      setSectionIdx(nextIdx);
      sectionRef.current = nextIdx;

      window.clearTimeout(runningTimerRef.current);
      window.clearTimeout(swapTimerRef.current);

      runningTimerRef.current = window.setTimeout(() => {
        if (
          !pressedKeysRef.current.has("a") &&
          !pressedKeysRef.current.has("d")
        ) {
          setCharacterAction(
            pressedKeysRef.current.has("s") ? "crouch" : "idle"
          );
        }
      }, MOTION.runDurationMs);

      swapTimerRef.current = window.setTimeout(() => {
        setDisplayIdx(nextIdx);
        setVisible(true);
      }, MOTION.swapDelayMs);

      window.setTimeout(() => {
        lockRef.current = false;
      }, MOTION.scrollLockMs);
    },
    [MOTION.runDurationMs, MOTION.scrollLockMs, MOTION.swapDelayMs, sections.length, pressedKeysRef]
  );

  useEffect(() => {
    const onWheel = (event) => {
      // Short viewports and mobile give the section its own scrollbar. Let the
      // wheel scroll that content and only take over once it hits the edge,
      // otherwise the inner scroll area is unreachable.
      // Sections nest inside <main>, and either can be the scroller, so walk
      // up until one still has room to move in this direction.
      for (
        let node = event.target?.closest?.("[data-scrollable]");
        node;
        node = node.parentElement?.closest("[data-scrollable]")
      ) {
        const maxScroll = node.scrollHeight - node.clientHeight;
        if (maxScroll <= 1) continue;
        const atEdge =
          event.deltaY > 0
            ? node.scrollTop >= maxScroll - 1
            : node.scrollTop <= 1;
        if (!atEdge) return;
      }

      event.preventDefault();
      if (Math.abs(event.deltaY) < 18) return;
      triggerTransition(sectionRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onTouchStart = (event) => {
      touchStartRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    };

    const onTouchEnd = (event) => {
      if (touchStartRef.current == null) return;

      const deltaX = touchStartRef.current.x - event.changedTouches[0].clientX;
      const deltaY = touchStartRef.current.y - event.changedTouches[0].clientY;

      if (
        isMobile &&
        Math.abs(deltaX) > 40 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        triggerTransition(sectionRef.current + (deltaX > 0 ? 1 : -1));
      }

      touchStartRef.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.clearTimeout(runningTimerRef.current);
      window.clearTimeout(swapTimerRef.current);
    };
  }, [isMobile, triggerTransition]);

  return {
    sectionIdx,
    displayIdx,
    spriteX,
    visible,
    characterAction,
    setCharacterAction,
    direction,
    setDirection,
    triggerTransition,
    lockRef,
    spriteXRef,
    sectionRef,
  };
}
