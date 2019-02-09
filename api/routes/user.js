const express = require("express");

const { authenticate } = require("../middleware/authenticate");
const UserController = require("../controllers/UserController");

const route = express.Router();

route.get("/", UserController.greeting);
route.post("/", UserController.register);
route.get("/me", authenticate, UserController.profil);
route.post("/login", UserController.login);
route.delete("/me/token", authenticate, UserController.logout);

module.exports = route;
