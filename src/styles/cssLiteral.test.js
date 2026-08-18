import fs from "fs";
import path from "path";

/**
 * Deliberately imports nothing from the module it checks.
 *
 * A stray backtick inside the CSS template literal terminates the string, and
 * babel then reports the failure at an unrelated line ("Invalid left-hand side
 * in postfix operation"). Any test that imports globalStyles.js cannot run at
 * all in that state, so this one reads the source as text instead and names the
 * real problem.
 */
const SOURCE = path.join(__dirname, "globalStyles.js");

test("the CSS template literal contains no stray backticks", () => {
  const source = fs.readFileSync(SOURCE, "utf8");
  const start = source.indexOf("return `");
  expect(start).toBeGreaterThan(-1);

  const literal = source.slice(start + "return `".length);
  const body = literal.slice(0, literal.lastIndexOf("`"));
  const line = body.split("\n").findIndex((l) => l.includes("`"));

  expect(line).toBe(-1);
});

test("every interpolation in the literal is closed", () => {
  const source = fs.readFileSync(SOURCE, "utf8");
  const opens = (source.match(/\$\{/g) || []).length;
  // Each ${ must have a matching }; an unbalanced one breaks the whole sheet.
  expect(opens).toBeGreaterThan(0);
  expect(source).not.toMatch(/\$\{[^}]*$/);
});
