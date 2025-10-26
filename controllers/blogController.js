const Blog = require("../models/blogModel");
const APIFeatures = require("../utils/ApiFeatures");

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    // Execute query
    const features = new APIFeatures(Blog.find(), req.query);
    features.filter().sort().limitFields().paginate();
    const blogs = await features.query;
    res.status(200).json({
      status: "success",
      results: Blog.length,
      data: { blogs },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};
// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    // Ensure the authenticated user's name is used
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized — please log in first!",
      });
    }

    const newBlog = await Blog.create({
      ...req.body,
      author: req.user.username || req.user.name, // use user's name or username
    });

    res.status(201).json({
      status: "success",
      data: { blog: newBlog },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};

// Update blog by ID
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: { blog },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};
// Delete blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};
