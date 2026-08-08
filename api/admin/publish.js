const { requireAuth } = require("../_utils/requireAuth");
const { readDraft, hasDraft } = require("../_utils/draft");
const { generatePortfolioFile } = require("../_utils/generatePortfolioFile");

// ─── Configuration ────────────────────────────────────────────────────────────

const GITHUB_PAT = process.env.GITHUB_PAT;
const REPO_OWNER = "morpheus-30";
const REPO_NAME = "ninja-portfolio";
const FILE_PATH = "src/data/portfolio.js";
const BRANCH = "main";
const COMMIT_MESSAGE = "Update portfolio content";

// ─── Handler ──────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // Only accept POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  // Authenticate and authorize
  const user = requireAuth(req, res);
  if (!user) return; // 401 already sent

  // Verify server config
  if (!GITHUB_PAT) {
    return res.status(500).json({ error: "Publishing is not configured (missing GITHUB_PAT)." });
  }

  // Read draft
  if (!hasDraft()) {
    return res.status(400).json({ error: "No draft to publish. Save a draft first." });
  }

  const draft = readDraft();

  // Validate draft has required fields
  const requiredKeys = ["profile", "bio", "skills", "projects"];
  for (const key of requiredKeys) {
    if (!draft[key]) {
      return res.status(400).json({ error: `Invalid draft: missing "${key}".` });
    }
  }

  // Generate the new file content
  const newContent = generatePortfolioFile(draft);
  const newContentBase64 = Buffer.from(newContent, "utf-8").toString("base64");

  // ─── Step 1: Get current file from GitHub (for SHA + conflict detection) ────

  let currentSha = null;
  let currentContent = null;

  try {
    const getResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_PAT}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!getResponse.ok) {
      const errBody = await getResponse.text();
      return res.status(502).json({
        error: "Failed to read current file from GitHub.",
        details: errBody,
      });
    }

    const fileData = await getResponse.json();
    currentSha = fileData.sha;
    currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
  } catch (err) {
    return res.status(502).json({
      error: "Failed to connect to GitHub API.",
      details: err.message,
    });
  }

  // ─── Step 2: Check if content actually changed ──────────────────────────────

  if (currentContent.trim() === newContent.trim()) {
    return res.status(200).json({
      published: false,
      message: "No changes to publish. Content is already up to date.",
    });
  }

  // ─── Step 3: Commit the update via GitHub Contents API ──────────────────────

  try {
    const putResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_PAT}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          message: COMMIT_MESSAGE,
          content: newContentBase64,
          sha: currentSha,
          branch: BRANCH,
        }),
      }
    );

    if (putResponse.status === 409) {
      return res.status(409).json({
        error: "Conflict: the file was modified since you last loaded it. Please refresh and try again.",
      });
    }

    if (!putResponse.ok) {
      const errBody = await putResponse.text();
      return res.status(502).json({
        error: "Failed to commit to GitHub.",
        details: errBody,
      });
    }

    const commitData = await putResponse.json();

    // ─── Step 4: Clear the draft after successful publish ───────────────────

    try {
      const fs = require("fs");
      const path = require("path");
      const draftPath = path.join("/tmp", "portfolio-draft.json");
      if (fs.existsSync(draftPath)) {
        fs.unlinkSync(draftPath);
      }
    } catch {
      // Non-critical — draft cleanup failure shouldn't fail the publish response
    }

    return res.status(200).json({
      published: true,
      message: "Portfolio content published successfully. Deployment will trigger automatically.",
      commit: {
        sha: commitData.commit?.sha,
        url: commitData.commit?.html_url,
      },
    });
  } catch (err) {
    return res.status(502).json({
      error: "Failed to connect to GitHub API during commit.",
      details: err.message,
    });
  }
};
