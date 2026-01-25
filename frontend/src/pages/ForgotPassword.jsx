import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("request"); // "request" or "reset"
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate("/login");
    }
    return () => clearInterval(timer);
  }, [success, countdown, navigate]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { phone });
      setStep("reset");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { phone, otp, newPassword });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
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
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.subtitle}>Recover access to your account</p>
        </div>

        {success ? (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.title}>Password Reset!</h2>
            <p style={styles.subtitle}>
              Redirecting to login in <strong>{countdown}</strong> seconds...
            </p>
          </div>
        ) : step === "request" ? (
          <form onSubmit={handleRequest} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                placeholder="Enter registered phone"
                type="tel"
                required
                style={styles.input}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? <div className="spinner"></div> : "Send Reset OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>OTP sent to {phone}</label>
              <input
                placeholder="6-digit code"
                required
                style={styles.input}
                onChange={e => setOtp(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                placeholder="Enter new password"
                type="password"
                required
                style={styles.input}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? <div className="spinner"></div> : "Update Password"}
            </button>
            <button type="button" onClick={() => setStep("request")} style={styles.secondaryButton}>
              Back
            </button>
          </form>
        )}

        <p style={styles.footerText}>
          Remember your password? <Link to="/login" style={styles.link}>Login</Link>
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
  header: { textAlign: "center", marginBottom: "30px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "14px", fontWeight: "500", color: "#374151" },
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },
  secondaryButton: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "transparent",
    color: "#374151",
    fontWeight: "600",
    cursor: "pointer",
  },
  footerText: { marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#4b5563" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: "500" },
  successContainer: { textAlign: "center", padding: "20px 0" },
  successIcon: { fontSize: "50px", marginBottom: "20px" },
};