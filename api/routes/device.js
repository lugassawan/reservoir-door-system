const express = require("express");

const { authenticate } = require("../middleware/authenticate");
const DeviceController = require("../controllers/DeviceController");

const route = express.Router();

route.get("/:projectId/devices", authenticate, DeviceController.allDevice);
route.post("/:projectId/devices", authenticate, DeviceController.create);
route.get("/:projectId/devices/:id", authenticate, DeviceController.show);
route.patch("/:projectId/devices/:id", authenticate, DeviceController.update);
route.delete("/:projectId/devices/:id", authenticate, DeviceController.destroy);

module.exports = route;
