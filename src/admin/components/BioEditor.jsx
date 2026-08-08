import { styles } from "./EditorStyles";

export default function BioEditor({ data, onChange }) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const updateParagraph = (index, value) => {
    const newParagraphs = [...data.paragraphs];
    newParagraphs[index] = value;
    onChange({ ...data, paragraphs: newParagraphs });
  };

  const addParagraph = () => {
    onChange({ ...data, paragraphs: [...data.paragraphs, ""] });
  };

  const removeParagraph = (index) => {
    const newParagraphs = data.paragraphs.filter((_, i) => i !== index);
    onChange({ ...data, paragraphs: newParagraphs });
  };

  return (
    <div>
      <h3 style={styles.sectionTitle}>Bio & Introduction</h3>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Headline</label>
        <input
          style={styles.input}
          value={data.headline || ""}
          onChange={(e) => update("headline", e.target.value)}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Intro (short summary)</label>
        <textarea
          style={styles.textarea}
          value={data.intro || ""}
          onChange={(e) => update("intro", e.target.value)}
          rows={3}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>About Paragraphs</label>
        {data.paragraphs.map((paragraph, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <textarea
                style={{ ...styles.textarea, flex: 1 }}
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                rows={3}
              />
              <button
                style={styles.buttonDanger}
                onClick={() => removeParagraph(index)}
                title="Remove paragraph"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button style={styles.buttonSmall} onClick={addParagraph}>
          + Add Paragraph
        </button>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Blurb (about section extended text)</label>
        <textarea
          style={{ ...styles.textarea, minHeight: "100px" }}
          value={data.blurb || ""}
          onChange={(e) => update("blurb", e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
