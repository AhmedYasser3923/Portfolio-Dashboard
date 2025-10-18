const express = require("express");
const projectController = require("../controllers/projectContoller");
const router = express.Router();
const uploadProjectMedia = require("../storage/middlewareStorage/uploadProjectMedia");
const authController = require("../controllers/authController");
const checkApiKey = require("../utils/checkApiKey");
// public routes
router.route("/").get(checkApiKey, projectController.getAllProjects);
router.route("/:id").get(checkApiKey, projectController.getProject);

// protected routes (logged-in admins only)
router.use(authController.protect);
router.use(authController.restrictTo("admin", "superAdmin"));

// Routes for projects
router.route("/").post(projectController.createProject);

// Route for a single project by ID
router
  .route("/:id")
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router.patch(
  "/:id/updateMedia",
  uploadProjectMedia.uploadProjectMedia,
  uploadProjectMedia.updateProjectMedia
);

router.delete("/:id/deleteMedia", uploadProjectMedia.deleteProjectMedia);

module.exports = router;
