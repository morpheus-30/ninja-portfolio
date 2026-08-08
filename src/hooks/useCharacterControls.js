import { useEffect, useMemo, useRef } from "react";
import { isTypingTarget, getSectionPoints } from "../utils/helpers";
import { pickRandomAction, getActionDuration } from "../utils/character";

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
      const keys = pressedKeysRef.current;
      if (keys.has("s")) {
        setCharacterAction("crouch");
      } else {
        setCharacterAction("idle");
      }
    };

    const moveToSectionPoint = (step) => {
      if (characterAction === "jump") return;

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
      if (!["w", "a", "s", "d", "e"].includes(key)) return;
      if (
        isTypingTarget(event.target) ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }

      if (["w", "a", "s", "d"].includes(key)) {
        event.preventDefault();
      }

      pressedKeysRef.current.add(key);
      window.clearTimeout(actionTimerRef.current);

      if (
        (key === "a" || key === "d") &&
        ((activeTheme.id === "pop" && pressedKeysRef.current.has("s")) ||
          pressedKeysRef.current.has("w") ||
          (activeTheme.id === "pop" && characterAction === "crouch") ||
          characterAction === "jump")
      ) {
        return;
      }

      if (key === "a") {
        moveToSectionPoint(-1);
      } else if (key === "d") {
        moveToSectionPoint(1);
      } else if (key === "s") {
        setCharacterAction("crouch");
      } else if (key === "w") {
        setCharacterAction("jump");
        actionTimerRef.current = window.setTimeout(
          endTransientAction,
          getActionDuration(activeTheme, "jump")
        );
      } else if (key === "e") {
        const attackAction = pressedKeysRef.current.has("s")
          ? pickRandomAction([
            "crouchAttack1",
            "crouchAttack2",
            "crouchAttack3",
          ])
          : pickRandomAction(["attack1", "attack2", "attack3"]);

        setCharacterAction(attackAction);
        actionTimerRef.current = window.setTimeout(
          endTransientAction,
          getActionDuration(activeTheme, attackAction)
        );
      }
    };

    const onActionKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (!["w", "a", "s", "d", "e"].includes(key)) return;
      if (
        isTypingTarget(event.target) ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }
      pressedKeysRef.current.delete(key);

      if (
        key === "s" &&
        !pressedKeysRef.current.has("w") &&
        !pressedKeysRef.current.has("e")
      ) {
        if (lockRef.current && characterAction === "crouchWalk") {
          return;
        }

        setCharacterAction("idle");
      }

      if (
        (key === "a" || key === "d") &&
        !pressedKeysRef.current.has("a") &&
        !pressedKeysRef.current.has("d")
      ) {
        if (
          lockRef.current ||
          characterAction === "run" ||
          characterAction === "crouchWalk"
        ) {
          return;
        }

        if (
          !pressedKeysRef.current.has("w") &&
          !pressedKeysRef.current.has("s") &&
          !pressedKeysRef.current.has("e")
        ) {
          setCharacterAction("idle");
        }
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
    characterAction,
    sectionPoints,
    sections.length,
    triggerTransition,
    setCharacterAction,
    spriteXRef,
    pressedKeysRef,
    lockRef,
  ]);
}
