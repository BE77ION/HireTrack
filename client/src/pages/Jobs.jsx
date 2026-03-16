import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, ExternalLink, X, Search } from "lucide-react";

const STATUS_COLORS = {
  Applied: "#818cf8",
  OA: "#fbbf24",
  Interview: "#38bdf8",
  Offer: "#6ee7b7",
  Rejected: "#f87171",
};

const STATUSES = ["Applied", "OA", "Interview", "Offer", "Rejected"];

const emptyForm = { company: "", role: "", status: "Applied", location: "", jobLink: "", salary: "", notes: "", appliedDate: new Date().toISOString().split("T")[0] };

const inputStyle = {
  width: "100%", padding: "0.65rem 0.9rem",
  background: "var(--surface2)", border: "1px solid var(--border)",
  borderRadius: "8px", color: "var(--text)", fontSize: "0.9rem", outline: "none",
};

const labelStyle = { fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: "0.3rem", fontWeight: 600 };

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [saving, setSaving] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await axios.get("/api/jobs");
    setJobs(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (job) => {
    setForm({ ...job, appliedDate: new Date(job.appliedDate).toISOString().split("T")[0] });
    setEditId(job._id); setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) await axios.put(`/api/jobs/${editId}`, form);
      else await axios.post("/api/jobs", form);
      setShowModal(false); fetchJobs();
    } catch (err) { alert(err.response?.data?.message || "Error saving"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this application?")) return;
    await axios.delete(`/api/jobs/${id}`);
    fetchJobs();
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Applications</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.2rem" }}>{jobs.length} total · {filtered.length} shown</p>
        </div>
        <button onClick={openAdd} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "var(--accent)", color: "#0a0a0f", border: "none",
          padding: "0.65rem 1.25rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.95rem",
        }}>
          <Plus size={18} /> Add Job
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            placeholder="Search company or role..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: "2.2rem" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["All", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: "0.5rem 1rem", borderRadius: "20px", border: "1px solid",
              fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
              background: filterStatus === s ? `${STATUS_COLORS[s] || "var(--accent)"}18` : "transparent",
              color: filterStatus === s ? (STATUS_COLORS[s] || "var(--accent)") : "var(--muted)",
              borderColor: filterStatus === s ? (STATUS_COLORS[s] || "var(--accent)") : "var(--border)",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)", background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          {jobs.length === 0 ? "No applications yet. Click 'Add Job' to get started!" : "No results match your filters."}
        </div>
      ) : (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
                {["Company", "Role", "Status", "Date", "Location", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, letterSpacing: "0.05em" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, i) => (
                <tr key={job._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "1rem", fontWeight: 700 }}>{job.company}</td>
                  <td style={{ padding: "1rem", color: "var(--muted)", fontSize: "0.9rem" }}>{job.role}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      padding: "0.2rem 0.7rem", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 700,
                      background: `${STATUS_COLORS[job.status]}18`, color: STATUS_COLORS[job.status],
                      border: `1px solid ${STATUS_COLORS[job.status]}40`,
                    }}>{job.status}</span>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--muted)", fontSize: "0.85rem" }}>
                    {new Date(job.appliedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "1rem", color: "var(--muted)", fontSize: "0.85rem" }}>{job.location || "—"}</td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {job.jobLink && (
                        <a href={job.jobLink} target="_blank" rel="noreferrer" style={{ color: "var(--accent2)", padding: "0.3rem", borderRadius: "6px", display: "flex" }}>
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <button onClick={() => openEdit(job)} style={{ background: "transparent", border: "none", color: "var(--muted)", padding: "0.3rem", borderRadius: "6px", display: "flex" }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(job._id)} style={{ background: "transparent", border: "none", color: "var(--danger)", padding: "0.3rem", borderRadius: "6px", display: "flex" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem",
        }}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px",
            width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontWeight: 800, fontSize: "1.1rem" }}>{editId ? "Edit Application" : "Add New Application"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: "var(--muted)", display: "flex" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[["company", "Company *", "text"], ["role", "Role / Position *", "text"], ["location", "Location", "text"], ["salary", "Salary / Package", "text"], ["jobLink", "Job Link (URL)", "url"], ["appliedDate", "Applied Date", "date"]].map(([key, label, type]) => (
                <div key={key} style={key === "jobLink" ? { gridColumn: "1/-1" } : {}}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}

              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <label style={labelStyle}>Notes</label>
                <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Interview rounds, contacts, anything useful..." />
              </div>
            </div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "0.65rem 1.25rem", background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: "8px", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.company || !form.role} style={{
                padding: "0.65rem 1.5rem", background: "var(--accent)", color: "#0a0a0f",
                border: "none", borderRadius: "8px", fontWeight: 700,
                opacity: saving || !form.company || !form.role ? 0.6 : 1,
              }}>
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
