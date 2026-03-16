const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all jobs for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a job
router.post("/", auth, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, user: req.userId });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a job
router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a job
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats for dashboard
router.get("/stats", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId });
    const stats = {
      total: jobs.length,
      Applied: 0, OA: 0, Interview: 0, Offer: 0, Rejected: 0,
    };
    jobs.forEach((j) => stats[j.status]++);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
