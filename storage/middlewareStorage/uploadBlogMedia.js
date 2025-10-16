const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Blog = require("../../models/blogModel");

// === 1. Configure multer storage ===
const blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../storageMedia/blogs");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

// === 2. File filter ===
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

// === 3. Initialize multer ===
const upload = multer({
  storage: blogStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

// === 4. Middleware for uploading a single image ===
exports.uploadBlogMedia = upload.single("coverImage");

// === 5. Update blog cover image ===
exports.updateBlogMedia = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!req.file)
      return res.status(400).json({ message: "No image file provided" });

    // Delete old image if it exists
    if (blog.coverImage) {
      const oldPath = path.join(__dirname, "../../", blog.coverImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save new image URL
    blog.coverImage = `/storageMedia/blogs/${req.file.filename}`;
    await blog.save();

    res.status(200).json({
      status: "success",
      message: "Blog cover image updated successfully",
      data: blog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating blog image" });
  }
};

// === 6. Delete blog cover image ===
exports.deleteBlogMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.coverImage)
      return res
        .status(400)
        .json({ message: "No cover image exists for this blog" });

    const filePath = path.join(__dirname, "../../", blog.coverImage);

    // Remove file from disk
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Remove from DB
    blog.coverImage = undefined;
    await blog.save();

    res.status(200).json({
      status: "success",
      message: "Blog cover image deleted successfully",
      data: blog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting blog image" });
  }
};
