import { useState } from "react";
import api from "../api/axios";

export default function PostTruck() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const postTruck = async () => {
    try {
      await api.post("/truck/post", {
        vehicleNumber,
        capacity: Number(capacity), // Ensure numeric value
        vehicleType,
        currentLocation
      });
      alert("Truck Posted Successfully");
      setVehicleNumber("");
      setCapacity("");
      setVehicleType("");
      setCurrentLocation("");
    } catch (err) {
      alert("Failed to post truck.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Post Available Truck</h2>
          <p style={styles.subtitle}>List your vehicle to receive load assignments</p>
        </div>
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Vehicle Number</label>
            <input style={styles.input} placeholder="e.g. MH12AB1234" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Capacity (Tons)</label>
            <input style={styles.input} placeholder="e.g. 12" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Vehicle Type</label>
            <input style={styles.input} placeholder="e.g. 10-Wheeler" value={vehicleType} onChange={e => setVehicleType(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Current Location</label>
            <input style={styles.input} placeholder="e.g. Pune" value={currentLocation} onChange={e => setCurrentLocation(e.target.value)} />
          </div>
          <button onClick={postTruck} style={styles.button}>Post Truck Availability</button>
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
