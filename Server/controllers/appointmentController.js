const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

exports.bookAppointment = async (req, res) => {
  const { doctorId, patientId, date, startTime, endTime } = req.body;

  try {
    const now = new Date();

    const selectedStart = new Date(startTime);
    const selectedEnd = new Date(endTime);

    // ❌ Prevent booking in the past
    if (selectedStart < now) {
      return res
        .status(400)
        .json({ error: "Cannot book appointment in the past" });
    }

    const availability = await Availability.findOne({ doctorId, date });

    if (!availability)
      return res
        .status(404)
        .json({ error: "No availability found for selected date" });

    // ✅ Find matching available slot
    const slot = availability.slots.find(
      (s) =>
        new Date(s.startTime).getTime() === selectedStart.getTime() &&
        new Date(s.endTime).getTime() === selectedEnd.getTime() &&
        !s.isBooked
    );

    if (!slot) {
      return res
        .status(400)
        .json({ error: "Slot is already booked or invalid" });
    }

    // ✅ Mark slot as booked
    slot.isBooked = true;
    await availability.save();

    // ✅ Create appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      startTime: selectedStart,
      endTime: selectedEnd,
      status: "pending",
    });

    await appointment.save();

    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Failed to book appointment" });
  }
};
