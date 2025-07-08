const mongoose = require("mongoose");

const medicalReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fileUrl: {
    type: String,
    required: true,
  },
  extractedText: String,
  aiSummary: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MedicalReport", medicalReportSchema);
