import { useCallback, useEffect, useState } from "react";
import { fetchDraft, saveDraft, discardDraft, publishDraft } from "./api";
import { styles } from "./components/EditorStyles";
import ProfileEditor from "./components/ProfileEditor";
import BioEditor from "./components/BioEditor";
import SkillsEditor from "./components/SkillsEditor";
import ProjectsEditor from "./components/ProjectsEditor";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "bio", label: "Bio" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);

  // Load draft on mount
  useEffect(() => {
    fetchDraft()
      .then((result) => {
        setDraft(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = useCallback((section, value) => {
    setDraft((prev) => ({ ...prev, [section]: value }));
    setDirty(true);
    setSuccessMessage(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      await saveDraft(draft);
      setLastSaved(new Date());
      setDirty(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [draft, saving]);

  const handleDiscard = useCallback(async () => {
    if (!window.confirm("Discard all draft changes and revert to published content?")) return;
    try {
      await discardDraft();
      const result = await fetchDraft();
      setDraft(result.data);
      setDirty(false);
      setLastSaved(null);
      setSuccessMessage(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handlePreview = useCallback(() => {
    if (dirty && draft) {
      saveDraft(draft).then(() => {
        setDirty(false);
        setLastSaved(new Date());
        window.open("/admin/preview", "_blank");
      }).catch((err) => setError(err.message));
    } else {
      window.open("/admin/preview", "_blank");
    }
  }, [draft, dirty]);

  const handlePublish = useCallback(async () => {
    if (publishing) return;

    // If there are unsaved changes, save first
    if (dirty && draft) {
      try {
        await saveDraft(draft);
        setDirty(false);
        setLastSaved(new Date());
      } catch (err) {
        setError(err.message);
        return;
      }
    }

    if (!window.confirm("Publish changes to the live portfolio?")) return;

    setPublishing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await publishDraft();

      if (result.published) {
        setSuccessMessage("Published successfully. Deployment triggered.");
        setDirty(false);
        setLastSaved(null);
        // Reload draft (now returns default since draft was cleared)
        const freshDraft = await fetchDraft();
        setDraft(freshDraft.data);
      } else {
        // No changes to publish
        setSuccessMessage(result.message || "No changes to publish.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  }, [draft, dirty, publishing]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
        Loading portfolio data...
      </div>
    );
  }

  if (!draft) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#ff7777" }}>
        {error || "Failed to load draft data."}
      </div>
    );
  }

  return (
    <div>
      {/* Status bar */}
      <div style={styles.statusBar}>
        <div
          style={{
            ...styles.statusDot,
            background: publishing
              ? "#4f9eff"
              : dirty
                ? "#ffaa00"
                : "#44cc66",
          }}
        />
        <span style={styles.statusText}>
          {publishing
            ? "Publishing..."
            : dirty
              ? "Unsaved changes"
              : lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString()}`
                : "No changes"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <button style={styles.button} onClick={handleDiscard} disabled={publishing}>
            Discard
          </button>
          <button style={styles.button} onClick={handlePreview} disabled={publishing}>
            Preview
          </button>
          <button
            style={{ ...styles.buttonPrimary, opacity: saving ? 0.6 : 1 }}
            onClick={handleSave}
            disabled={saving || publishing}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            style={{
              ...publishButtonStyle,
              opacity: publishing ? 0.6 : 1,
            }}
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div style={successBoxStyle}>
          ✓ {successMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={errorBoxStyle}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor content */}
      {activeTab === "profile" && (
        <ProfileEditor
          data={draft.profile}
          onChange={(value) => handleChange("profile", value)}
        />
      )}
      {activeTab === "bio" && (
        <BioEditor
          data={draft.bio}
          onChange={(value) => handleChange("bio", value)}
        />
      )}
      {activeTab === "skills" && (
        <SkillsEditor
          data={draft.skills}
          onChange={(value) => handleChange("skills", value)}
        />
      )}
      {activeTab === "projects" && (
        <ProjectsEditor
          data={draft.projects}
          onChange={(value) => handleChange("projects", value)}
        />
      )}
    </div>
  );
}

// ─── Additional styles ────────────────────────────────────────────────────────

const publishButtonStyle = {
  padding: "0.55rem 1rem",
  borderRadius: "6px",
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontSize: "0.82rem",
  fontWeight: 500,
  cursor: "pointer",
};

const successBoxStyle = {
  padding: "0.6rem 1rem",
  borderRadius: "6px",
  border: "1px solid rgba(34,197,94,0.35)",
  background: "rgba(34,197,94,0.08)",
  color: "#4ade80",
  fontSize: "0.82rem",
  marginBottom: "1rem",
};

const errorBoxStyle = {
  padding: "0.6rem 1rem",
  borderRadius: "6px",
  border: "1px solid rgba(255,80,80,0.3)",
  background: "rgba(255,80,80,0.06)",
  color: "#ff7777",
  fontSize: "0.82rem",
  marginBottom: "1rem",
};
