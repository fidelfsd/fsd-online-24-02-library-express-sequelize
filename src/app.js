const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./database/db");

const authorController = require("./controllers/authorController");
const bookController = require("./controllers/bookController");

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/api/healthy", (req, res) => {
   res.status(200).json({
      success: true,
      message: "My APP server is healthy",
   });
});

// Author Endpoints
app.post("/api/authors", authorController.create);
app.get("/api/authors", authorController.getAll);
app.get("/api/authors/:id", authorController.getById);
app.put("/api/authors/:id", authorController.update);
app.delete("/api/authors/:id", authorController.delete);

// Book Endpoints
app.post("/api/books", bookController.create);
app.get("/api/books", bookController.getAll);
app.get("/api/books/:id", bookController.getById);
app.put("/api/books/:id", bookController.update);
app.delete("/api/books/:id", bookController.delete);

sequelize
   .authenticate()
   .then(() => {
      console.log("🛢️  Database authenticated");

      // start the server
      app.listen(PORT, () => {
         console.log(`🚀 Server listening on port: ${PORT}`);
      });
   })
   .catch(() => {
      console.error("Error authenticating database");
   });
