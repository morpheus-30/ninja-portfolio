import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import ThemeLoadingScreen from "./ThemeLoadingScreen";
import { narutoTheme } from "../themes/naruto";
import { popTheme } from "../themes/pop";
import { resolveSrc } from "../utils/images";

/**
 * jsdom never fetches, so Image is stubbed. Note it settles on a promise tick,
 * not queueMicrotask, which jest's fake timers replace. `mode` decides whether a load
 * succeeds, fails, or hangs forever — the three cases the loading screen has to
 * survive.
 */
let mode = "ok";
const pending = [];

class StubImage {
  set src(value) {
    this._src = value;
    // The WebP probe is a data URI; answer it immediately and independently of
    // the mode so format resolution is not what is under test here.
    if (value.startsWith("data:image/webp")) {
      this.width = 1;
      Promise.resolve().then(() => this.onload?.());
      return;
    }
    if (mode === "hang") {
      pending.push(this);
      return;
    }
    Promise.resolve().then(() =>
      mode === "ok" ? this.onload?.() : this.onerror?.()
    );
  }

  get src() {
    return this._src;
  }
}

let OriginalImage;
beforeAll(() => {
  OriginalImage = global.Image;
  global.Image = StubImage;
});
afterAll(() => {
  global.Image = OriginalImage;
});

beforeEach(() => {
  mode = "ok";
  pending.length = 0;
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

// The chain is probe -> format resolved -> each image -> progress, so several
// microtask turns have to drain before state settles.
const settle = async () => {
  await act(async () => {
    for (let i = 0; i < 40; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await Promise.resolve();
    }
  });
};

const advance = (ms) => act(() => jest.advanceTimersByTime(ms));

test("entry waits for the theme's images, then reports ready once", async () => {
  const onReady = jest.fn();
  render(<ThemeLoadingScreen theme={narutoTheme} onReady={onReady} />);

  await settle();
  // Assets are decoded, but the loader has a minimum on-screen time so it does
  // not flash on a warm cache.
  expect(onReady).not.toHaveBeenCalled();

  advance(1000);
  expect(onReady).toHaveBeenCalledTimes(1);

  // The max-wait ceiling must not fire a second time.
  advance(10000);
  expect(onReady).toHaveBeenCalledTimes(1);
});

test("progress is real, not a decorative sweep", async () => {
  render(<ThemeLoadingScreen theme={narutoTheme} onReady={() => {}} />);

  const bar = screen.getByRole("progressbar");
  expect(bar).toHaveAttribute("aria-valuenow", "0");

  await settle();

  expect(bar).toHaveAttribute("aria-valuenow", "100");
  // One entry per gating asset: five backgrounds, the portrait, idle and run.
  expect(screen.getByText(/^\d+ \/ \d+ assets$/)).toHaveTextContent("8 / 8 assets");
});

test("a stalled CDN still lets the visitor in", async () => {
  mode = "hang";
  const onReady = jest.fn();
  render(<ThemeLoadingScreen theme={popTheme} onReady={onReady} />);

  await settle();
  advance(1000);
  // Nothing has loaded, so readiness has not been reached.
  expect(onReady).not.toHaveBeenCalled();
  expect(pending.length).toBeGreaterThan(0);

  advance(7000);
  expect(onReady).toHaveBeenCalledTimes(1);
});

test("a missing asset counts as settled rather than hanging", async () => {
  mode = "error";
  const onReady = jest.fn();
  render(<ThemeLoadingScreen theme={popTheme} onReady={onReady} />);

  await settle();
  advance(1000);

  // Errors resolve, so the gate opens on the normal path, not the ceiling.
  expect(onReady).toHaveBeenCalledTimes(1);
});

test("preloads the WebP the backdrop will actually paint", async () => {
  render(<ThemeLoadingScreen theme={popTheme} onReady={() => {}} />);
  await settle();

  expect(resolveSrc("/assets/themes/pop/backgrounds/home.jpg", true)).toBe(
    "/assets/themes/pop/backgrounds/home.webp"
  );
  // GIFs have no WebP sibling and must be left alone.
  expect(resolveSrc("/assets/themes/pop/character/idle.gif", true)).toBe(
    "/assets/themes/pop/character/idle.gif"
  );
  expect(resolveSrc("/assets/themes/pop/backgrounds/home.jpg", false)).toBe(
    "/assets/themes/pop/backgrounds/home.jpg"
  );
});
