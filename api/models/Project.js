const mongoose = require("mongoose");

const Project = mongoose.model("Project", {
	projectCode: {
		type: String,
		required: true,
		minglength: 6
	},
	projectName: {
		type: String,
		required: true,
		minglength: 6
	},
	userList: [
		{
			_userId: mongoose.Schema.Types.ObjectId
		}
	],
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

module.exports = { Project };
