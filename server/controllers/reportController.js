const { default: mongoose } = require("mongoose");
const Report = require("../models/Report");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");

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

const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user._id })
    .select("-__v -createdAt -updatedAt")
    .sort({
      createdAt: -1,
    });
  if (!reports.length || reports.length === 0)
    return res.status(404).json({ message: "No Reports Found" });
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

module.exports = {
  uploadReportController,
  getReportController,
  getReports,
  deleteReport,
};
