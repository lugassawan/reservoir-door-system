const mongoose = require("mongoose");

const Device = mongoose.model("Device", {
	deviceCode: {
		type: String,
		required: true,
		minglength: 6
	},
	deviceName: {
		type: String,
		required: true,
		minglength: 6
	},
	isActive: {
		type: Boolean,
		default: false
	},
	_project: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

module.exports = { Device };
