const express = require("express");
const blogController = require("../controllers/blogController");
const router = express.Router();
const uploadBlogMedia = require("../storage/middlewareStorage/uploadBlogMedia");
const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.restrictTo("admin", "superAdmin"));

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(blogController.createBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

router.patch(
  "/:id/updateCover",
  uploadBlogMedia.uploadBlogMedia,
  uploadBlogMedia.updateBlogMedia
);

router.delete("/:id/deleteCover", uploadBlogMedia.deleteBlogMedia);

module.exports = router;
