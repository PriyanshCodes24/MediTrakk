const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { body } = require("express-validator");

router.post(
  "/register",
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
    body("role")
      .optional()
      .isIn(["patient", "doctor"])
      .withMessage("Invalid Role"),
  ],
  validateRequest,
  registerUser
);
router.post(
  "/login",
  [
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
  loginUser
);

module.exports = router;
