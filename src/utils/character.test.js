import { getCharacterFrame } from "./character";
import { narutoTheme } from "../themes/naruto";
import { popTheme } from "../themes/pop";

test("per-action overrides win, unlisted actions inherit default", () => {
  expect(getCharacterFrame(narutoTheme, "jump", false).height).toBe(200);
  expect(getCharacterFrame(narutoTheme, "idle", false).height).toBe(146);
  expect(getCharacterFrame(narutoTheme, "attack1", false).height).toBe(146);
  expect(getCharacterFrame(popTheme, "run", false).height).toBe(110);
  expect(getCharacterFrame(popTheme, "crouch", false).height).toBe(200);
});

test("mobile uses mh/mBottom, falling back to a scale of the desktop value", () => {
  expect(getCharacterFrame(popTheme, "jump", true).height).toBe(114);
  expect(getCharacterFrame(popTheme, "idle", true).bottom).toBe(-2);
  expect(getCharacterFrame(narutoTheme, "crouchAttack2", true).bottom).toBe(-6);
  // crouchAttack2 declares bottom but not mBottom for desktop reads
  expect(getCharacterFrame(narutoTheme, "crouchAttack2", false).bottom).toBe(-20);
  // no mh declared anywhere -> derived, never undefined
  const bare = { design: { character: { default: { h: 100, bottom: 0 } } } };
  expect(getCharacterFrame(bare, "idle", true).height).toBe(70);
});

test("frame box and blend fall back safely for an unknown action", () => {
  const frame = getCharacterFrame(narutoTheme, "backflip", false);
  expect(frame).toMatchObject({ frameWidth: 400, frameHeight: 240, blend: "normal" });
  expect(getCharacterFrame(narutoTheme, "idle", false).blend).toBe("multiply");
});
