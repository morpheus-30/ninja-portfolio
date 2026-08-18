import "@testing-library/jest-dom";
import { render, act } from "@testing-library/react";
import SceneBackdrop from "./SceneBackdrop";
import { ThemeProvider } from "../context/theme-context";
import { narutoTheme } from "../themes/naruto";
import { popTheme } from "../themes/pop";

// jsdom has no matchMedia; each test declares the environment it wants.
const setMedia = ({ fine = true, calm = false }) => {
  window.matchMedia = jest.fn((query) => ({
    matches: query.includes("prefers-reduced-motion") ? calm : fine,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
};

const renderScene = (props, theme = narutoTheme) =>
  render(
    <ThemeProvider theme={theme}>
      <SceneBackdrop sectionIndex={0} spriteX={10} travelMs={720} {...props} />
    </ThemeProvider>
  );

beforeEach(() => setMedia({}));

test("the character's position drives the camera", () => {
  // The sprite runs 10% -> 90%, which must map onto the full -1..1 range.
  const { container, rerender } = renderScene({ spriteX: 10 });
  const scene = container.querySelector(".scene");
  expect(scene.style.getPropertyValue("--travel")).toBe("-1");

  const at = (spriteX) => {
    rerender(
      <ThemeProvider theme={narutoTheme}>
        <SceneBackdrop sectionIndex={0} spriteX={spriteX} travelMs={720} />
      </ThemeProvider>
    );
    return container.querySelector(".scene").style.getPropertyValue("--travel");
  };

  expect(at(50)).toBe("0");
  expect(at(90)).toBe("1");
  // Clamped, so an out-of-range value cannot fling the scene off screen.
  expect(at(-40)).toBe("-1");
  expect(at(400)).toBe("1");
});

test("pans on the same clock as the sprite it follows", () => {
  const { container } = renderScene({ travelMs: 720 });
  expect(container.querySelector(".scene").style.getPropertyValue("--travel-ms")).toBe(
    "720ms"
  );
});

test("planes are ordered back to front with distinct depths", () => {
  const { container } = renderScene({});
  const depths = [...container.querySelectorAll(".scene-plane")].map((el) =>
    Number(el.style.getPropertyValue("--depth"))
  );

  expect(depths).toHaveLength(3);
  // Strictly decreasing: wallpaper farthest, grid nearest.
  expect(depths).toEqual([...depths].sort((a, b) => b - a));
  expect(new Set(depths).size).toBe(depths.length);

  // Nearer planes shift more, which is what reads as parallax.
  const shifts = [...container.querySelectorAll(".scene-plane")].map((el) =>
    Number(el.style.getPropertyValue("--shift"))
  );
  expect(shifts).toEqual([...shifts].sort((a, b) => a - b));
});

test("every background stays mounted so changes crossfade", () => {
  const { container } = renderScene({ sectionIndex: 2 });
  const layers = container.querySelectorAll(".backdrop-layer");

  expect(layers).toHaveLength(narutoTheme.assets.sectionBackgrounds.length);
  expect(layers[2]).toHaveClass("is-active");
  expect(layers[2]).toHaveStyle({ opacity: "1" });
  expect(layers[0]).toHaveStyle({ opacity: "0" });
  expect(layers[0]).not.toHaveClass("is-active");
});

test("the dolly restarts on a section change", () => {
  const { container, rerender } = renderScene({ sectionIndex: 0 });
  const first = container.querySelector(".scene-dolly");

  rerender(
    <ThemeProvider theme={narutoTheme}>
      <SceneBackdrop sectionIndex={3} spriteX={90} travelMs={720} />
    </ThemeProvider>
  );

  // Keyed by section, so React remounts it and the push animation replays.
  expect(container.querySelector(".scene-dolly")).not.toBe(first);
});

test("pointer parallax listens only where there is a fine pointer", () => {
  const add = jest.spyOn(window, "addEventListener");

  setMedia({ fine: true, calm: false });
  renderScene({});
  expect(add.mock.calls.some(([type]) => type === "pointermove")).toBe(true);

  add.mockClear();
  setMedia({ fine: false, calm: false });
  renderScene({});
  expect(add.mock.calls.some(([type]) => type === "pointermove")).toBe(false);

  add.mockClear();
  setMedia({ fine: true, calm: true });
  renderScene({});
  expect(add.mock.calls.some(([type]) => type === "pointermove")).toBe(false);

  add.mockRestore();
});

test("pointer movement writes CSS variables instead of re-rendering", () => {
  let renders = 0;
  const Counting = () => {
    renders += 1;
    return <SceneBackdrop sectionIndex={0} spriteX={50} travelMs={720} />;
  };

  const { container } = render(
    <ThemeProvider theme={narutoTheme}>
      <Counting />
    </ThemeProvider>
  );
  const before = renders;

  act(() => {
    window.dispatchEvent(
      new MouseEvent("pointermove", { clientX: 800, clientY: 300 })
    );
  });

  // The hook writes to the node directly; a moving pointer must not re-render.
  expect(renders).toBe(before);
  expect(container.querySelector(".scene")).toBeInTheDocument();
});

test("screen-space effects stay outside the 3D stack in both worlds", () => {
  const naruto = renderScene({});
  // The lamp belongs to the room, not to a plane in the scene.
  expect(naruto.container.querySelector(".scene-inner .ember-breathe")).toBeNull();
  expect(naruto.container.querySelector(".ember-breathe")).toBeInTheDocument();
  naruto.unmount();

  const pop = renderScene({}, popTheme);
  expect(pop.container.querySelector(".scene-inner .crt-roll")).toBeNull();
  expect(pop.container.querySelector(".crt-roll")).toBeInTheDocument();
});
