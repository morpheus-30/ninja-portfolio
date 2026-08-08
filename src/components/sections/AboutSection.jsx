import { useThemeTokens } from "../../context/theme-context";
import SectionShell from "../SectionShell";
import StatCard from "../StatCard";

export default function AboutSection({ content, isMobile, isTightViewport }) {
  const { theme, C } = useThemeTokens();
  const isGameverse = theme.id === "pop";

  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isGameverse && isTightViewport}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, minmax(0, 1fr))"
            : "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.72rem",
          maxWidth: "860px",
        }}
      >
        {content.stats.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>
      <div
        style={{
          marginTop: "1.2rem",
          maxWidth: "860px",
          color: C.body,
          lineHeight: 1.8,
          fontSize: "1rem",
        }}
      >
        {content.blurb}
      </div>
    </SectionShell>
  );
}
