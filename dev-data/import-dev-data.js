const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Project = require("../models/projectModel");
const Category = require("../models/categoryModel");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    // console.log(conn.connections);
    console.log("DB connection successful!");
  })
  .catch((err) => console.error("DB connection error:", err));

// Read JSON file for projects
const projects = JSON.parse(
  fs.readFileSync(`${__dirname}/projects-data.json`, "utf-8")
);
// Read JSON file for categories
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, "utf-8")
);

// Import data into DB
const importData = async () => {
  try {
    await Project.create(projects);
    // await Category.create(categories);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Project.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// console.log(process.argv);
// run: node dev-data/import-dev-data.js --import
// run: node dev-data/import-dev-data.js --delete
