const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const bookRoutes = require("./book.routes");
const authorRoutes = require("./author.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/authors", authorRoutes);

module.exports = router;
