const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("relatedId");

    notifications = await Notification.populate(notifications, {
      path: "relatedId.doctor relatedId.patient",
      select: "name",
      strictPopulate: false,
    });

    res.json(notifications);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not fetch notifications" });
  }
};

const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.status(200).json({ message: "Cleared notifications" });
  } catch (error) {
    console.error(e);
    res.status(500).json({ message: "Could not clear notifications" });
  }
};

const readNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { read: true } },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification read successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not mark notification as read" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false, type: { $ne: "doctor_removed" } },
      { $set: { read: true } },
    );

    res.status(200).json({ message: "All notifications read successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not mark notifications as read" });
  }
};

module.exports = {
  getNotifications,
  clearNotifications,
  readNotification,
  markAllAsRead,
};
