require("dotenv").config();

exports.app = {
	name: process.env.APP_NAME,
	jwtKey: process.env.JWT_SECRET
};
