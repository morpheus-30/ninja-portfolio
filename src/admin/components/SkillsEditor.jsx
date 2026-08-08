import { styles } from "./EditorStyles";

export default function SkillsEditor({ data, onChange }) {
  const updateCategory = (groupIndex, value) => {
    const newData = [...data];
    newData[groupIndex] = { ...newData[groupIndex], category: value };
    onChange(newData);
  };

  const updateSkill = (groupIndex, skillIndex, field, value) => {
    const newData = [...data];
    const newItems = [...newData[groupIndex].items];
    newItems[skillIndex] = { ...newItems[skillIndex], [field]: value };
    newData[groupIndex] = { ...newData[groupIndex], items: newItems };
    onChange(newData);
  };

  const addSkill = (groupIndex) => {
    const newData = [...data];
    newData[groupIndex] = {
      ...newData[groupIndex],
      items: [...newData[groupIndex].items, { label: "", value: 50, color: "#4f9eff" }],
    };
    onChange(newData);
  };

  const removeSkill = (groupIndex, skillIndex) => {
    const newData = [...data];
    newData[groupIndex] = {
      ...newData[groupIndex],
      items: newData[groupIndex].items.filter((_, i) => i !== skillIndex),
    };
    onChange(newData);
  };

  const addGroup = () => {
    onChange([...data, { category: "New Category", items: [] }]);
  };

  const removeGroup = (groupIndex) => {
    onChange(data.filter((_, i) => i !== groupIndex));
  };

  const moveGroup = (groupIndex, direction) => {
    const newData = [...data];
    const targetIndex = groupIndex + direction;
    if (targetIndex < 0 || targetIndex >= newData.length) return;
    [newData[groupIndex], newData[targetIndex]] = [newData[targetIndex], newData[groupIndex]];
    onChange(newData);
  };

  const moveSkill = (groupIndex, skillIndex, direction) => {
    const newData = [...data];
    const items = [...newData[groupIndex].items];
    const targetIndex = skillIndex + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [items[skillIndex], items[targetIndex]] = [items[targetIndex], items[skillIndex]];
    newData[groupIndex] = { ...newData[groupIndex], items };
    onChange(newData);
  };

  return (
    <div>
      <h3 style={styles.sectionTitle}>Skills</h3>

      {data.map((group, groupIndex) => (
        <div key={groupIndex} style={styles.card}>
          <div style={styles.cardHeader}>
            <input
              style={{ ...styles.input, maxWidth: "300px", fontWeight: 500 }}
              value={group.category}
              onChange={(e) => updateCategory(groupIndex, e.target.value)}
              placeholder="Category name"
            />
            <div style={{ display: "flex", gap: "0.3rem" }}>
              <button
                style={styles.buttonSmall}
                onClick={() => moveGroup(groupIndex, -1)}
                disabled={groupIndex === 0}
                title="Move up"
              >
                ↑
              </button>
              <button
                style={styles.buttonSmall}
                onClick={() => moveGroup(groupIndex, 1)}
                disabled={groupIndex === data.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <button
                style={styles.buttonDanger}
                onClick={() => removeGroup(groupIndex)}
                title="Remove group"
              >
                ✕
              </button>
            </div>
          </div>

          {group.items.map((skill, skillIndex) => (
            <div key={skillIndex} style={{ ...styles.row, marginBottom: "0.5rem" }}>
              <input
                style={{ ...styles.input, flex: 2 }}
                value={skill.label}
                onChange={(e) => updateSkill(groupIndex, skillIndex, "label", e.target.value)}
                placeholder="Skill name"
              />
              <input
                type="number"
                min="0"
                max="100"
                style={{ ...styles.input, flex: 0, width: "60px" }}
                value={skill.value}
                onChange={(e) => updateSkill(groupIndex, skillIndex, "value", parseInt(e.target.value) || 0)}
              />
              <input
                type="color"
                style={{ width: "36px", height: "36px", border: "none", borderRadius: "4px", cursor: "pointer", background: "transparent" }}
                value={skill.color}
                onChange={(e) => updateSkill(groupIndex, skillIndex, "color", e.target.value)}
              />
              <div style={{ display: "flex", gap: "0.2rem" }}>
                <button
                  style={styles.buttonSmall}
                  onClick={() => moveSkill(groupIndex, skillIndex, -1)}
                  disabled={skillIndex === 0}
                >
                  ↑
                </button>
                <button
                  style={styles.buttonSmall}
                  onClick={() => moveSkill(groupIndex, skillIndex, 1)}
                  disabled={skillIndex === group.items.length - 1}
                >
                  ↓
                </button>
                <button
                  style={styles.buttonDanger}
                  onClick={() => removeSkill(groupIndex, skillIndex)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <button style={styles.buttonSmall} onClick={() => addSkill(groupIndex)}>
            + Add Skill
          </button>
        </div>
      ))}

      <button style={styles.button} onClick={addGroup}>
        + Add Skill Group
      </button>
    </div>
  );
}
