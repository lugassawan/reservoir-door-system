require("dotenv").config();

exports.app = {
	name: process.env.APP_NAME,
	env: process.env.NODE_ENV,
	jwtKey: process.env.JWT_SECRET
};
