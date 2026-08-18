/**
 * Authored icons — one consistent 1.6 stroke on a 24 grid.
 *
 * Small enough that a library would be more weight than it saves, and a unicode
 * glyph (↗, ✕) would inherit the text font's metrics instead of matching.
 */
const PATHS = {
  external: "M14 4h6v6M20 4l-9 9M17 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5",
  close: "M6 6l12 12M18 6L6 18",
  arrowRight: "M4 12h15M13 6l6 6-6 6",
};

export default function Icon({ name, size = 16, className, style }) {
  const d = PATHS[name];
  if (!d) return null;

  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
