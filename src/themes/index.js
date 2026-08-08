import { narutoTheme, buildNarutoTheme } from "./naruto";
import { popTheme, buildPopTheme } from "./pop";

// Static themes for the public portfolio (use published data from src/data/portfolio.js)
export const THEMES = [narutoTheme, popTheme];

export const DEFAULT_THEME_ID = narutoTheme.id;

export function getThemeById(themeId) {
  return THEMES.find((theme) => theme.id === themeId) ?? narutoTheme;
}

// Theme builders for preview mode (accept custom data)
export const THEME_BUILDERS = {
  naruto: buildNarutoTheme,
  pop: buildPopTheme,
};

/**
 * Build all themes using custom data (for preview).
 */
export function buildThemesWithData(data) {
  return [buildNarutoTheme(data), buildPopTheme(data)];
}

export function buildThemeByIdWithData(themeId, data) {
  const builder = THEME_BUILDERS[themeId];
  return builder ? builder(data) : buildNarutoTheme(data);
}
