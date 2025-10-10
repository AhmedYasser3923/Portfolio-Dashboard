// Server
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// Database connection
const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("DB connection successful:", conn.connection.host);
  })
  .catch((err) => console.error("DB connection error:", err));

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
