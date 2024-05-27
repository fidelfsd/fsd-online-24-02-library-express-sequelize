const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/bookController");

// Public routes
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);

// Protected routes
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
