import { narutoTheme } from "./naruto";
import { popTheme } from "./pop";

export const THEMES = [narutoTheme, popTheme];

export const DEFAULT_THEME_ID = narutoTheme.id;

export function getThemeById(themeId) {
  return THEMES.find((theme) => theme.id === themeId) ?? narutoTheme;
}
