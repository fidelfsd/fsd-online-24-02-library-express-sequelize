const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");
const auth = require("../middlewares/auth");

// User routes
router.get("/profile", auth, ctrl.getUserProfile);
router.put("/profile", auth, ctrl.updateUserProfile);
router.get("/favorite_books", auth, ctrl.getUserFavoriteBooks);
router.post("/favorite_books", auth, ctrl.addFavoriteBookToUser);
router.delete("/favorite_books/:bookId", auth, ctrl.removeFavoriteBookFromUser);
router.get("/loans", auth, ctrl.getUserLoans);

// Protected routes
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);
router.get("/:id/loans", ctrl.getLoansByUserId);

module.exports = router;
