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

    window.setTimeout(() => {
      setSelectedThemeId(themeId);
      setIsThemeLoading(false);
      setPendingThemeId(null);
    }, 2200);
  }, []);

  const handleSwitchTheme = useCallback(() => {
    setSelectedThemeId(null);
    setPendingThemeId(null);
    setIsEnteringTheme(false);
    setIsThemeLoading(false);
  }, []);

  if (isThemeLoading && loadingTheme) {
    return <ThemeLoadingScreen theme={loadingTheme} />;
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
