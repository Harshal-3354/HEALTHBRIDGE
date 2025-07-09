const express = require("express");
const router = express.Router();
const { getAllDoctors } = require("../controllers/doctorController");
const { verifyJWT, allowRoles } = require("../middleware/authMiddleware");

router.get("/", verifyJWT, getAllDoctors);
router.get("/dashboard", verifyJWT, allowRoles("doctor"), (req, res) => {
  res.json({ message: `Welcome Doctor ${req.user.userId}` });
});

module.exports = router;
