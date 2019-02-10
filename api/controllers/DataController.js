const _ = require("lodash");

const { Device } = require("../models/Device");
const { Data } = require("../models/Data");

exports.store = async (req, res) => {
	const data = new Data({
		detail: req.body.message,
		_device: req.device._id
	});

	const active = req.body.active;
	if (active === undefined) {
		return res.status(400).send();
	}

	if (_.isBoolean(active)) {
		isActive = active;
	} else {
		return res.status(400).send();
	}

	data
		.save()
		.then(() => {
			return Device.findOneAndUpdate(
				{
					_id: req.device._id,
					_creator: req.user._id
				},
				{
					$set: { isActive }
				},
				{ new: true }
			);
		})
		.then(device => {
			if (!device) {
				return res.status(404).send();
			}

			res.send({ status: "OK" });
		})
		.catch(e => {
			res.status(400).send(e);
		});
};
