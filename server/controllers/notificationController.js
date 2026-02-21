const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })

      .sort({
        createdAt: -1,
      })

      .limit(20)
      .populate({
        path: "relatedId",
        populate: [
          { path: "doctor", select: "name" },
          { path: "patient", select: "name" },
        ],
      });
    console.log(notifications);

    res.json(notifications);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not fetch notifications" });
  }
};

const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.status(200).json({ message: "Cleared notifications" });
  } catch (error) {
    console.log(e);
    res.status(500).json({ message: "Could not clear notifications" });
  }
};

module.exports = { getNotifications, clearNotifications };
