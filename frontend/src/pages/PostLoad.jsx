import { useState } from "react";
import api from "../api/axios";

export default function PostLoad() {
  const [material, setMaterial] = useState("");
  const [capacity, setCapacity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const postLoad = async () => {
    try {
      await api.post("/load/post", {
        material,
        requiredCapacity: Number(capacity), // Ensure numeric value
        from,
        to
      });
      alert("Load Posted Successfully");
      setMaterial("");
      setCapacity("");
      setFrom("");
      setTo("");
    } catch (err) {
      alert("Failed to post load. Please check your inputs.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Post New Load</h2>
          <p style={styles.subtitle}>Enter cargo details to find matching trucks</p>
        </div>
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Material Name</label>
            <input style={styles.input} placeholder="e.g. Steel Pipes" value={material} onChange={e => setMaterial(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Required Capacity (Tons)</label>
            <input style={styles.input} placeholder="e.g. 10" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Origin City</label>
            <input style={styles.input} placeholder="e.g. Delhi" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Destination City</label>
            <input style={styles.input} placeholder="e.g. Mumbai" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <button onClick={postLoad} style={styles.button}>Submit Load</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px"
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0"
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151"
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.1s",
    marginTop: "10px",
    ":active": {
      transform: "scale(0.98)"
    }
  }
};
