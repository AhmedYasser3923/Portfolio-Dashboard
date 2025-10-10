const express = require("express");
const morgan = require("morgan");
const app = express();
const projectRouter = require("./routes/projectRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const blogRouter = require("./routes/blogRoutes");

// middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use("/api/projects", projectRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/blogs", blogRouter);

module.exports = app;
