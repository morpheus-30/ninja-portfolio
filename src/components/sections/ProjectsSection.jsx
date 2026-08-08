import { useThemeTokens } from "../../context/theme-context";
import SectionShell from "../SectionShell";
import MissionCard from "../MissionCard";

export default function ProjectsSection({ content, isMobile, isTightViewport }) {
  const { theme } = useThemeTokens();
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
            ? "1fr"
            : "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {content.items.map((project) => (
          <MissionCard key={project.title} {...project} />
        ))}
      </div>
    </SectionShell>
  );
}
