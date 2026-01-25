import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", phone: "", password: "", role: "customer", companyName: "" });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [otp, setOtp] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      setStep("otp");
    } catch (err) {
      console.error("Registration Error:", err);
      console.dir(err); // This provides a clickable object in the console to inspect

      const message =
        err.response?.data?.message ||
        (err.request ? "No response from server. Is the backend running?" : err.message) ||
        "Registration failed";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { phone: formData.phone, otp });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-otp", { phone: formData.phone });
      alert("New OTP sent!");
    } catch (err) {
      alert("Failed to resend OTP");
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
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join our logistics network today</p>
        </div>
        {success ? (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.title}>Registration Successful!</h2>
            <p style={styles.subtitle}>
              Redirecting you to login in <strong>{countdown}</strong> seconds...
            </p>
            <Link to="/login" style={{ ...styles.link, marginTop: '20px', display: 'block' }}>
              Click here if not redirected
            </Link>
          </div>
        ) : step === "otp" ? (
          <form onSubmit={handleVerify} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Enter OTP sent to {formData.phone}</label>
              <input
                placeholder="6-digit code"
                required
                style={styles.input}
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              style={loading ? { ...styles.button, ...styles.buttonDisabled, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' } : styles.button}
            >
              {loading ? <div className="spinner"></div> : "Verify & Register"}
            </button>
            <button type="button" onClick={() => setStep("form")} style={styles.secondaryButton}>
              Back to Registration
            </button>
            <p style={styles.footerText}>
              Didn't receive code? <span onClick={handleResend} style={{...styles.link, cursor: 'pointer'}}>Resend OTP</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Company Name (For New SaaS Tenants)</label>
              <input
                placeholder="Enter your company name"
                style={styles.input}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                placeholder="Enter your name"
                required
                style={styles.input}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                placeholder="Enter your phone"
                type="tel"
                required
                style={styles.input}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                placeholder="Create a password"
                type="password"
                required
                style={styles.input}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>I am a...</label>
              <select
                value={formData.role}
                style={styles.input}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="customer">Customer (Load Owner)</option>
                <option value="driver">Driver (Truck Owner)</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...styles.button, ...styles.buttonDisabled, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' } : styles.button}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
        )}
        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
    maxWidth: "450px",
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
  },
  successContainer: {
    textAlign: "center",
    padding: "20px 0"
  },
  successIcon: {
    fontSize: "50px",
    marginBottom: "20px"
  },
  secondaryButton: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "transparent",
    color: "#374151",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "5px"
  },
};