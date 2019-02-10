const express = require("express");

const { authorization } = require("../middleware/authorization");
const DataController = require("../controllers/DataController");

const route = express.Router();

route.post("/:id", authorization, DataController.store);

module.exports = route;
