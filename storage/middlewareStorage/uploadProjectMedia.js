const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Project = require("../../models/projectModel");

// === 1. Configure storage ===
const projectStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = file.mimetype.startsWith("video") ? "videos" : "images";
    const dir = path.join(__dirname, "../storageMedia/projects", fileType);

    // Create directory if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(
      null,
      `${baseName}-${Date.now()}${ext}` // example: banner-17289392838.jpg
    );
  },
});

// === 2. File type filter ===
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// === 3. Initialize multer upload ===
const upload = multer({
  storage: projectStorage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB max per file (adjust as needed)
  },
});

// Accept multiple fields: images[] and videos[]
exports.uploadProjectMedia = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 5 },
]);

// === 4. Update project with uploaded media ===
exports.updateProjectMedia = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Add new image/video URLs
    const imagePaths = req.files["images"]
      ? req.files["images"].map(
          (file) => `/storageMedia/projects/images/${file.filename}`
        )
      : [];
    const videoPaths = req.files["videos"]
      ? req.files["videos"].map(
          (file) => `/storageMedia/projects/videos/${file.filename}`
        )
      : [];

    // Merge new uploads with existing files (optional)
    if (imagePaths.length > 0) project.images.push(...imagePaths);
    if (videoPaths.length > 0) project.videos.push(...videoPaths);

    project.updatedAt = Date.now();
    await project.save();

    res.status(200).json({
      status: "success",
      message: "Project media updated successfully",
      data: project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating project media" });
  }
};

// === 5. Delete a specific image or video ===
exports.deleteProjectMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fileUrl } = req.body; // frontend should send the file URL to remove

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const filePath = path.join(__dirname, "../../", fileUrl);

    // Remove from DB arrays
    project.images = project.images.filter((img) => img !== fileUrl);
    project.videos = project.videos.filter((vid) => vid !== fileUrl);

    // Delete file from disk
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await project.save();

    res.status(200).json({
      status: "success",
      message: "Media file deleted successfully",
      data: project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting project media" });
  }
};
