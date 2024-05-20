"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
   class Author extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         
      }
   }
   Author.init(
      {
         name: DataTypes.STRING,
         nationality: DataTypes.STRING,
      },
      {
         sequelize,
         modelName: "Author",
         tableName: "authors",
      }
   );
   return Author;
};
