const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date, // store entire date, not just string
    required: true,
  },
  slots: [slotSchema],
});

module.exports = mongoose.model("Availability", availabilitySchema);
