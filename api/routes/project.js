const express = require("express");

const { authenticate } = require("../middleware/authenticate");
const ProjectController = require("../controllers/ProjectController");

const route = express.Router();

route.get("/", authenticate, ProjectController.allProject);
route.post("/", authenticate, ProjectController.create);
route.get("/:id", authenticate, ProjectController.show);
route.patch("/:id", authenticate, ProjectController.update);
route.delete("/:id", authenticate, ProjectController.destroy);

module.exports = route;
