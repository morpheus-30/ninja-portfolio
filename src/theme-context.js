import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ theme, children }) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return theme;
}

export function useThemeTokens() {
  const theme = useTheme();

  return {
    theme,
    C: theme.design.colors,
    F: theme.design.fonts,
    MOTION: theme.design.motion,
  };
}
