import SectionShell from "../SectionShell";
import SkillBar from "../SkillBar";

/**
 * Above this many meters the rows tighten, so a long list stays inside the
 * panel instead of pushing past it.
 */
const DENSE_THRESHOLD = 18;

export default function SkillsSection({ content, isMobile, isTightViewport }) {
  const total = content.groups.reduce(
    (count, group) => count + group.skills.length,
    0
  );

  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isTightViewport}
      contentFills
    >
      {/* Columns are derived from available width, not a fixed count, so any
          number of groups lays out; the container scrolls so any number of
          items fits. */}
      <div
        className={`skill-groups rise-stagger${
          total > DENSE_THRESHOLD ? " is-dense" : ""
        }`}
        data-scrollable=""
        style={{ maxHeight: isMobile ? "none" : "min(52vh, 32rem)" }}
      >
        {content.groups.map((group, index) => (
          <section className="skill-group" key={`${group.title}-${index}`}>
            <h3 className="group-heading">{group.title}</h3>
            {group.skills.map((skill) => (
              <SkillBar
                key={skill.label}
                label={skill.label}
                value={skill.value}
                color={skill.color}
              />
            ))}
          </section>
        ))}
      </div>
    </SectionShell>
  );
}
