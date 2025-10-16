const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../../models/userModel");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../storageMedia/users"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `user-${req.user.id}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Not an image! Please upload image files only."), false);
};

// Create upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

exports.uploadUserPhoto = upload.single("photo");

// Middleware to handle updating the user photo
exports.updateUserPhoto = async (req, res, next) => {
  try {
    // If no new photo uploaded → skip
    if (!req.file) return next();

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If user had an old custom photo, delete it (not default)
    if (
      user.photo &&
      !user.photo.includes("defaultMale.png") &&
      !user.photo.includes("defaultFemale.png")
    ) {
      const oldPath = path.join(__dirname, "../storageMedia/users", user.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save new photo name to DB
    user.photo = req.file.filename;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Profile photo updated successfully",
      data: { photo: user.photo },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile photo" });
  }
};

// Middleware to delete user photo (reset to default)
exports.deleteUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove old custom photo if exists
    if (
      user.photo &&
      !user.photo.includes("defaultMale.png") &&
      !user.photo.includes("defaultFemale.png")
    ) {
      const oldPath = path.join(__dirname, "../storageMedia/users", user.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Reset to gender default
    user.photo =
      user.gender === "female" ? "defaultFemale.png" : "defaultMale.png";
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Photo deleted and reset to default",
      data: { photo: user.photo },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting photo" });
  }
};
