const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // Common fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    required: true,
  },

  // Optional contact details
  phone: { type: String },
  profilePicture: { type: String }, // URL or base64 or Cloudinary

  // -------------------------------
  // Doctor-specific fields
  // -------------------------------
  specialization: String,
  qualifications: String,
  bio: String,
  experience: Number, // years
  clinicAddress: String,

  // -------------------------------
  // Patient-specific fields
  // -------------------------------
  medicalHistory: String,
  age: Number,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  bloodGroup: String,
  address: String,

  // -------------------------------
  // System Fields
  // -------------------------------
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
