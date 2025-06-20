const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

router.get("/me", protect, getUserProfile);
router.put(
  "/update",
  protect,
  [
    body("name")
      .trim()
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
  ],
  validateRequest,
  updateUserProfile
);
router.put(
  "/:id/make-doctor",
  protect,
  authorizeRole("admin"),
  asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "doctor") {
      return res.status(400).json({ message: "User is already a doctor" });
    }

    user.role = "doctor";
    await user.save();
    return res.status(200).json({
      message: `${user.name} has been promoted to doctor`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

module.exports = router;
