import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [loads, setLoads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [matchingTrucks, setMatchingTrucks] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loadsRes, bookingsRes, usersRes] = await Promise.all([
        api.get("/load/available"),
        api.get("/booking/all"),
        api.get("/users")
      ]);
      setLoads(loadsRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const findMatch = async (loadId) => {
    try {
      const res = await api.get(`/match/${loadId}`);
      setMatchingTrucks(prev => ({ ...prev, [loadId]: res.data }));
    } catch (err) {
      alert("Error finding matches");
    }
  };

  const createBooking = async (loadId, truckId) => {
    try {
      await api.post("/booking/create", { loadId, truckId });
      alert("Booking Created Successfully!");
      fetchData();
      setMatchingTrucks(prev => {
        const next = { ...prev };
        delete next[loadId];
        return next;
      });
    } catch (err) {
      alert("Error creating booking");
    }
  };

  const recordPayment = async (bookingId) => {
    try {
      await api.post(`/booking/${bookingId}/payment`, { status: 'paid' });
      alert("Payment Recorded Successfully!");
      fetchData();
    } catch (err) {
      alert("Error recording payment");
    }
  };

  const downloadBilty = (id) => window.open(`http://127.0.0.1:5001/api/booking/${id}/bilty?token=${localStorage.getItem("accessToken")}`, "_blank");
  const downloadInvoice = (id) => window.open(`http://127.0.0.1:5001/api/booking/${id}/invoice?token=${localStorage.getItem("accessToken")}`, "_blank");

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={styles.title}>Admin Dashboard</h2>
        </div>

        <h3 style={styles.sectionTitle}>User Management</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          {users.map(user => (
            <div 
              key={user._id} 
              style={styles.card}
            >
              <p style={{ margin: 0, fontWeight: '600' }}>{user.name}</p>
              <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6b7280' }}>{user.phone}</p>
              <span style={{ ...styles.roleBadge, backgroundColor: user.role === 'driver' ? '#dcfce7' : '#dbeafe', color: user.role === 'driver' ? '#166534' : '#1e40af' }}>{user.role}</span>
            </div>
          ))}
        </div>

        <h3 style={styles.sectionTitle}>Available Loads</h3>
        {loading ? <p>Loading...</p> : loads.map(load => (
          <div 
            key={load._id} 
            style={{...styles.card, ...(hoveredCard === load._id ? styles.cardHover : {})}}
            onMouseEnter={() => setHoveredCard(load._id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <p style={styles.cardText}><strong>{load.material}</strong> ({load.requiredCapacity}T) | {load.from} → {load.to}</p>
            <button style={styles.button} onClick={() => findMatch(load._id)}>Find Matching Trucks</button>
            {matchingTrucks[load._id]?.map(truck => (
              <div key={truck._id} style={styles.matchItem}>
                {truck.vehicleNumber} ({truck.capacity}T) 
                <button style={styles.smallButton} onClick={() => createBooking(load._id, truck._id)}>Assign Truck</button>
              </div>
            ))}
          </div>
        ))}

        <h3 style={styles.sectionTitle}>Active Bookings</h3>
        {bookings.map(b => (
          <div 
            key={b._id} 
            style={{...styles.card, ...(hoveredCard === b._id ? styles.cardHover : {})}}
            onMouseEnter={() => setHoveredCard(b._id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <p style={styles.cardText}>Booking: {b._id.slice(-6)} | Status: <strong style={{color: '#2563eb'}}>{b.status}</strong> | Payment: <strong>{b.paymentStatus}</strong></p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={styles.secondaryButton} onClick={() => downloadBilty(b._id)}>Download Bilty</button>
              <button style={styles.secondaryButton} onClick={() => downloadInvoice(b._id)}>Download Invoice</button>
              {b.paymentStatus !== 'paid' && (
                <button onClick={() => recordPayment(b._id)} style={styles.paymentButton}>Record Payment</button>
              )}
            </div>
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
    maxWidth: "1000px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    marginTop: "40px",
    marginBottom: "20px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "10px",
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
  roleBadge: {
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '12px',
    textTransform: 'capitalize',
    fontWeight: '600'
  },
  cardText: {
    fontSize: "16px",
    color: "#4b5563",
    marginBottom: "15px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  secondaryButton: {
    padding: "8px 16px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  paymentButton: {
    padding: "8px 16px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    border: "1px solid #a5d6a7",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  matchItem: {
    marginLeft: "20px",
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallButton: {
    padding: "6px 12px",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  }
};
