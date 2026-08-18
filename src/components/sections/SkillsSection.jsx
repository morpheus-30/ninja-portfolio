import SectionShell from "../SectionShell";
import SkillBar from "../SkillBar";

export default function SkillsSection({ content, isMobile, isTightViewport }) {
  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isTightViewport}
    >
      <div
        className="rise-stagger"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
          gap: isMobile ? "1.3rem" : "2.2rem",
          width: "100%",
          alignItems: "start",
        }}
      >
        {content.groups.map((group) => (
          <div key={group.title}>
            <p className="group-heading">{group.title}</p>
            {group.skills.map((skill) => (
              <SkillBar
                key={skill.label}
                label={skill.label}
                value={skill.value}
                color={skill.color}
              />
            ))}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
