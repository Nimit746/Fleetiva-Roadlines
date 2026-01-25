import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    api.get("/driver/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/booking/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={styles.title}>Driver Dashboard</h2>
        </div>
        {loading ? <p>Loading bookings...</p> : bookings.length > 0 ? bookings.map(b => (
          <div 
            key={b._id} 
            style={{...styles.card, ...(hoveredCard === b._id ? styles.cardHover : {})}}
            onMouseEnter={() => setHoveredCard(b._id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <p style={styles.cardText}><strong>{b.from} → {b.to}</strong></p>
            <p style={styles.cardText}>Status: <strong style={{color: '#2563eb'}}>{b.status}</strong></p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {b.status === "assigned" && <button style={styles.button} onClick={() => updateStatus(b._id, "in-transit")}>Start Trip</button>}
              {b.status === "in-transit" && <button style={styles.button} onClick={() => updateStatus(b._id, "delivered")}>Mark Delivered</button>}
            </div>
          </div>
        )) : <p>No active bookings found.</p>}
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
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    marginBottom: "15px",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  cardText: {
    fontSize: "16px",
    color: "#4b5563",
    marginBottom: "10px",
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
