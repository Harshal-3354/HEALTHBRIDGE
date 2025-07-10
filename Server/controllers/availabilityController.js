const Availability = require("../models/Availability");

/**
 * Add available time slots for a doctor on a specific date
 * Request body:
 * {
 *   doctorId: "...",
 *   date: "YYYY-MM-DD",
 *   slots: [{ startTime: "YYYY-MM-DDTHH:mm", endTime: "YYYY-MM-DDTHH:mm" }]
 * }
 */
exports.addAvailability = async (req, res) => {
  const { doctorId, date, slots } = req.body;

  try {
    const formattedDate = new Date(date);
    let availability = await Availability.findOne({
      doctorId,
      date: formattedDate,
    });
    // Inside addAvailability
    const now = new Date();
    for (let slot of slots) {
      if (new Date(slot.startTime) < now) {
        return res.status(400).json({ error: "Cannot add slot in the past." });
      }
    }

    if (availability) {
      // Check for duplicates based on start and end time
      const existingSlots = availability.slots.map(
        (s) => `${s.startTime.toISOString()}-${s.endTime.toISOString()}`
      );

      slots.forEach((slot) => {
        const slotKey = `${new Date(slot.startTime).toISOString()}-${new Date(
          slot.endTime
        ).toISOString()}`;
        if (!existingSlots.includes(slotKey)) {
          availability.slots.push({
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
          });
        }
      });
    } else {
      availability = new Availability({
        doctorId,
        date: formattedDate,
        slots: slots.map((slot) => ({
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
        })),
      });
    }

    await availability.save();
    res.status(200).json(availability);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add availability" });
  }
};

/**
 * Get availability slots for a doctor (optionally filtered by date)
 * URL: /api/availability/:doctorId?date=YYYY-MM-DD
 */
exports.getAvailability = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  try {
    const filter = { doctorId };
    if (date) {
      filter.date = new Date(date);
    }

    const availability = await Availability.findOne(filter);

    if (!availability) {
      return res.status(404).json({ slots: [] });
    }

    res.json(availability.slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
};

/**
 * Delete a specific slot by slotId
 * URL: /api/availability/:doctorId/slot/:slotId
 */
exports.deleteSlot = async (req, res) => {
  const { doctorId, slotId } = req.params;

  try {
    const availability = await Availability.findOne({
      "slots._id": slotId,
      doctorId,
    });

    if (!availability) {
      return res.status(404).json({ error: "Slot not found" });
    }

    availability.slots = availability.slots.filter(
      (slot) => slot._id.toString() !== slotId
    );

    await availability.save();
    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete slot" });
  }
};
