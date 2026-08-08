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
