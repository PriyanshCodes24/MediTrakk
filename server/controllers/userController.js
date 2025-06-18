const getUserProfile = (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "User not found" });
  return res
    .status(200)
    .json({ message: "User profile fetched successfully", user: user });
};

module.exports = { getUserProfile };
