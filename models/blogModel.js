const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A blog post must have a title"],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    author: {
      type: String,
      default: "Ahmed Yasser",
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "A blog post must belong to a category"],
    },

    summary: {
      type: String,
      trim: true,
      maxlength: [250, "Summary cannot exceed 250 characters"],
    },

    content: {
      type: String,
      required: [true, "A blog post must have content"],
    },

    coverImage: {
      type: String,
    },

    tags: [String], // e.g., ["AI", "JavaScript", "Django"]

    readTime: {
      type: Number, // estimated reading time in minutes
      default: 5,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug from title
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

// Populate category details automatically when fetching
blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name slug imageIcon",
  });
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
