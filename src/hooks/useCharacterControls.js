import { useEffect, useMemo, useRef } from "react";
import { isTypingTarget, getSectionPoints } from "../utils/helpers";
import { pickRandomAction, getActionDuration } from "../utils/character";

/** Transient actions play once and then hand back to idle/crouch. */
const TRANSIENT_KEYS = ["w", "e"];
const HANDLED_KEYS = ["w", "a", "s", "d", "e"];

export function useCharacterControls({
  activeTheme,
  sections,
  characterAction,
  setCharacterAction,
  triggerTransition,
  spriteXRef,
  pressedKeysRef,
  lockRef,
}) {
  const actionTimerRef = useRef(null);
  const sectionPoints = useMemo(() => getSectionPoints(sections), [sections]);

  /**
   * The handlers need to read the current action, but they must not be rebuilt
   * when it changes: this effect's cleanup clears the pending end-timer, so
   * depending on `characterAction` meant setting an action tore down the very
   * timer meant to end it — the sprite then looped that GIF forever. Mirroring
   * it into a ref keeps the listeners mounted once and the timer intact.
   */
  const actionRef = useRef(characterAction);
  useEffect(() => {
    actionRef.current = characterAction;
  }, [characterAction]);

  useEffect(() => {
    const closestSectionIndex = () => {
      let closestIndex = 0;
      let closestDistance = Infinity;

      sectionPoints.forEach((point, index) => {
        const distance = Math.abs(spriteXRef.current - point);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    const endTransientAction = () => {
      actionTimerRef.current = null;
      setCharacterAction(pressedKeysRef.current.has("s") ? "crouch" : "idle");
    };

    const startTransientAction = (action) => {
      setCharacterAction(action);
      window.clearTimeout(actionTimerRef.current);
      actionTimerRef.current = window.setTimeout(
        endTransientAction,
        getActionDuration(activeTheme, action)
      );
    };

    const moveToSectionPoint = (step) => {
      if (actionRef.current === "jump") return;

      const currentIndex = closestSectionIndex();
      const nextIndex = Math.max(
        0,
        Math.min(sections.length - 1, currentIndex + step)
      );

      if (nextIndex === currentIndex) return;

      triggerTransition(nextIndex);
    };

    const onActionKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (!HANDLED_KEYS.includes(key)) return;
      if (
        isTypingTarget(event.target) ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }

      if (key !== "e") {
        event.preventDefault();
      }

      // Holding a key auto-repeats keydown. For a one-shot action that would
      // re-arm the end-timer on every repeat and stall the animation.
      if (event.repeat && TRANSIENT_KEYS.includes(key)) return;

      pressedKeysRef.current.add(key);

      if (
        (key === "a" || key === "d") &&
        ((activeTheme.id === "pop" && pressedKeysRef.current.has("s")) ||
          pressedKeysRef.current.has("w") ||
          (activeTheme.id === "pop" && actionRef.current === "crouch") ||
          actionRef.current === "jump")
      ) {
        return;
      }

      if (key === "a") {
        moveToSectionPoint(-1);
      } else if (key === "d") {
        moveToSectionPoint(1);
      } else if (key === "s") {
        window.clearTimeout(actionTimerRef.current);
        setCharacterAction("crouch");
      } else if (key === "w") {
        startTransientAction("jump");
      } else if (key === "e") {
        startTransientAction(
          pressedKeysRef.current.has("s")
            ? pickRandomAction([
                "crouchAttack1",
                "crouchAttack2",
                "crouchAttack3",
              ])
            : pickRandomAction(["attack1", "attack2", "attack3"])
        );
      }
    };

    const onActionKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (!HANDLED_KEYS.includes(key)) return;
      if (
        isTypingTarget(event.target) ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }
      pressedKeysRef.current.delete(key);

      // A transient action owns the sprite until its timer fires, so releasing
      // a key mid-animation must not cut it short.
      const midTransient = actionTimerRef.current != null && [
        "jump",
        "attack1",
        "attack2",
        "attack3",
        "crouchAttack1",
        "crouchAttack2",
        "crouchAttack3",
      ].includes(actionRef.current);

      if (key === "s" && !midTransient) {
        if (lockRef.current && actionRef.current === "crouchWalk") return;
        setCharacterAction("idle");
      }

      if (
        (key === "a" || key === "d") &&
        !pressedKeysRef.current.has("a") &&
        !pressedKeysRef.current.has("d")
      ) {
        if (
          lockRef.current ||
          midTransient ||
          actionRef.current === "run" ||
          actionRef.current === "crouchWalk"
        ) {
          return;
        }

        setCharacterAction(
          pressedKeysRef.current.has("s") ? "crouch" : "idle"
        );
      }
    };

    window.addEventListener("keydown", onActionKeyDown);
    window.addEventListener("keyup", onActionKeyUp);
    return () => {
      window.removeEventListener("keydown", onActionKeyDown);
      window.removeEventListener("keyup", onActionKeyUp);
      window.clearTimeout(actionTimerRef.current);
    };
  }, [
    activeTheme,
    sectionPoints,
    sections.length,
    triggerTransition,
    setCharacterAction,
    spriteXRef,
    pressedKeysRef,
    lockRef,
  ]);
}
