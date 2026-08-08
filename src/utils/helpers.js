export function getSectionPoints(sections) {
  return sections.map(
    (_, index) => 10 + (index / Math.max(sections.length - 1, 1)) * 80
  );
}

export function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  const tagName = target.tagName;
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}
