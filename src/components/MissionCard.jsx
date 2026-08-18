import { useThemeTokens } from "../context/theme-context";
import Icon from "./Icon";

/** How many tags fit before the rest collapse into a count. */
export const TAG_LIMIT = 4;

/**
 * One project, as a card that opens the full detail view.
 *
 * The description clamps to three lines and the tag list truncates, so a long
 * write-up or a 17-tag project can no longer stretch the grid. Nothing is lost:
 * the card is a button onto the complete record.
 */
export default function MissionCard({ project, onOpen, openLabel }) {
  const { theme, C } = useThemeTokens();
  const rankSprite =
    theme.id === "pop"
      ? project.rank === "S"
        ? theme.assets.ui.treasureSprite
        : theme.assets.ui.scrollSprite
      : null;
  const { rank, title, desc, tags } = project;
  const overflow = tags.length - TAG_LIMIT;

  return (
    <button
      type="button"
      className="project-card"
      onClick={() => onOpen(project)}
      aria-label={`${title} — open details`}
    >
      <div className="project-head">
        {rankSprite ? (
          <img
            src={rankSprite}
            alt=""
            aria-hidden="true"
            width={22}
            height={22}
            style={{
              imageRendering: "pixelated",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
            }}
          />
        ) : (
          <span className="project-rank" aria-hidden="true">
            {rank}
          </span>
        )}
        <span
          style={{
            fontSize: "0.64rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.muted,
          }}
        >
          Rank {rank}
        </span>
      </div>

      <h3 className="project-name">{title}</h3>
      <p className="project-desc">{desc}</p>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <div className="tag-row">
          {tags.slice(0, TAG_LIMIT).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          {overflow > 0 && (
            <span className="tag tag--more">+{overflow}</span>
          )}
        </div>
        <span className="project-open">
          {openLabel}
          <Icon name="arrowRight" size={13} className="link-arrow" />
        </span>
      </div>
    </button>
  );
}
