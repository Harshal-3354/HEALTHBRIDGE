const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/", appointmentController.bookAppointment);
router.get("/patient/:id", appointmentController.getPatientAppointments);
router.get("/doctor/:id", appointmentController.getDoctorAppointments);
router.patch("/:id", appointmentController.updateAppointmentStatus);

module.exports = router;
