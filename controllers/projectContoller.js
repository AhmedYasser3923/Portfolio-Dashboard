const Project = require("../models/projectModel");
const APIFeatures = require("../utils/ApiFeatures");
// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate({
      path: "category",
      select: "name slug -_id",
    });

    res.status(200).json({
      status: "success",
      results: projects.length,
      data: { projects },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};

// Create a new project

exports.createProject = async (req, res) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        project: newProject,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};

// Get a single project by ID (with category name)
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate({
      path: "category",
      select: "name slug -_id", // only get category name and slug, exclude _id
    });

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { project },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: { project },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
      messageERR: err.message,
    });
  }
};
// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
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
