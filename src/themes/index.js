import { narutoTheme } from "./naruto";

export const THEMES = [narutoTheme];

export const DEFAULT_THEME_ID = narutoTheme.id;

export function getThemeById(themeId) {
  return THEMES.find((theme) => theme.id === themeId) ?? narutoTheme;
}
