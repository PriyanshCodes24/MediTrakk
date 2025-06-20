const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  createAdmin,
} = require("../controllers/adminController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");

router.get("/stats", protect, authorizeRole("admin"), getAdminStats);
router.post(
  "/create-admin",
  protect,
  authorizeRole("admin"),
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Valid email is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters")
      .bail()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
      .withMessage(
        "Password must contain at least one uppercase, one lowercase letter, and one number"
      ),
  ],
  validateRequest,
  createAdmin
);

module.exports = router;
