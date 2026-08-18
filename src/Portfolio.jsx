import { useCallback, useMemo, useState } from "react";
import ThemeSelector from "./components/ThemeSelector";
import ThemeLoadingScreen from "./components/ThemeLoadingScreen";
import PortfolioExperience from "./components/PortfolioExperience";
import { ThemeProvider } from "./context/theme-context";
import { THEMES, getThemeById, buildThemesWithData, buildThemeByIdWithData } from "./themes";

/**
 * Portfolio component.
 * @param {{ overrideData?: object }} props
 *   overrideData — if provided, themes are rebuilt with this data (preview mode).
 */
export default function Portfolio({ overrideData }) {
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [pendingThemeId, setPendingThemeId] = useState(null);
  const [isEnteringTheme, setIsEnteringTheme] = useState(false);
  const [isThemeLoading, setIsThemeLoading] = useState(false);

  // Build themes: use override data for preview, or default for public
  const themes = useMemo(
    () => (overrideData ? buildThemesWithData(overrideData) : THEMES),
    [overrideData]
  );

  const activeTheme = useMemo(() => {
    if (!selectedThemeId) return null;
    return overrideData
      ? buildThemeByIdWithData(selectedThemeId, overrideData)
      : getThemeById(selectedThemeId);
  }, [selectedThemeId, overrideData]);

  const loadingTheme = useMemo(() => {
    if (!pendingThemeId) return null;
    return overrideData
      ? buildThemeByIdWithData(pendingThemeId, overrideData)
      : getThemeById(pendingThemeId);
  }, [pendingThemeId, overrideData]);

  const handleThemeSelect = useCallback((themeId) => {
    setPendingThemeId(themeId);
    setIsEnteringTheme(true);

    window.setTimeout(() => {
      setIsThemeLoading(true);
      setIsEnteringTheme(false);
    }, 700);
    // Entry used to fire on a blind 2200ms timer, which is why backgrounds
    // arrived after the scene did. The loading screen now preloads the theme's
    // images and calls handleThemeReady once they can be painted.
  }, []);

  const handleThemeReady = useCallback(() => {
    if (!pendingThemeId) return;
    setSelectedThemeId(pendingThemeId);
    setIsThemeLoading(false);
    setPendingThemeId(null);
  }, [pendingThemeId]);

  const handleSwitchTheme = useCallback(() => {
    setSelectedThemeId(null);
    setPendingThemeId(null);
    setIsEnteringTheme(false);
    setIsThemeLoading(false);
  }, []);

  if (isThemeLoading && loadingTheme) {
    return (
      <ThemeLoadingScreen theme={loadingTheme} onReady={handleThemeReady} />
    );
  }

  if (!activeTheme) {
    return (
      <ThemeSelector
        themes={themes}
        onSelect={handleThemeSelect}
        isEnteringTheme={isEnteringTheme}
        pendingThemeId={pendingThemeId}
      />
    );
  }

  return (
    <ThemeProvider theme={activeTheme}>
      <PortfolioExperience
        activeTheme={activeTheme}
        onSwitchTheme={handleSwitchTheme}
      />
    </ThemeProvider>
  );
}
