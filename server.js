const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const pino = require("pino")();

const { mongoose } = require("./database/mongoose");
const { app } = require("./config/app");

const userRoutes = require("./api/routes/user");
const projectRoutes = require("./api/routes/project");
const deviceRoutes = require("./api/routes/device");

const server = express();
const PORT = process.env.PORT || 5000;

if (app.env !== "test") {
	server.use(logger("dev"));
}

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use("/users", userRoutes);
server.use("/projects", projectRoutes);
server.use("/projects", deviceRoutes);

server.listen(PORT, err => {
	if (!err) {
		pino.info(
			`${
				app.name
			} Engine is listening on port: ${PORT} & run on enviroment mode: ${
				app.env
			}`
		);
	} else {
		pino.error(err);
	}
});

module.exports = { server };
