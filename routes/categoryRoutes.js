const express = require("express");
const categoryController = require("../controllers/categoryContoller");
const router = express.Router();
const uploadCategoryPhoto = require("../storage/middlewareStorage/uploadCategoryPhoto");
const authController = require("../controllers/authController");
const checkApiKey = require("../utils/checkApiKey");

// public routes
router.route("/").get(checkApiKey, categoryController.getAllCategories);
router.route("/:id").get(checkApiKey, categoryController.getCategory);

// protected routes (logged-in admins only)
// Routes for categories
router.use(authController.protect);
router.use(authController.restrictTo("admin", "superAdmin"));
router.route("/").post(categoryController.createCategory);

// Route for a single project by ID
router
  .route("/:id")
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.patch(
  "/:id/updateIcon",
  uploadCategoryPhoto.uploadCategoryPhoto,
  uploadCategoryPhoto.updateCategoryPhoto
);

router.delete("/:id/deleteIcon", uploadCategoryPhoto.deleteCategoryPhoto);

module.exports = router;
