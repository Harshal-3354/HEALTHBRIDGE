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
