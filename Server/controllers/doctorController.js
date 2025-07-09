const User = require("../models/User");

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "name specialization experience profilePicture _id"
    );
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select(
      "name email specialization experience bio qualifications profilePicture clinicAddress"
    );

    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    res.status(200).json(doctor);
  } catch (err) {
    console.error("Doctor fetch failed", err);
    res.status(500).json({ error: "Failed to fetch doctor details" });
  }
};
