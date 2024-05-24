const { User, Role } = require("../models");
const bcrypt = require("bcrypt");

const authController = {};

authController.register = async (req, res) => {
   try {
      const { first_name, email, password } = req.body;

      if (!first_name || !email || !password) {
         return res.status(400).json({
            success: true,
            message: "Invalid registration fields",
         });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      await User.create({
         first_name,
         email,
         password: hashedPassword,
         role_id: 3, // user role
      });

      res.status(200).json({
         success: true,
         message: `User registered successfully`,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error registering user",
         error: error.message,
      });
   }
};

module.exports = authController;
