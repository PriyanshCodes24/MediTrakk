const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getDoctorList,
  getAllUsers,
  makeDoctor,
  deleteUser,
} = require("../controllers/userController");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");

router.get("/me", protect, getUserProfile);
router.get("/doctors", protect, getDoctorList);
router.get("/all", protect, authorizeRole("admin"), getAllUsers);
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
router.put("/:id/make-doctor", protect, authorizeRole("admin"), makeDoctor);
router.delete("/:id", protect, authorizeRole("admin"), deleteUser);

module.exports = router;
