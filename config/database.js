require("dotenv").config();

const env = process.env.NODE_ENV || "development";

var uri;

if (env === "test") {
	uri = process.env.MONGODB_URI_TEST;
} else {
	uri = process.env.MONGODB_URI;
}

exports.database = {
	uri
};
