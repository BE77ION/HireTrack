import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
  Cell, Tooltip, ResponsiveContainer
} from "recharts";
import { Briefcase, TrendingUp, Trophy, XCircle, Quote } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  Applied:   "#60a5fa",
  OA:        "#fb923c",
  Interview: "#c084fc",
  Offer:     "#4ade80",
  Rejected:  "#e85555",
};

// ── Custom Tooltip for Pie ────────────────────────────────────────────────────
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const color = STATUS_COLORS[name];
  return (
    <div style={{
      background: "#1a1a2e",
      border: `1px solid ${color}60`,
      borderRadius: "10px",
      padding: "10px 16px",
      boxShadow: `0 4px 24px ${color}33`,
      minWidth: "120px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 6px ${color}` }} />
        <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{name}</span>
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 800, color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.72rem", color: "#888", marginTop: "2px" }}>applications</div>
    </div>
  );
};

// ── Custom Tooltip for Bar ────────────────────────────────────────────────────
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const color = STATUS_COLORS[label];
  return (
    <div style={{
      background: "#1a1a2e",
      border: `1px solid ${color}60`,
      borderRadius: "10px",
      padding: "10px 16px",
      boxShadow: `0 4px 24px ${color}33`,
      minWidth: "120px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 6px ${color}` }} />
        <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{label}</span>
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 800, color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{payload[0].value}</div>
      <div style={{ fontSize: "0.72rem", color: "#888", marginTop: "2px" }}>applications</div>
    </div>
  );
};

// ── Active Pie Shape (on hover) ───────────────────────────────────────────────
const ActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * ((startAngle + endAngle) / 2));
  const cos = Math.cos(-RADIAN * ((startAngle + endAngle) / 2));

  return (
    <g>
      {/* Centre label */}
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={800} fontFamily="'Space Mono', monospace">
        {payload.value}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={fill} fontSize={12} fontWeight={700} fontFamily="'Figtree', sans-serif">
        {payload.name}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#666" fontSize={11} fontFamily="'Figtree', sans-serif">
        {(percent * 100).toFixed(0)}%
      </text>

      {/* Expanded outer arc */}
      <path
        d={describeArc(cx, cy, outerRadius + 8, startAngle, endAngle)}
        fill={fill}
        stroke={fill}
        strokeWidth={0}
        filter={`drop-shadow(0 0 10px ${fill})`}
      />
      {/* Inner arc */}
      <path
        d={describeArc(cx, cy, innerRadius - 2, startAngle, endAngle, true)}
        fill="none"
        stroke={fill}
        strokeWidth={2}
        opacity={0.4}
      />
    </g>
  );
};

function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle, counterClockwise = false) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  if (counterClockwise) {
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div style={{
    background: "var(--surface)",
    border: `1px solid ${color}25`,
    borderRadius: "14px",
    padding: "1.4rem 1.6rem",
    display: "flex", alignItems: "center", gap: "1.1rem",
    flex: "1", minWidth: "140px",
    position: "relative", overflow: "hidden",
    transition: "border-color 0.2s, transform 0.2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}60`; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <div style={{
      position: "absolute", top: -20, right: -20, width: 90, height: 90,
      borderRadius: "50%", background: `${color}12`, filter: "blur(16px)", pointerEvents: "none",
    }} />
    <div style={{ background: `${color}18`, borderRadius: "12px", padding: "0.75rem", flexShrink: 0 }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <div style={{ fontSize: "1.9rem", fontWeight: 800, color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  </div>
);

// ── Custom Bar shape with glow ─────────────────────────────────────────────────
const GlowBar = (props) => {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6} fill={fill} opacity={0.15} filter="blur(4px)" />
      <rect x={x} y={y} width={width} height={height} rx={6} fill={fill}
        style={{ filter: `drop-shadow(0 2px 8px ${fill}66)` }} />
    </g>
  );
};

// ── Daily Quote ───────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "Success is not final, failure is not fatal — it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Don't watch the clock; do what it does — keep going.", author: "Sam Levenson" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Opportunities don't happen — you create them.", author: "Chris Grosser" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Your only limit is your mind.", author: "Anonymous" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { text: "Great things never come from comfort zones.", author: "Anonymous" },
  { text: "Rejection is redirection. Keep going.", author: "Anonymous" },
  { text: "Every interview is a chance to learn something new about yourself.", author: "Anonymous" },
  { text: "The job you want is looking for someone exactly like you — go find it.", author: "Anonymous" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Code is like humour. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Every master was once a disaster.", author: "T. Harv Eker" },
  { text: "Small steps every day lead to big results over time.", author: "Anonymous" },
  { text: "Placement season is a marathon, not a sprint. Pace yourself.", author: "Anonymous" },
  { text: "Your resume gets you the interview. You get yourself the job.", author: "Anonymous" },
  { text: "Be so good they can't ignore you.", author: "Steve Martin" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}
export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const quote = getDailyQuote();

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

  const barData = stats
    ? Object.entries(STATUS_COLORS).map(([name, color]) => ({
        name, value: stats[name] || 0, color,
      }))
    : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
          {greeting},{" "}
          <span style={{ color: "var(--accent)" }}>{user?.name?.split(" ")[0]}</span>
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>Here's your placement journey at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <StatCard label="Total Applied"  value={stats?.total || 0}                                 icon={Briefcase}  color="var(--accent2)" />
        <StatCard label="In Progress"    value={(stats?.OA || 0) + (stats?.Interview || 0)}        icon={TrendingUp} color="#38bdf8"         />
        <StatCard label="Offers"         value={stats?.Offer || 0}                                 icon={Trophy}     color="var(--accent)"  />
        <StatCard label="Rejected"       value={stats?.Rejected || 0}                              icon={XCircle}    color="var(--danger)"  />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.5rem", marginBottom: "2rem" }}>

        {/* Thought of the Day */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "1.8rem",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
        }}>
          {/* background glow */}
          <div style={{
            position: "absolute", top: -40, right: -40, width: 160, height: 160,
            borderRadius: "50%", background: "var(--accent)10", filter: "blur(40px)", pointerEvents: "none",
          }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
              <Quote size={14} color="var(--accent)" />
              <span style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Thought of the Day
              </span>
            </div>
            <p style={{
              fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.7,
              color: "var(--text)", fontStyle: "italic",
            }}>
              "{quote.text}"
            </p>
          </div>
          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ height: 2, width: 24, background: "var(--accent)", borderRadius: 2 }} />
            <span style={{ fontSize: "0.82rem", color: "var(--accent)", fontWeight: 700 }}>{quote.author}</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "1.5rem",
        }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Applications by Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={36} margin={{ top: 16, right: 8, bottom: 0, left: -16 }}>
              <defs>
                {barData.map(({ name, color }) => (
                  <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" opacity={0.5} />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted)", fontSize: 11, fontFamily: "'Figtree', sans-serif", fontWeight: 600 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--muted)", fontSize: 10, fontFamily: "'Space Mono', monospace" }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)", radius: 6 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} shape={<GlowBar />} maxBarSize={48}>
                {barData.map(({ name, color }) => (
                  <Cell key={name} fill={`url(#grad-${name})`} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{ fill: "var(--muted)", fontSize: 11, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}
                  formatter={(v) => v > 0 ? v : ""}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "16px", padding: "1.5rem",
      }}>
        <h3 style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
          Recent Applications
        </h3>
        {recentJobs.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "2rem 0" }}>
            No applications yet.{" "}
            <a href="/jobs" style={{ color: "var(--accent)", textDecoration: "none" }}>Add your first one →</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {recentJobs.map((job) => {
              const color = STATUS_COLORS[job.status];
              return (
                <div key={job._id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.9rem 1.1rem", background: "var(--surface2)",
                  borderRadius: "10px", border: "1px solid var(--border)",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.background = `${color}08`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface2)"; }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{job.role}</div>
                    <div style={{ fontSize: "0.84rem", color: "var(--muted)", marginTop: "2px" }}>
                      {job.company}{job.location ? ` · ${job.location}` : ""}
                    </div>
                  </div>
                  <span style={{
                    padding: "0.25rem 0.8rem", borderRadius: "20px", fontSize: "0.74rem", fontWeight: 700,
                    background: `${color}18`, color, border: `1px solid ${color}40`,
                    letterSpacing: "0.04em", whiteSpace: "nowrap",
                  }}>
                    {job.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
