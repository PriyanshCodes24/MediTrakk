const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getDoctorList,
  getAllUsers,
  reactivateUser,
  deactivateUser,
  getDoctorRequest,
  requestDoctorRole,
  approveDoctorRequest,
  rejectDoctorRequest,
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
  updateUserProfile,
);
router.delete("/:id", protect, authorizeRole("admin"), deactivateUser);
router.patch("/:id", protect, authorizeRole("admin"), reactivateUser);

router.post("/doctor-requests", protect, requestDoctorRole);
router.get(
  "/doctor-requests",
  protect,
  authorizeRole("admin"),
  getDoctorRequest,
);
router.patch(
  "/doctor-requests/:id/approve",
  protect,
  authorizeRole("admin"),
  approveDoctorRequest,
);
router.patch(
  "/doctor-requests/:id/reject",
  protect,
  authorizeRole("admin"),
  rejectDoctorRequest,
);

module.exports = router;
