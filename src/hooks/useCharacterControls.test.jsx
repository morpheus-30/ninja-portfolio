import "@testing-library/jest-dom";
import { useRef, useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useCharacterControls } from "./useCharacterControls";
import { narutoTheme } from "../themes/naruto";
import { popTheme } from "../themes/pop";

// Stable across renders, exactly like the useCallback the real screen passes in.
const noop = () => {};

function Harness({ theme = narutoTheme, onTransition = noop }) {
  const [characterAction, setCharacterAction] = useState("idle");
  const pressedKeysRef = useRef(new Set());
  const lockRef = useRef(false);
  const spriteXRef = useRef(10);

  useCharacterControls({
    activeTheme: theme,
    sections: theme.sections,
    characterAction,
    setCharacterAction,
    triggerTransition: onTransition,
    spriteXRef,
    pressedKeysRef,
    lockRef,
  });

  return <output data-testid="action">{characterAction}</output>;
}

const action = () => screen.getByTestId("action").textContent;
const advance = (ms) => act(() => jest.advanceTimersByTime(ms));

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test("jump plays once and hands back to idle", () => {
  render(<Harness />);
  expect(action()).toBe("idle");

  fireEvent.keyDown(window, { key: "w" });
  expect(action()).toBe("jump");

  // Regression: setting the action used to tear down its own end-timer, so the
  // sprite looped the jump GIF forever until another key interrupted it.
  advance(narutoTheme.design.motion.actionDurations.jump + 20);
  expect(action()).toBe("idle");
});

test("attack plays once and hands back to idle", () => {
  render(<Harness />);

  fireEvent.keyDown(window, { key: "e" });
  expect(action()).toMatch(/^attack[123]$/);

  advance(narutoTheme.design.motion.actionDurations.attack1 + 20);
  expect(action()).toBe("idle");
});

test("releasing the key mid-animation does not cut the action short", () => {
  render(<Harness />);

  fireEvent.keyDown(window, { key: "w" });
  fireEvent.keyUp(window, { key: "w" });
  expect(action()).toBe("jump");

  advance(narutoTheme.design.motion.actionDurations.jump + 20);
  expect(action()).toBe("idle");
});

test("a crouching attack returns to crouch while S is still held", () => {
  render(<Harness />);

  fireEvent.keyDown(window, { key: "s" });
  expect(action()).toBe("crouch");

  fireEvent.keyDown(window, { key: "e" });
  expect(action()).toMatch(/^crouchAttack[123]$/);

  advance(narutoTheme.design.motion.actionDurations.crouchAttack1 + 20);
  expect(action()).toBe("crouch");

  fireEvent.keyUp(window, { key: "s" });
  expect(action()).toBe("idle");
});

test("held-key auto-repeat cannot stall a one-shot action", () => {
  render(<Harness />);

  fireEvent.keyDown(window, { key: "w" });
  // The OS keeps firing keydown while the key is held; each one used to re-arm
  // the end-timer, so the action never finished.
  for (let i = 0; i < 12; i += 1) {
    advance(40);
    fireEvent.keyDown(window, { key: "w", repeat: true });
  }
  advance(narutoTheme.design.motion.actionDurations.jump + 20);
  expect(action()).toBe("idle");
});

test("the listener effect does not re-subscribe when the action changes", () => {
  // This is the root cause: the effect's cleanup clears the pending timer, so
  // it must not depend on the action it sets.
  const addSpy = jest.spyOn(window, "addEventListener");
  render(<Harness />);

  const countKeyListeners = () =>
    addSpy.mock.calls.filter(([type]) => type === "keydown" || type === "keyup")
      .length;
  const initial = countKeyListeners();

  fireEvent.keyDown(window, { key: "w" });
  fireEvent.keyDown(window, { key: "e" });
  fireEvent.keyDown(window, { key: "s" });

  expect(countKeyListeners()).toBe(initial);
  addSpy.mockRestore();
});

test("Gameverse durations drive its own actions", () => {
  render(<Harness theme={popTheme} />);

  fireEvent.keyDown(window, { key: "w" });
  expect(action()).toBe("jump");

  // Shorter than pop's 1100ms jump — must still be mid-animation.
  advance(narutoTheme.design.motion.actionDurations.jump + 20);
  expect(action()).toBe("jump");

  advance(popTheme.design.motion.actionDurations.jump);
  expect(action()).toBe("idle");
});

test("typing in a field never moves the character", () => {
  render(
    <>
      <Harness />
      <input data-testid="field" />
    </>
  );

  const field = screen.getByTestId("field");
  field.focus();
  fireEvent.keyDown(field, { key: "w" });
  fireEvent.keyDown(field, { key: "e" });

  expect(action()).toBe("idle");
});
