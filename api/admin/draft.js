const { requireAuth } = require("../_utils/requireAuth");
const { readDraft, writeDraft, hasDraft } = require("../_utils/draft");

module.exports = function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const draft = readDraft();
    return res.status(200).json({
      data: draft,
      hasDraft: hasDraft(),
    });
  }

  if (req.method === "PUT") {
    try {
      const data = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid draft data." });
      }

      // Validate required top-level keys
      const requiredKeys = ["profile", "bio", "skills", "projects"];
      for (const key of requiredKeys) {
        if (!(key in data)) {
          return res.status(400).json({ error: `Missing required field: ${key}` });
        }
      }

      writeDraft(data);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Failed to save draft." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const fs = require("fs");
      const path = require("path");
      const draftPath = path.join("/tmp", "portfolio-draft.json");
      if (fs.existsSync(draftPath)) {
        fs.unlinkSync(draftPath);
      }
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Failed to discard draft." });
    }
  }

  res.status(405).json({ error: "Method not allowed." });
};
