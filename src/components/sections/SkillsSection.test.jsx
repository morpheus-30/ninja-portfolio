import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import SkillsSection from "./SkillsSection";
import { ThemeProvider } from "../../context/theme-context";
import { narutoTheme } from "../../themes/naruto";
import { popTheme } from "../../themes/pop";
import * as data from "../../data/portfolio";

const makeContent = (groupCount, perGroup) => ({
  title: "Jutsu Arsenal",
  kicker: "Power Levels",
  groups: Array.from({ length: groupCount }, (_, g) => ({
    title: `Group ${g + 1}`,
    skills: Array.from({ length: perGroup }, (_, i) => ({
      label: `Skill ${g + 1}.${i + 1}`,
      value: 50 + i,
      color: "#d85a1a",
    })),
  })),
});

const renderSkills = (content, theme = narutoTheme, isMobile = false) =>
  render(
    <ThemeProvider theme={theme}>
      <SkillsSection content={content} isMobile={isMobile} isTightViewport={false} />
    </ThemeProvider>
  );

test.each([
  [1, 4],
  [2, 6],
  [4, 12],
  [7, 5],
])("lays out %i groups of %i without dropping anything", (groups, per) => {
  renderSkills(makeContent(groups, per));

  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(groups);
  expect(document.querySelectorAll(".meter-row")).toHaveLength(groups * per);

  // Columns are width-derived, so no group count is special-cased.
  const container = document.querySelector(".skill-groups");
  expect(container).toBeInTheDocument();
  expect(container).toHaveAttribute("data-scrollable");
});

test("a long list scrolls inside the panel instead of overflowing it", () => {
  renderSkills(makeContent(4, 12));
  const container = document.querySelector(".skill-groups");

  expect(container).toHaveStyle({ maxHeight: "min(52vh, 32rem)" });
  // Tightens rows once the list is long.
  expect(container).toHaveClass("is-dense");
});

test("a short list keeps full-size rows", () => {
  renderSkills(makeContent(2, 6));
  expect(document.querySelector(".skill-groups")).not.toHaveClass("is-dense");
});

test("mobile lets the panel own the scroll rather than capping the list", () => {
  renderSkills(makeContent(4, 12), narutoTheme, true);
  expect(document.querySelector(".skill-groups")).toHaveStyle({ maxHeight: "none" });
});

test("Gameverse gives every category its own title", () => {
  // Regression: titles were chosen by index, so every group after the first was
  // labelled "Programming Arsenal".
  const titles = popTheme.content.skills.groups.map((g) => g.title);

  expect(new Set(titles).size).toBe(titles.length);
  expect(titles.filter((t) => t === "Programming Arsenal").length).toBeLessThan(2);
});

test("an unrecognised category keeps its own name rather than being mislabelled", () => {
  const { buildPopTheme } = require("../../themes/pop");
  const themed = buildPopTheme({
    ...data,
    skills: [{ category: "Quantum Ops", items: [{ label: "Qiskit", value: 40, color: "#fff" }] }],
  });

  expect(themed.content.skills.groups[0].title).toBe("Quantum Ops");
});

test("renders the real portfolio data in both worlds", () => {
  for (const theme of [narutoTheme, popTheme]) {
    const { unmount } = renderSkills(theme.content.skills, theme);

    const total = data.skills.reduce((n, g) => n + g.items.length, 0);
    expect(document.querySelectorAll(".meter-row")).toHaveLength(total);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(data.skills.length);
    unmount();
  }
});

test("long skill labels stay in their row", () => {
  const content = makeContent(1, 1);
  content.groups[0].skills[0].label = "Chrome Extensions (Manifest V3)";
  renderSkills(content);

  const row = document.querySelector(".meter-row");
  expect(within(row).getByText("Chrome Extensions (Manifest V3)")).toHaveClass("meter-label");
  expect(within(row).getByText("50%")).toBeInTheDocument();
});
