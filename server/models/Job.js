const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ["Applied", "OA", "Interview", "Offer", "Rejected"],
    default: "Applied",
  },
  appliedDate: { type: Date, default: Date.now },
  location: { type: String },
  jobLink: { type: String },
  notes: { type: String },
  salary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
