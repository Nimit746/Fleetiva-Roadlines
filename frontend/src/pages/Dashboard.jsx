import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/customer/bookings").then(res => setBookings(res.data));
  }, []);

  const logout = () => { localStorage.clear(); window.location.href = "/login"; };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={styles.title}>Customer Dashboard</h2>
          <button onClick={() => navigate("/post-load")} style={styles.button}>Post New Load</button>
        </div>
        
        <h3 style={styles.sectionTitle}>Your Bookings</h3>
        {bookings.map(b => (
          <div key={b._id} style={styles.card}>
            <p style={styles.cardText}><strong>{b.load?.material}</strong> | {b.from} → {b.to}</p>
            <p style={styles.cardText}>Status: <strong style={{color: '#2563eb'}}>{b.status}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    padding: "40px 20px",
  },
  content: {
    width: "100%",
    maxWidth: "800px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    marginBottom: "15px",
    transition: "transform 0.2s",
  },
  cardText: {
    fontSize: "16px",
    color: "#4b5563",
    margin: "5px 0",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  }
};
