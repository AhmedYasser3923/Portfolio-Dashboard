// storage/middlewareStorage/uploadCategoryPhoto.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Category = require("../../models/categoryModel");

// === 1. Configure multer storage ===
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../storageMedia/categories");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

// === 2. File filter (only images) ===
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

// === 3. Initialize multer ===
const upload = multer({
  storage: categoryStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// === 4. Middleware for uploading one icon ===
exports.uploadCategoryPhoto = upload.single("imageIcon");

// === 5. Update category photo ===
exports.updateCategoryPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (!req.file)
      return res.status(400).json({ message: "No image file provided" });

    // Delete old photo if it's not default
    if (category.imageIcon && category.imageIcon !== "default-icon.png") {
      const oldPath = path.join(__dirname, "../../", category.imageIcon);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save new image
    category.imageIcon = `/storageMedia/categories/${req.file.filename}`;
    await category.save();

    res.status(200).json({
      status: "success",
      message: "Category icon updated successfully",
      data: category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating category photo" });
  }
};

// === 6. Delete category photo (revert to default) ===
exports.deleteCategoryPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (!category.imageIcon || category.imageIcon === "default-icon.png") {
      return res
        .status(400)
        .json({ message: "This category already has the default icon" });
    }

    const filePath = path.join(__dirname, "../../", category.imageIcon);

    // Remove file from disk
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Set to default
    category.imageIcon = "default-icon.png";
    await category.save();

    res.status(200).json({
      status: "success",
      message: "Category icon deleted, reverted to default",
      data: category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting category photo" });
  }
};
