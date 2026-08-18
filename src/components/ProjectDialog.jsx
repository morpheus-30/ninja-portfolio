import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useThemeTokens } from "../context/theme-context";
import Icon from "./Icon";

/**
 * Full project record in a native <dialog>.
 *
 * showModal() gives Escape-to-close, a focus trap, an inert background and
 * ::backdrop for free — all the things a hand-rolled overlay gets wrong.
 *
 * Portalled to <body>: the panel it logically belongs to is clipped and
 * animated, and an ancestor clip-path or transform is exactly what breaks a
 * top-layer element's positioning.
 */
export default function ProjectDialog({ project, onClose, labels }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();

    // Escape and the close button both fire `close`; sync React state from it
    // rather than tracking each path separately.
    const onNativeClose = () => onClose();
    dialog.addEventListener("close", onNativeClose);
    return () => dialog.removeEventListener("close", onNativeClose);
  }, [project, onClose]);

  const { theme, C, F } = useThemeTokens();

  return createPortal(
    <dialog
      ref={dialogRef}
      className="project-dialog"
      data-theme={theme.id}
      // Clicking the backdrop targets the dialog itself, not its contents.
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      {project && (
        <div className="dialog-body">
          <button
            type="button"
            className="dialog-close"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
          >
            <Icon name="close" size={15} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              paddingRight: "2.5rem",
            }}
          >
            <span className="project-rank" aria-hidden="true">
              {project.rank}
            </span>
            <span
              style={{
                fontSize: "0.66rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.muted,
              }}
            >
              {labels.rank} {project.rank}
            </span>
          </div>

          <h3
            className="display-title"
            style={{
              fontFamily: F.display,
              fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
              lineHeight: 1,
              textTransform: "uppercase",
              color: C.text,
            }}
          >
            {project.title}
          </h3>

          <p className="dialog-desc">{project.desc}</p>

          <div style={{ display: "grid", gap: "0.45rem" }}>
            <span
              style={{
                fontSize: "0.64rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.gold,
              }}
            >
              {labels.stack}
            </span>
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {project.link && (
            <a
              className="dialog-link"
              href={project.link}
              target="_blank"
              rel="noreferrer"
            >
              {labels.visit}
              <Icon name="external" size={14} className="link-arrow" />
            </a>
          )}
        </div>
      )}
    </dialog>,
    document.body
  );
}
