const mongoose = require("mongoose");

const Data = mongoose.model(
	"Data",
	new mongoose.Schema(
		{
			detail: {
				type: Object,
				required: true
			},
			_device: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			}
		},
		{ timestamps: true }
	)
);

module.exports = { Data };
