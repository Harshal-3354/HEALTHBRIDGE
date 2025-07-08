const express = require("express");
const router = express.Router();
const { verifyJWT, allowRoles } = require("../middleware/authMiddleware");

router.get("/dashboard", verifyJWT, allowRoles("doctor"), (req, res) => {
  res.json({ message: `Welcome Doctor ${req.user.userId}` });
});

module.exports = router;
