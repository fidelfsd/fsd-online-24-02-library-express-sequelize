const { User, Loan, Book, FavoriteBook } = require("../models");
const bcrypt = require("bcrypt");
const userController = {};

userController.getAll = async (req, res) => {
   try {
      const users = await User.findAll({
         attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      });

      res.status(200).json({
         success: true,
         message: "Users retreived successfully",
         data: users,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error retreiving users",
         error: error.message,
      });
   }
};

userController.getById = async (req, res) => {
   const userId = req.params.id;

   try {
      const user = await User.findByPk(userId, {
         attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      });

      if (!user) {
         return res.status(404).json({
            success: true,
            message: "User not found",
         });
      }

      res.status(200).json({
         success: true,
         message: "User retreived successfully",
         data: user,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error retreinving user",
         error: error.message,
      });
   }
};

userController.update = async (req, res) => {
   const userId = req.params.id;
   const { password, role_id, ...restUserData } = req.body;

   try {
      const userToUpdate = await User.findByPk(userId);

      if (!userToUpdate) {
         return res.status(404).json({
            success: true,
            message: "User not found",
         });
      }

      if (password) {
         const hashedPassword = bcrypt.hashSync(password, 10);
         userToUpdate.password = hashedPassword;
      }

      userToUpdate.set({
         ...userToUpdate,
         ...restUserData,
      });

      await userToUpdate.save();

      res.status(200).json({
         success: true,
         message: "User updated successfully",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error updating user",
         error: error.message,
      });
   }
};

userController.delete = async (req, res) => {
   const userId = req.params.id;

   try {
      const deleteResult = await User.destroy({
         where: {
            id: userId,
         },
      });

      if (deleteResult === 0) {
         return res.status(404).json({
            success: true,
            message: "User not found",
         });
      }

      res.status(200).json({
         success: true,
         message: "User deleted successfully",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error deleting user",
         error: error.message,
      });
   }
};

userController.getLoansByUserId = async (req, res) => {
   try {
      const userId = req.params.id;

      const user = await User.findByPk(userId, {
         include: [
            {
               model: Loan,
               as: "loans",
               include: [
                  {
                     model: Book,
                     as: "book",
                     attributes: {
                        exclude: ["createdAt", "updatedAt"],
                     },
                  },
               ],
               attributes: {
                  exclude: ["createdAt", "updatedAt", "user_id", "book_id"],
               },
            },
         ],
      });

      if (!user) {
         return res.status(404).json({
            success: true,
            message: "User not found",
         });
      }
      // Ver todas las propiedades y metodos del objeto, incluido los metodos especiales
      console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(user)));

      res.status(200).json({
         success: true,
         message: "User loans retrieved successfully",
         data: user.loans,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error retrieving user's loan",
         error: error.message,
      });
   }
};

userController.getLoansByUserId_version2 = async (req, res) => {
   try {
      const userId = req.params.id;

      const user = await User.findByPk(userId);

      if (!user) {
         return res.status(404).json({
            success: true,
            message: "User not found",
         });
      }

      // Usando metodos especiales
      // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
      const loans = await user.getLoans({
         attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      res.status(200).json({
         success: true,
         message: "User loans retrieved successfully",
         data: loans,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error retrieving user's loan",
         error: error.message,
      });
   }
};

userController.getUserFavoriteBooks = async (req, res) => {
   try {
      const userId = 4;

      // Using eager loading
      const user = await User.findByPk(userId, {
         include: [
            {
               model: Book,
               as: "favoriteBooks",
               attributes: { exclude: ["createdAt", "updatedAt"] },
               through: {
                  attributes: [],
               },
            },
         ],
      });

      // Using special methods (lazy loading)
      const favorites = await user.getFavoriteBooks({
         attributes: { exclude: ["createdAt", "updatedAt"] },
         joinTableAttributes: [],
      });

      res.status(200).json({
         success: true,
         message: "Favorite books retrieved successfully",
         data: favorites,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error retrieving favorite books",
         error: error.message,
      });
   }
};

userController.addFavoriteBookToUser = async (req, res) => {
   try {
      const userId = 4;

      const bookId = Number(req.body.bookId);
      const bookToAdd = await Book.findByPk(bookId);

      if (!bookToAdd) {
         return res.status(404).json({
            success: true,
            message: "Book not found",
         });
      }

      const favorite = await FavoriteBook.findOne({
         where: {
            user_id: userId,
            book_id: bookId,
         },
      });

      if (favorite) {
         return res.status(400).json({
            success: true,
            message: "Book is already in the favorites list",
         });
      }

      await FavoriteBook.create({
         user_id: userId,
         book_id: bookId,
      });

      res.status(200).json({
         success: true,
         message: "Book added to favorites list",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error adding favorite book",
         error: error.message,
      });
   }
};

userController.addFavoriteBookToUser_version2 = async (req, res) => {
   try {
      const userId = 4;

      const bookId = Number(req.body.bookId);

      const user = await User.findByPk(userId);
      const bookToAdd = await Book.findByPk(bookId);

      if (!bookToAdd) {
         return res.status(404).json({
            success: true,
            message: "Book not found",
         });
      }

      // Using special methods
      const favorite = await user.hasFavoriteBook(bookToAdd);

      if (favorite) {
         return res.status(400).json({
            success: true,
            message: "Book is already in the favorites list",
         });
      }

      // Using special methods
      await user.addFavoriteBook(bookToAdd);

      res.status(200).json({
         success: true,
         message: "Book added to favorites list",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error adding favorite book",
         error: error.message,
      });
   }
};

userController.removeFavoriteBookFromUser = async (req, res) => {
   try {
      const userId = 4;
      const bookId = Number(req.body.bookId);

      const bookToRemove = await Book.findByPk(bookId);

      if (!bookToRemove) {
         return res.status(404).json({
            success: true,
            message: "Book not found",
         });
      }

      const deleteResult = await FavoriteBook.destroy({
         where: {
            user_id: userId,
            book_id: bookId,
         },
      });

      if (deleteResult === 0) {
         return res.status(404).json({
            success: true,
            message: "Favorite book not found for user",
         });
      }

      res.status(200).json({
         success: true,
         message: "Book removed from favorite list",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error removing book from favorites",
         error: error.message,
      });
   }
};

userController.removeFavoriteBookFromUser_version2 = async (req, res) => {
   try {
      const userId = 4;
      const bookId = Number(req.body.bookId);

      const user = await User.findByPk(userId);
      const bookToRemove = await Book.findByPk(bookId);

      if (!bookToRemove) {
         return res.status(404).json({
            success: true,
            message: "Book not found",
         });
      }

      const favorite = await user.hasFavoriteBook(bookToRemove);

      if (!favorite) {
         return res.status(404).json({
            success: true,
            message: "Favorite book not found for user",
         });
      }

      await user.removeFavoriteBook(bookToRemove);

      res.status(200).json({
         success: true,
         message: "Book removed from favorite list",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error removing book from favorites",
         error: error.message,
      });
   }
};

module.exports = userController;
