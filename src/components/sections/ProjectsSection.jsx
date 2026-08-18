import { useCallback, useState } from "react";
import SectionShell from "../SectionShell";
import MissionCard from "../MissionCard";
import ProjectDialog from "../ProjectDialog";

export default function ProjectsSection({ content, isMobile, isTightViewport }) {
  const [openProject, setOpenProject] = useState(null);
  const closeProject = useCallback(() => setOpenProject(null), []);

  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isTightViewport}
      contentFills
    >
      {/* The grid scrolls inside the panel, so project count never breaks the
          layout — six or sixteen entries look the same from outside. */}
      <div
        className="project-grid rise-stagger"
        data-scrollable=""
        style={{ maxHeight: isMobile ? "none" : "min(48vh, 30rem)" }}
      >
        {content.items.map((project) => (
          <MissionCard
            key={project.title}
            project={project}
            onOpen={setOpenProject}
            openLabel={content.openLabel}
          />
        ))}
      </div>

      <ProjectDialog
        project={openProject}
        onClose={closeProject}
        labels={content.detailLabels}
      />
    </SectionShell>
  );
}
