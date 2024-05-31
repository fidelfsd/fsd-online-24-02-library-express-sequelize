const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// User routes
router.get("/profile", auth, ctrl.getUserProfile);
router.put("/profile", auth, ctrl.updateUserProfile);
router.get("/favorite_books", auth, ctrl.getUserFavoriteBooks);
router.post("/favorite_books", auth, ctrl.addFavoriteBookToUser);
router.delete("/favorite_books/:bookId", auth, ctrl.removeFavoriteBookFromUser);
router.get("/loans", auth, ctrl.getUserLoans);

// Protected routes
router.get("/", auth, authorize("admin"), ctrl.getAll);
router.get("/:id", auth, authorize("admin"), ctrl.getById);
router.put("/:id", auth, authorize("admin"), ctrl.update);
router.delete("/:id", ctrl.delete);
router.get(
   "/:id/loans",
   auth,
   authorize("admin", "manager"),
   ctrl.getLoansByUserId
);

module.exports = router;
