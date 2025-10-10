const express = require("express");
const projectController = require("../controllers/projectContoller");
const router = express.Router();

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

module.exports = router;
