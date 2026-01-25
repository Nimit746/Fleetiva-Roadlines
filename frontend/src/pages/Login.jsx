import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { phone, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "driver") navigate("/driver");
      else navigate("/");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div 
        style={{
          ...styles.card, 
          ...(isHovered ? styles.cardHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to manage your logistics</p>
        </div>
        <form onSubmit={login} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              placeholder="Enter your phone"
              type="tel"
              required
              style={styles.input}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              placeholder="Enter your password"
              type="password"
              required
              style={styles.input}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
        <p style={styles.footerText}>
          <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
        </p>
        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    padding: "20px",
    boxSizing: "border-box"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
    transition: "border-color 0.2s",
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
    transition: "background-color 0.2s",
    marginTop: "10px"
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed"
  },
  footerText: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    color: "#4b5563"
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500"
  }
};
