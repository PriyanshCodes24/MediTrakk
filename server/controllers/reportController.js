const { default: mongoose } = require("mongoose");
const Report = require("../models/Report");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const DoctorPatient = require("../models/DoctorPatient");

const uploadReportController = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const newReport = await Report.create({
    user: req.user._id,
    fileUrl: `/uploads/${req.file.filename}`,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
  });

  return res.status(201).json({
    message: "Report uploaded successfully",
    report: newReport,
  });
});

const getReportController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid Report ID" });

  const report = await Report.find({ _id: id, user: req.user._id });
  if (!report) return res.status(404).json({ message: "Report not found" });

  res.status(200).json({ message: "Report fetched successfully", report });
});

const getPatientReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user._id })
    .select("-__v -createdAt -updatedAt")
    .populate("user")
    .sort({
      createdAt: -1,
    });
  if (!reports.length || reports.length === 0)
    return res.status(404).json({ message: "No Reports Found" });
  res.status(200).json({ message: "Reports fetched successfully", reports });
});
const getDoctorReports = asyncHandler(async (req, res) => {
  const patients = await DoctorPatient.find({ doctor: req.user._id }).select(
    "patient"
  );
  const patientIds = patients.map((entry) => entry.patient);

  const reports = await Report.find({ user: { $in: patientIds } })
    .populate("user", "name email")
    .select("-__v -updatedAt")
    .sort({
      uploadedAt: -1,
    });
  if (!reports.length || reports.length === 0)
    return res.status(404).json({ message: "No Reports Found" });
  res.status(200).json({ message: "Reports fetched successfully", reports });
});

const getAdminReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({})
    .populate("user", "name email")
    .select("-__v -createdAt")
    .sort({ uploadedAt: -1 });
  if (reports.length === 0)
    res.status(404).json({ message: "No reports found" });
  res.status(200).json({ message: "Reports fetched successfully", reports });
});

const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid Report ID" });
  const report = await Report.findById(id).select("-__v");
  if (
    req.user.role !== "admin" &&
    report.user.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this report" });
  }
  if (!report) return res.status(404).json({ message: "Report not found" });
  const filePath = path.join(__dirname, "..", report.fileUrl);
  await report.deleteOne();
  fs.unlink(filePath, (err) => {
    if (err) console.log("Error deleting file:", err);
  });
  res.status(200).json({ message: "Report deleted successfully", report });
});

const viewReport = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  // Security: Only allow viewing files from uploads directory
  if (filename.includes("..") || filename.includes("/")) {
    return res.status(400).json({ message: "Invalid filename" });
  }

  // Find the report in the database to verify user permissions
  const report = await Report.findOne({ fileUrl: `/uploads/${filename}` });
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  // Check if user has permission to view this report
  // Users can view their own reports, doctors can view their patients' reports, admins can view all
  const hasPermission =
    req.user.role === "admin" ||
    report.user.toString() === req.user._id.toString() ||
    (req.user.role === "doctor" &&
      (await DoctorPatient.findOne({
        doctor: req.user._id,
        patient: report.user,
      })));

  if (!hasPermission) {
    return res
      .status(403)
      .json({ message: "Not authorized to view this report" });
  }

  const filePath = path.join(__dirname, "..", "uploads", filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // Get file stats for content-length header
  const stats = fs.statSync(filePath);

  // Detect MIME type based on file extension
  const ext = path.extname(filename).toLowerCase();
  let contentType = "application/octet-stream";

  switch (ext) {
    case ".pdf":
      contentType = "application/pdf";
      break;
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".doc":
    case ".docx":
      contentType = "application/msword";
      break;
    case ".xls":
    case ".xlsx":
      contentType = "application/vnd.ms-excel";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
  }

  // Set appropriate headers for inline viewing
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", stats.size);
  res.setHeader("Content-Disposition", "inline");

  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

module.exports = {
  uploadReportController,
  getReportController,
  getPatientReports,
  getAdminReports,
  getDoctorReports,
  deleteReport,
  viewReport,
};
