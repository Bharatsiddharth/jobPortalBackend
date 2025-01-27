// models/Job.js
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  endDate: { type: Date, required: true },
  candidateEmails: { type: [String] }, // Array of candidate email addresses
});

module.exports = mongoose.model("Job", JobSchema);