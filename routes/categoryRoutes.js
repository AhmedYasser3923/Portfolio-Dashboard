const express = require("express");
const categoryController = require("../controllers/categoryContoller");
const router = express.Router();

// Routes for categories
router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

// Route for a single project by ID
router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
