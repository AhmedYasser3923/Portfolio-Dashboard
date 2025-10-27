const mongoose = require("mongoose");
const slugify = require("slugify");
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A project must have a title"],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "A project must have a description"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category", // reference to Category model
      required: [true, "A project must belong to a category"],
    },

    technologies: {
      type: [String],
      required: [true, "Please specify technologies used in this project"],
    },
    client: {
      type: String,
      default: null,
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Paused"],
      default: "Ongoing",
    },

    images: [String], // array of image URLs

    videos: [String], // array of video URLs (optional demos or previews)

    liveDemoUrl: String,

    githubUrl: String,

    featured: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Middleware to auto-generate slug from title before saving
projectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
