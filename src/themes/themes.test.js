import { THEMES, getThemeById, buildThemesWithData } from "./index";
import * as portfolioData from "../data/portfolio";

/**
 * Every key the components read, per theme. A theme missing one of these does
 * not crash — it renders the literal string "undefined" into the page, which is
 * exactly the failure that survives a visual check.
 */
const REQUIRED = {
  design: [
    "colors.ink", "colors.ember", "colors.sunset", "colors.gold", "colors.sand",
    "colors.line", "colors.text", "colors.muted",
    "fonts.body", "fonts.display",
    "motion.swapDelayMs", "motion.runDurationMs", "motion.scrollLockMs",
    "motion.sectionEnterMs", "motion.staggerStepMs", "motion.actionDurations.jump",
    "character.frame.w", "character.frame.h", "character.frame.mw", "character.frame.mh",
    "character.default.h",
    "scene.particleCount", "scene.particleSize", "scene.particleRise", "scene.sweepColor",
    "world.grain", "world.grainOpacity", "world.grainBlend", "world.panelClip",
    "world.inkBleed", "world.railLabelColor",
    "world.selectionBackground", "world.scrollThumb", "world.scrollTrack",
    "chrome.appBackground", "chrome.sectionBorder", "chrome.sectionBackground",
    "chrome.sectionShadow", "chrome.sectionTopBar", "chrome.missionCardBorder",
    "chrome.missionCardBackground", "chrome.pillBackground", "chrome.navBackground",
    "chrome.themeButtonBackground", "chrome.inputBackground", "chrome.groundGlow",
    "chrome.contactPendingBackground", "chrome.contactSuccessBackground",
    "chrome.contactErrorBackground", "chrome.helpTooltipBackground",
  ],
  content: [
    "home.title", "home.kicker", "home.intro", "home.paragraphs", "home.ctas",
    "about.title", "about.kicker", "about.stats", "about.blurb",
    "skills.title", "skills.kicker", "skills.groups",
    "projects.title", "projects.kicker", "projects.items", "projects.openLabel",
    "projects.detailLabels.rank", "projects.detailLabels.stack", "projects.detailLabels.visit",
    "contact.title", "contact.kicker", "contact.subject",
    "contact.placeholders.name", "contact.placeholders.email", "contact.placeholders.brief",
    "contact.submitLabel", "contact.loadingLabel",
    "contact.status.pending", "contact.status.success", "contact.status.error",
    "contact.status.pendingDetail", "contact.status.successDetail", "contact.status.errorDetail",
    "controls.switchTheme", "controls.helpTitle", "controls.helpText", "controls.loadingText",
  ],
  assets: [
    "ui.cursor", "ui.focusCursor", "ui.loader", "ui.particleSprite",
    "character.idle", "character.run", "character.jump", "character.crouch",
    "heroProfile", "sectionBackgrounds",
  ],
};

const dig = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

describe.each(THEMES.map((t) => [t.id, t]))("theme %s", (id, theme) => {
  test.each(Object.entries(REQUIRED))("defines every %s key", (root, paths) => {
    const missing = paths.filter((path) => dig(theme[root], path) === undefined);
    expect(missing).toEqual([]);
  });

  test("has one background per section", () => {
    expect(theme.assets.sectionBackgrounds).toHaveLength(theme.sections.length);
  });

  test("every character action resolves to a real asset path", () => {
    Object.entries(theme.assets.character).forEach(([action, src]) => {
      expect(typeof src).toBe("string");
      expect(src).toMatch(/^\/assets\/.+\.(gif|png)$/);
      expect(action).toBeTruthy();
    });
  });

  test("content is derived from the shared data layer, not duplicated", () => {
    expect(theme.content.projects.items).toHaveLength(portfolioData.projects.length);
    expect(theme.content.skills.groups).toHaveLength(portfolioData.skills.length);
    expect(theme.content.home.intro).toBe(portfolioData.bio.intro);
  });

  test("the heart sprites the meter needs exist wherever hearts are used", () => {
    // Only the Gameverse meter renders hearts; it must not reach for a missing asset.
    if (id === "pop") {
      expect(theme.assets.ui.heartFull).toBeDefined();
      expect(theme.assets.ui.heartHalf).toBeDefined();
      expect(theme.assets.ui.heartEmpty).toBeDefined();
      expect(theme.assets.ui.stoneSprite).toBeDefined();
    }
  });
});

test("preview builds stay in sync with the published themes", () => {
  const preview = buildThemesWithData(portfolioData);
  expect(preview.map((t) => t.id)).toEqual(THEMES.map((t) => t.id));
});

test("an unknown theme id falls back rather than returning undefined", () => {
  expect(getThemeById("does-not-exist").id).toBe(THEMES[0].id);
});
