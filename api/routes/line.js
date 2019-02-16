const express = require("express");
const middleware = require("@line/bot-sdk").middleware;

const { line } = require("../../config/line");
const LineController = require("../controllers/LineController");

const route = express.Router();

const config = {
	channelAccessToken: line.token,
	channelSecret: line.secret
};

route.post("/webhook", middleware(config), LineController.webhook);

module.exports = route;
