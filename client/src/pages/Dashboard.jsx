import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Briefcase, TrendingUp, Trophy, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  Applied: "#818cf8",
  OA: "#fbbf24",
  Interview: "#38bdf8",
  Offer: "#6ee7b7",
  Rejected: "#f87171",
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div style={{
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "12px", padding: "1.5rem",
    display: "flex", alignItems: "center", gap: "1rem",
    flex: "1", minWidth: "140px",
  }}>
    <div style={{ background: `${color}18`, borderRadius: "10px", padding: "0.75rem" }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, color, fontFamily: "'Space Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>{label}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          axios.get("/api/jobs/stats"),
          axios.get("/api/jobs"),
        ]);
        setStats(statsRes.data);
        setRecentJobs(jobsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const pieData = stats
    ? Object.entries(STATUS_COLORS)
        .map(([name]) => ({ name, value: stats[name] || 0 }))
        .filter((d) => d.value > 0)
    : [];

  const barData = stats
    ? Object.entries(STATUS_COLORS).map(([name, color]) => ({
        name, value: stats[name] || 0, color,
      }))
    : [];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
          Good {new Date().getHours() < 12 ? "morning" : "evening"},{" "}
          <span style={{ color: "var(--accent)" }}>{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>Here's your placement journey at a glance.</p>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <StatCard label="Total Applied" value={stats?.total || 0} icon={Briefcase} color="var(--accent2)" />
        <StatCard label="In Progress" value={(stats?.OA || 0) + (stats?.Interview || 0)} icon={TrendingUp} color="#38bdf8" />
        <StatCard label="Offers" value={stats?.Offer || 0} icon={Trophy} color="var(--accent)" />
        <StatCard label="Rejected" value={stats?.Rejected || 0} icon={XCircle} color="var(--danger)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.95rem", color: "var(--muted)" }}>STATUS BREAKDOWN</h3>
          {pieData.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
            {Object.entries(STATUS_COLORS).map(([name, color]) => (
              <span key={name} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                {name}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.95rem", color: "var(--muted)" }}>APPLICATIONS BY STATUS</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "1.2rem", fontSize: "0.95rem", color: "var(--muted)" }}>RECENT APPLICATIONS</h3>
        {recentJobs.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "2rem 0" }}>
            No applications yet. <a href="/jobs" style={{ color: "var(--accent)", textDecoration: "none" }}>Add your first one →</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentJobs.map((job) => (
              <div key={job._id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.9rem 1rem", background: "var(--surface2)",
                borderRadius: "8px", border: "1px solid var(--border)",
              }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{job.role}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{job.company} {job.location && `· ${job.location}`}</div>
                </div>
                <span style={{
                  padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                  background: `${STATUS_COLORS[job.status]}18`, color: STATUS_COLORS[job.status],
                  border: `1px solid ${STATUS_COLORS[job.status]}40`,
                }}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
