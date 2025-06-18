const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  res.send("MediTrakk api is working");
});

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

router.get("/doctor-area", protect, authorizeRole("doctor"), (req, res) => {
  res.send("Only doctors can access this route");
});

module.exports = router;
