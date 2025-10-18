// createAdmin.js
require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const User = require("./models/userModel"); // ✅ Use your actual model

// ✅ Connect to DB
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

(async () => {
  try {
    await mongoose.connect(DB);
    console.log("✅ DB connected successfully...");

    const adminEmail = "ahmedyasser393923@gmail.com";
    const adminPassword = "Admin12345678#";

    // ✅ Check if admin already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log(`⚠️ Admin with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    // ✅ Create new superAdmin
    const newAdmin = await User.create({
      name: "Ahmed Yasser",
      email: adminEmail,
      password: adminPassword,
      passwordConfirm: adminPassword,
      role: "superAdmin",
    });

    console.log("🎉 Super admin created successfully:");
    console.log({
      email: newAdmin.email,
      password: adminPassword,
      role: newAdmin.role,
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
})();
