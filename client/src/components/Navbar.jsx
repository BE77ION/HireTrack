import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Briefcase, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();

  const active = (path) => loc.pathname === path;

  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--accent)", letterSpacing: "-0.5px" }}>
        Hire<span style={{ color: "var(--accent2)" }}>Track</span>
      </span>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[
          { to: "/", label: "Dashboard", Icon: LayoutDashboard },
          { to: "/jobs", label: "Jobs", Icon: Briefcase },
        ].map(({ to, label, Icon }) => (
          <Link key={to} to={to} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.4rem 1rem", borderRadius: "6px", textDecoration: "none",
            fontSize: "0.9rem", fontWeight: 600,
            color: active(to) ? "var(--accent)" : "var(--muted)",
            background: active(to) ? "rgba(110,231,183,0.08)" : "transparent",
            transition: "all 0.2s",
          }}>
            <Icon size={16} /> {label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          👋 {user?.name}
        </span>
        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: "0.3rem",
          background: "transparent", border: "1px solid var(--border)",
          color: "var(--muted)", padding: "0.3rem 0.8rem", borderRadius: "6px",
          fontSize: "0.85rem", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.color = "var(--danger)"; e.target.style.borderColor = "var(--danger)"; }}
          onMouseLeave={e => { e.target.style.color = "var(--muted)"; e.target.style.borderColor = "var(--border)"; }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  );
}
