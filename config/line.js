require("dotenv").config();

exports.line = {
	token: process.env.LINE_CHANNEL_ACCESS_TOKEN,
	secret: process.env.LINE_CHANNEL_SECRET
};
