import { useThemeTokens } from "../../context/theme-context";
import SectionShell from "../SectionShell";

export default function AboutSection({ content, isMobile, isTightViewport }) {
  const { C } = useThemeTokens();

  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isTightViewport}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.15fr) minmax(0, 1fr)",
          gap: isMobile ? "1.1rem" : "2.2rem",
          alignItems: "start",
        }}
      >
        {/* A character sheet is a ledger of facts, so it reads as rows with
            hairline rules — not eight boxes nested inside the panel box. */}
        <dl className="ledger rise-stagger">
          {content.stats.map(([label, value]) => (
            <div className="ledger-row" key={label}>
              <dt className="ledger-key">{label}</dt>
              <dd className="ledger-value">{value}</dd>
            </div>
          ))}
        </dl>

        <p
          style={{
            color: C.muted,
            lineHeight: 1.85,
            fontSize: isMobile ? "0.95rem" : "1rem",
            maxWidth: "62ch",
            borderLeft: `1px solid ${C.line}`,
            paddingLeft: isMobile ? "0.9rem" : "1.3rem",
          }}
        >
          {content.blurb}
        </p>
      </div>
    </SectionShell>
  );
}
