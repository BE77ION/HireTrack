import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axios.post("/api/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "2.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.3rem" }}>
          Hire<span style={{ color: "var(--accent)" }}>Track</span>
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem", fontSize: "0.9rem" }}>Track your placement journey</p>

        {error && <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", padding: "0.8rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[["email", "Email", "email"], ["password", "Password", "password"]].map(([key, label, type]) => (
            <div key={key}>
              <label style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block", marginBottom: "0.4rem", fontWeight: 600 }}>{label}</label>
              <input
                type={type} value={form[key]} required
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: "100%", padding: "0.75rem 1rem", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "0.95rem", outline: "none" }}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{
            padding: "0.8rem", background: "var(--accent)", color: "#0a0a0f",
            border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "1rem", marginTop: "0.5rem",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
          No account? <Link to="/register" style={{ color: "var(--accent2)", textDecoration: "none", fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
