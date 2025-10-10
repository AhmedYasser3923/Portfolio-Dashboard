const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    imageIcon: {
      type: String, // could be a URL or a local image path
      default: "default-icon.png",
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Middleware to auto-generate slug from name before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
