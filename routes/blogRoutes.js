const express = require("express");
const blogController = require("../controllers/blogController");
const router = express.Router();
const uploadBlogMedia = require("../storage/middlewareStorage/uploadBlogMedia");
const authController = require("../controllers/authController");
const checkApiKey = require("../utils/checkApiKey");
// public routes

router.route("/").get(checkApiKey, blogController.getAllBlogs);
router.route("/:id").get(checkApiKey, blogController.getBlog);

// protected routes (logged-in admins only)
router.use(authController.protect);
router.use(authController.restrictTo("admin", "superAdmin"));

router.route("/").post(blogController.createBlog);

router
  .route("/:id")
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

router.patch(
  "/:id/updateCover",
  uploadBlogMedia.uploadBlogMedia,
  uploadBlogMedia.updateBlogMedia
);

router.delete("/:id/deleteCover", uploadBlogMedia.deleteBlogMedia);

module.exports = router;
