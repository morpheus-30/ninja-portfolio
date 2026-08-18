export function buildCharacterActions(characterAssets) {
  return {
    idle: { src: characterAssets.idle },
    run: { src: characterAssets.run ?? characterAssets.idle },
    crouchWalk: {
      src:
        characterAssets.crouchWalk ??
        characterAssets.run ??
        characterAssets.idle,
    },
    jump: { src: characterAssets.jump ?? characterAssets.idle },
    crouch: { src: characterAssets.crouch ?? characterAssets.idle },
    attack1: {
      src:
        characterAssets.attack1 ?? characterAssets.run ?? characterAssets.idle,
    },
    attack2: {
      src:
        characterAssets.attack2 ??
        characterAssets.attack1 ??
        characterAssets.run ??
        characterAssets.idle,
    },
    attack3: {
      src:
        characterAssets.attack3 ??
        characterAssets.attack2 ??
        characterAssets.attack1 ??
        characterAssets.run ??
        characterAssets.idle,
    },
    crouchAttack1: {
      src:
        characterAssets.crouchAttack1 ??
        characterAssets.crouch ??
        characterAssets.idle,
    },
    crouchAttack2: {
      src:
        characterAssets.crouchAttack2 ??
        characterAssets.crouchAttack1 ??
        characterAssets.crouch ??
        characterAssets.idle,
    },
    crouchAttack3: {
      src:
        characterAssets.crouchAttack3 ??
        characterAssets.crouchAttack2 ??
        characterAssets.crouchAttack1 ??
        characterAssets.crouch ??
        characterAssets.idle,
    },
  };
}

export function pickRandomAction(actions) {
  return actions[Math.floor(Math.random() * actions.length)];
}

export function getActionDuration(theme, action) {
  return theme.design.motion.actionDurations?.[action] ?? 420;
}

const FALLBACK_FRAME = { w: 400, h: 240, mw: 150, mh: 118 };
const MOBILE_SCALE = 0.7;

/**
 * Resolve the render box for one character GIF.
 *
 * Sprite sheets differ per action (a jump GIF has headroom, a crouch GIF sits
 * low), so every action gets a calibration entry in theme.design.character
 * that is merged over `default`. Tune the numbers there, not here.
 *
 * Mobile heights are read from `mh`; when an action sets its own `h` without an
 * `mh`, the mobile height scales off that `h` rather than inheriting the
 * default's `mh`, which would otherwise size the sprite off the wrong action.
 */
export function getCharacterFrame(theme, action, isMobile) {
  const cfg = theme.design.character ?? {};
  const frame = { ...FALLBACK_FRAME, ...cfg.frame };
  const base = { h: 146, bottom: 0, ...cfg.default };
  const override = cfg[action] ?? {};
  const sprite = { ...base, ...override };
  const mobileHeight =
    sprite.mh ?? (override.h && !override.mh ? null : base.mh);

  return {
    frameWidth: isMobile ? frame.mw : frame.w,
    frameHeight: isMobile ? frame.mh : frame.h,
    height: isMobile
      ? mobileHeight ?? Math.round(sprite.h * MOBILE_SCALE)
      : sprite.h,
    bottom: isMobile ? sprite.mBottom ?? sprite.bottom : sprite.bottom,
    blend: sprite.blend ?? "normal",
  };
}
