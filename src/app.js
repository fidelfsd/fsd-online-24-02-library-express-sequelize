const express = require("express");
const dotenv = require("dotenv");
const apiRoutes = require("./routes");

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());

// Register utilities routes
app.get("/api/healthy", (req, res) => {
   res.status(200).json({
      success: true,
      message: "My APP server is healthy",
   });
});

// Register API routes
app.use("/api", apiRoutes);

module.exports = app;
