import { useThemeTokens } from "../context/theme-context";
import { buildCharacterActions } from "../utils/character";

export default function NarutoWalker({ action, direction, isMobile }) {
  const { theme } = useThemeTokens();
  const characterActions = buildCharacterActions(theme.assets.character);
  const actionConfig = characterActions[action] ?? characterActions.idle;

  const frameWidth = isMobile ? 150 : 400;
  const frameHeight = isMobile ? 118 : 240;

  const spriteHeight =
    action === "run" && theme.id === "pop"
      ? isMobile
        ? 92
        : 110
      : (action === "attack2" || action === "attack3") && theme.id === "pop"
        ? isMobile
          ? 108
          : 170
        : action === "attack1" && theme.id === "pop"
          ? isMobile
            ? 108
            : 140
          : action === "jump" && theme.id === "pop"
            ? isMobile
              ? 114
              : 240
            : theme.id === "pop"
              ? isMobile
                ? 108
                : 200
              : action === "jump"
                ? isMobile
                  ? 114
                  : 200
                : action === "crouchAttack2" || action === "crouchAttack1"
                  ? isMobile
                    ? 112
                    : 220
                  : action === "crouchAttack3"
                    ? isMobile
                      ? 108
                      : 180
                    : isMobile
                      ? 102
                      : 146;

  const spriteBottom =
    theme.id === "pop"
      ? isMobile
        ? -2
        : 20
      : action === "crouchAttack2"
        ? isMobile
          ? -6
          : -20
        : 0;

  return (
    <div
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        overflow: "hidden",
        position: "relative",
        display: "block",
        transition: "width 160ms ease, height 160ms ease",
      }}
    >
      <img
        src={actionConfig.src}
        alt="Naruto runner"
        style={{
          position: "absolute",
          height: `${spriteHeight}px`,
          width: "auto",
          left: "50%",
          bottom: `${spriteBottom}px`,
          display: "block",
          transform:
            direction === "left"
              ? "translateX(-50%) scaleX(-1)"
              : "translateX(-50%) scaleX(1)",
          transformOrigin: "center center",
          mixBlendMode: action === "idle" ? "multiply" : "normal",
          filter:
            action === "run"
              ? "drop-shadow(0 10px 18px rgba(0,0,0,0.62)) drop-shadow(0 0 14px rgba(216,90,26,0.28))"
              : "drop-shadow(0 10px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 14px rgba(216,90,26,0.3)) saturate(1.05) contrast(1.04)",
          userSelect: "none",
          WebkitUserDrag: "none",
        }}
      />
    </div>
  );
}
