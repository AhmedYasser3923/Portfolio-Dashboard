const express = require("express");
const categoryController = require("../controllers/categoryContoller");
const router = express.Router();
const uploadCategoryPhoto = require("../storage/middlewareStorage/uploadCategoryPhoto");
const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.restrictTo("admin", "super-admin"));

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

router.patch(
  "/:id/updateIcon",
  uploadCategoryPhoto.uploadCategoryPhoto,
  uploadCategoryPhoto.updateCategoryPhoto
);

router.delete("/:id/deleteIcon", uploadCategoryPhoto.deleteCategoryPhoto);

module.exports = router;
