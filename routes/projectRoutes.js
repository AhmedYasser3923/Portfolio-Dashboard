const express = require("express");
const projectController = require("../controllers/projectContoller");
const router = express.Router();
const uploadProjectMedia = require("../storage/middlewareStorage/uploadProjectMedia");
const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.restrictTo("admin", "super-admin"));


// Routes for projects
router
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

// Route for a single project by ID
router
  .route("/:id")
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router.patch(
  "/:id/updateMedia",
  uploadProjectMedia.uploadProjectMedia,
  uploadProjectMedia.updateProjectMedia
);

router.delete("/:id/deleteMedia", uploadProjectMedia.deleteProjectMedia);

module.exports = router;
