import { useThemeTokens } from "../../context/theme-context";
import SectionShell from "../SectionShell";
import SkillBar from "../SkillBar";

export default function SkillsSection({ content, isMobile, isTightViewport }) {
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
            ? "1fr"
            : "repeat(2, minmax(0, 1fr))",
          gap: isGameverse && isTightViewport ? "0.58rem" : "0.95rem",
          width: "100%",
          alignItems: "start",
        }}
      >
        {content.groups.map((group) => (
          <div
            key={group.title}
            style={{
              padding: isGameverse
                ? isMobile
                  ? "0.86rem 0.9rem"
                  : isTightViewport
                    ? "0.58rem 0.64rem"
                    : "0.9rem"
                : 0,
              borderRadius: isGameverse ? "14px" : 0,
              border: isGameverse
                ? "1px solid rgba(240, 214, 175, 0.22)"
                : "none",
              background: isGameverse
                ? "linear-gradient(180deg, rgba(22,17,13,0.42) 0%, rgba(10,7,6,0.56) 100%)"
                : "transparent",
              boxShadow: isGameverse
                ? "inset 0 1px 0 rgba(255,241,216,0.08), 0 12px 22px rgba(0,0,0,0.12)"
                : "none",
            }}
          >
            <p
              style={{
                color: C.gold,
                marginBottom:
                  isGameverse && isTightViewport ? "0.42rem" : "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: isGameverse
                  ? isTightViewport
                    ? "0.72rem"
                    : "0.84rem"
                  : undefined,
              }}
            >
              {group.title}
            </p>
            {group.skills.map((skill) => (
              <SkillBar
                key={skill.label}
                label={skill.label}
                value={skill.value}
                color={skill.color}
                compact={isGameverse && isTightViewport}
              />
            ))}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
