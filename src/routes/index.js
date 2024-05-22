const express = require("express");
const router = express.Router();
const authorRoutes = require("./author.routes");
const bookRoutes = require("./book.routes");
const userRoutes = require("./user.routes");

router.use("/authors", authorRoutes);
router.use("/books", bookRoutes);
router.use("/users", userRoutes);

module.exports = router;
