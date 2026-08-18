import { buildGlobalStyles } from "./globalStyles";
import { narutoTheme } from "../themes/naruto";
import { popTheme } from "../themes/pop";

const build = (theme) =>
  buildGlobalStyles({
    assets: theme.assets,
    C: theme.design.colors,
    MOTION: theme.design.motion,
    UI: theme.design.chrome,
    W: theme.design.world,
  });

test.each([
  ["naruto", narutoTheme],
  ["pop", popTheme],
])("%s stylesheet resolves every token it interpolates", (_name, theme) => {
  const css = build(theme);

  // An unresolved token silently ships as the literal string "undefined".
  expect(css).not.toMatch(/undefined|NaN|\$\{/);

  const open = (css.match(/{/g) || []).length;
  const close = (css.match(/}/g) || []).length;
  expect(open).toBe(close);
});

test.each([
  ["naruto", narutoTheme],
  ["pop", popTheme],
])("%s stylesheet carries the motion system and browser surfaces", (_name, theme) => {
  const css = build(theme);

  for (const rule of [
    ".section-enter-left",
    ".rise-stagger",
    "prefers-reduced-motion",
    "::selection",
    "caret-color",
    "::-webkit-scrollbar-thumb",
    ":focus-visible",
    ".project-dialog::backdrop",
    ".ledger-row",
    ".meter-track",
  ]) {
    expect(css).toContain(rule);
  }
  expect(css).toContain("animation-delay: calc(var(--step) * 13)");
});

test("no eyebrow: the kicker never renders as a heading label", () => {
  // Both worlds must give the section label a structural home — a margin rail
  // or a HUD bar — rather than stacking it above the title.
  expect(build(narutoTheme)).toContain(".panel-rail");
  expect(build(popTheme)).toContain(".hud-bar");
});

test("elastic easing stays out of the system", () => {
  for (const theme of [narutoTheme, popTheme]) {
    const css = build(theme);
    // A cubic-bezier whose y overshoots 1 is a bounce curve.
    const overshoot = [...css.matchAll(/cubic-bezier\(([^)]+)\)/g)].filter((m) => {
      const [, y1, , y2] = m[1].split(",").map(Number);
      return y1 > 1.001 || y2 > 1.001;
    });
    expect(overshoot).toHaveLength(0);
  }
});

