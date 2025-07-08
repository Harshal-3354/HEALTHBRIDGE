const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  slots: [
    {
      type: String, // e.g., '09:00', '11:30'
    },
  ],
});

module.exports = mongoose.model("Availability", availabilitySchema);
