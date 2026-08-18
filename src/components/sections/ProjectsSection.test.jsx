import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectsSection from "./ProjectsSection";
import { ThemeProvider } from "../../context/theme-context";
import { narutoTheme } from "../../themes/naruto";

// jsdom does not implement the dialog top layer; stub the two calls we rely on
// so the open/close wiring is still exercised.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

const LONG = "Lorem ipsum dolor sit amet consectetur adipiscing elit. ".repeat(16);

const makeContent = (count) => ({
  title: "Mission Board",
  kicker: "Recent Arcs",
  openLabel: "Read Mission Log",
  detailLabels: { rank: "Mission Rank", stack: "Techniques Used", visit: "Open Mission" },
  items: Array.from({ length: count }, (_, i) => ({
    rank: i === 0 ? "S" : "A",
    title: `Project ${i + 1}`,
    desc: i === 0 ? LONG : `Short description ${i + 1}.`,
    tags: i === 0
      ? ["one", "two", "three", "four", "five", "six", "seven"]
      : ["alpha", "beta"],
    link: i === 0 ? "https://example.com/one" : "",
  })),
});

const renderSection = (count) =>
  render(
    <ThemeProvider theme={narutoTheme}>
      <ProjectsSection content={makeContent(count)} isMobile={false} isTightViewport={false} />
    </ThemeProvider>
  );

test("every project renders regardless of count, and the grid owns the scroll", () => {
  renderSection(12);

  expect(screen.getAllByRole("button", { name: /open details/i })).toHaveLength(12);
  // The grid scrolls rather than letting the panel grow past the viewport.
  const grid = document.querySelector(".project-grid");
  expect(grid).toHaveAttribute("data-scrollable");
  expect(grid).toHaveStyle({ maxHeight: "min(48vh, 30rem)" });
});

test("a long description clamps and an overflowing tag list truncates", () => {
  renderSection(12);

  const card = screen.getByRole("button", { name: /Project 1 — open details/i });
  // Full text is in the DOM; the clamp is what keeps the card from stretching.
  const desc = card.querySelector(".project-desc");
  expect(desc.textContent).toBe(LONG);
  // 7 tags -> 4 shown + a "+3" chip.
  expect(within(card).getAllByText(/^(one|two|three|four)$/)).toHaveLength(4);
  expect(within(card).getByText("+3")).toBeInTheDocument();
  expect(within(card).queryByText("five")).not.toBeInTheDocument();
});

test("opening a card reveals the full record, and closing dismisses it", () => {
  renderSection(4);

  expect(document.querySelector("dialog").open).toBe(false);

  userEvent.click(screen.getByRole("button", { name: /Project 1 — open details/i }));

  const dialog = document.querySelector("dialog");
  expect(dialog.open).toBe(true);
  // Nothing is truncated in the detail view: all 7 tags and the live link.
  expect(within(dialog).getByText("five")).toBeInTheDocument();
  expect(within(dialog).getByText("seven")).toBeInTheDocument();
  expect(within(dialog).queryByText("+3")).not.toBeInTheDocument();
  expect(within(dialog).getByRole("link", { name: /Open Mission/i })).toHaveAttribute(
    "href",
    "https://example.com/one"
  );

  userEvent.click(within(dialog).getByRole("button", { name: /close/i }));
  expect(document.querySelector("dialog").open).toBe(false);
});

test("a project without a link shows no dead call to action", () => {
  renderSection(4);

  userEvent.click(screen.getByRole("button", { name: /Project 2 — open details/i }));

  const dialog = document.querySelector("dialog");
  expect(within(dialog).getByText("Project 2")).toBeInTheDocument();
  expect(within(dialog).queryByRole("link")).not.toBeInTheDocument();
});
