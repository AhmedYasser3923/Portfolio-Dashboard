const categoryModel = require("../models/categoryModel");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    // 1. Filtering
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = categoryModel.find(JSON.parse(queryStr));

    // 3. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 4. Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 5. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numProjects = await categoryModel.countDocuments();
      if (skip >= numProjects) throw new Error("This page does not exist");
    }

    // Execute query
    const categories = await query;
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
