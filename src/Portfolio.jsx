import { useCallback, useState } from "react";
import ThemeSelector from "./components/ThemeSelector";
import ThemeLoadingScreen from "./components/ThemeLoadingScreen";
import PortfolioExperience from "./components/PortfolioExperience";
import { ThemeProvider } from "./context/theme-context";
import { THEMES, getThemeById } from "./themes";

export default function Portfolio() {
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [pendingThemeId, setPendingThemeId] = useState(null);
  const [isEnteringTheme, setIsEnteringTheme] = useState(false);
  const [isThemeLoading, setIsThemeLoading] = useState(false);
  const activeTheme = selectedThemeId ? getThemeById(selectedThemeId) : null;
  const loadingTheme = pendingThemeId ? getThemeById(pendingThemeId) : null;

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
        themes={THEMES}
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
