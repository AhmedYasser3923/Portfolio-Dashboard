const express = require("express");
const blogController = require("../controllers/blogController");
const router = express.Router();
const uploadBlogMedia = require("../storage/middlewareStorage/uploadBlogMedia");
const authController = require("../controllers/authController");

router.use(authController.restrictTo("admin", "super-admin"));

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
