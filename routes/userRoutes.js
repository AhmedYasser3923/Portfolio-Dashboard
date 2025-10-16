const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const authController = require("../controllers/authController");
const uploadUserPhoto = require("../storage/middlewareStorage/uploadUserPhoto");
// Public routes
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protected routes (logged-in admins only)
router.use(authController.protect);

// Routes for logged-in admins
router.patch("/updateMyPassword", authController.updatePassword);
router.patch("/updateMe", userController.updateMe);

router.use(authController.restrictTo("admin", "super-admin"));

router.patch(
  "/updateMyPhoto",
  uploadUserPhoto.uploadUserPhoto,
  uploadUserPhoto.updateUserPhoto
);

router.delete("/deleteMyPhoto", uploadUserPhoto.deleteUserPhoto);

// Restrict everything below to super-admins only
router.use(authController.restrictTo("super-admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
