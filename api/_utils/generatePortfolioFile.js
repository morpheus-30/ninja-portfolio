/**
 * Generates the contents of src/data/portfolio.js from structured data.
 * Output must be a valid ES module that exports: profile, bio, skills, projects.
 */

function stringify(value, indent = 2) {
  return JSON.stringify(value, null, indent);
}

function generatePortfolioFile(data) {
  const { profile, bio, skills, projects } = data;

  return `/**
 * Core portfolio data — independent of any theme's visual presentation.
 *
 * Themes import this data and map it into their own labels/structure.
 * This file is managed by the admin editor. Do not edit manually.
 */

export const profile = ${stringify(profile)};

export const bio = ${stringify(bio)};

export const skills = ${stringify(skills)};

export const projects = ${stringify(projects)};
`;
}

module.exports = { generatePortfolioFile };
