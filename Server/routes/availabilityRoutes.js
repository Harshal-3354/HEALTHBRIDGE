// routes/availabilityRoutes.js
const express = require("express");
const router = express.Router();

const {
  addAvailability,
  getAvailability,
  deleteSlot,
} = require("../controllers/availabilityController");

router.post("/", addAvailability);
router.get("/:doctorId", getAvailability);
router.delete("/:doctorId/slot/:slotId", deleteSlot);

module.exports = router;
