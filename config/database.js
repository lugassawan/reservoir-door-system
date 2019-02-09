require("dotenv").config();

exports.database = {
	uri: process.env.MONGODB_URI
};
