const { ObjectID } = require("mongodb");

const { User } = require("../models/User");
const { Device } = require("../models/Device");

const authorization = (req, res, next) => {
	const apiToken = req.header("Api-Token");
	const id = req.params.id;

	if (apiToken === undefined) {
		res.status(404).send();
	}

	if (!ObjectID.isValid(id)) {
		res.status(404).send();
	}

	const auth = apiToken.split(":");

	User.findByApiKey(auth[0])
		.then(user => {
			if (!user) {
				return Promise.reject();
			}

			req.user = user;
			return Device.findOne({ _id: id, deviceCode: auth[1] });
		})
		.then(device => {
			if (!device) {
				return Promise.reject();
			}

			req.device = device;
			next();
		})
		.catch(e => {
			res.status(401).send();
		});
};

module.exports = { authorization };
