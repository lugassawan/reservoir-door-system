const mongoose = require("mongoose");

const { database } = require("../config/database");

mongoose.Promise = global.Promise;

mongoose.connect(database.uri, { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

module.exports = { mongoose };
