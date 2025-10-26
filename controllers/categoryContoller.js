const categoryModel = require("../models/categoryModel");
const APIFeatures = require("../utils/ApiFeatures");
// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    // Execute query
    const features = new APIFeatures(categoryModel.find(), req.query);
    features.filter().sort().limitFields().paginate();
    const categories = await features.query;
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: { categories },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};
// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const newCategory = await categoryModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: { category: newCategory },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};
// Get a single category by ID
exports.getCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { category },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};
// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      data: { category },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};
// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
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

// Get category name by ID
exports.getCategoryName = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id).select("name");

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found!",
      });
    }

    res.status(200).json({
      status: "success",
      data: { name: category.name },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid category ID!",
      messageERR: err.message,
    });
  }
};
