import { styles } from "./EditorStyles";

export default function ProjectsEditor({ data, onChange }) {
  const updateProject = (index, field, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const updateTags = (index, value) => {
    const tags = value.split(",").map((t) => t.trim()).filter(Boolean);
    updateProject(index, "tags", tags);
  };

  const addProject = () => {
    onChange([...data, { title: "", description: "", tags: [], link: "" }]);
  };

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const moveProject = (index, direction) => {
    const newData = [...data];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newData.length) return;
    [newData[index], newData[targetIndex]] = [newData[targetIndex], newData[index]];
    onChange(newData);
  };

  return (
    <div>
      <h3 style={styles.sectionTitle}>Projects</h3>

      {data.map((project, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>
              {project.title || "Untitled Project"}
            </span>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              <button
                style={styles.buttonSmall}
                onClick={() => moveProject(index, -1)}
                disabled={index === 0}
                title="Move up"
              >
                ↑
              </button>
              <button
                style={styles.buttonSmall}
                onClick={() => moveProject(index, 1)}
                disabled={index === data.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <button
                style={styles.buttonDanger}
                onClick={() => removeProject(index)}
                title="Remove project"
              >
                ✕
              </button>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              value={project.title}
              onChange={(e) => updateProject(index, "title", e.target.value)}
              placeholder="Project name"
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={project.description}
              onChange={(e) => updateProject(index, "description", e.target.value)}
              rows={3}
              placeholder="What does this project do?"
            />
          </div>

          <div style={styles.row}>
            <div style={styles.flex1}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Tags (comma-separated)</label>
                <input
                  style={styles.input}
                  value={project.tags.join(", ")}
                  onChange={(e) => updateTags(index, e.target.value)}
                  placeholder="React, Python, AI"
                />
              </div>
            </div>
            <div style={styles.flex1}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Link</label>
                <input
                  style={styles.input}
                  value={project.link}
                  onChange={(e) => updateProject(index, "link", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button style={styles.button} onClick={addProject}>
        + Add Project
      </button>
    </div>
  );
}
