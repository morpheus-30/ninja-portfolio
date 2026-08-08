import { styles } from "./EditorStyles";

export default function ProfileEditor({ data, onChange }) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    { key: "name", label: "Full Name" },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
    { key: "title", label: "Job Title" },
    { key: "primarySkills", label: "Primary Skills" },
    { key: "experience", label: "Experience" },
    { key: "focus", label: "Current Focus" },
    { key: "hobbies", label: "Hobbies" },
  ];

  return (
    <div>
      <h3 style={styles.sectionTitle}>Profile Information</h3>
      {fields.map(({ key, label }) => (
        <div key={key} style={styles.fieldGroup}>
          <label style={styles.label}>{label}</label>
          <input
            style={styles.input}
            value={data[key] || ""}
            onChange={(e) => update(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
