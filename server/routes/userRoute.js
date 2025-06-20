const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");

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

module.exports = router;
