import { useCallback, useEffect, useState } from "react";
import { fetchDraft, saveDraft, discardDraft } from "./api";
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
  const [error, setError] = useState(null);
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
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handlePreview = useCallback(() => {
    // Save first, then open preview
    if (dirty && draft) {
      saveDraft(draft).then(() => {
        window.open("/admin/preview", "_blank");
      }).catch((err) => setError(err.message));
    } else {
      window.open("/admin/preview", "_blank");
    }
  }, [draft, dirty]);

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
            background: dirty ? "#ffaa00" : "#44cc66",
          }}
        />
        <span style={styles.statusText}>
          {dirty
            ? "Unsaved changes"
            : lastSaved
              ? `Saved ${lastSaved.toLocaleTimeString()}`
              : "No changes"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <button style={styles.button} onClick={handleDiscard}>
            Discard
          </button>
          <button style={styles.button} onClick={handlePreview}>
            Preview
          </button>
          <button
            style={{ ...styles.buttonPrimary, opacity: saving ? 0.6 : 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: "0.6rem 1rem",
          borderRadius: "6px",
          border: "1px solid rgba(255,80,80,0.3)",
          background: "rgba(255,80,80,0.06)",
          color: "#ff7777",
          fontSize: "0.82rem",
          marginBottom: "1rem",
        }}>
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
