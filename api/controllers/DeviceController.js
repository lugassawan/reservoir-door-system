const randomstring = require("randomstring");
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const { Device } = require("../models/Device");

exports.allDevice = async (req, res) => {
	Device.find({
		_project: req.params.projectId,
		_creator: req.user._id
	}).then(
		devices => {
			res.send({ devices });
		},
		e => {
			res.status(400).send(e);
		}
	);
};

exports.create = async (req, res) => {
	const device = new Device({
		deviceCode: randomstring.generate(10),
		deviceName: req.body.name,
		_project: req.params.projectId,
		_creator: req.user._id
	});

	device.save().then(
		doc => {
			res.send(doc);
		},
		e => {
			res.status(400).send(e);
		}
	);
};

exports.show = async (req, res) => {
	const id = req.params.id;
	const projectId = req.params.projectId;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (!ObjectID.isValid(projectId)) {
		return res.status(404).send();
	}

	Device.findOne({
		_id: id,
		_project: projectId,
		_creator: req.user._id
	})
		.then(device => {
			if (!device) {
				return res.status(404).send();
			}

			res.send({ device });
		})
		.catch(e => {
			res.status(400).send();
		});
};

exports.update = async (req, res) => {
	const id = req.params.id;
	const projectId = req.params.projectId;
	const body = _.pick(req.body, ["name"]);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (!ObjectID.isValid(projectId)) {
		return res.status(404).send();
	}

	Device.findOneAndUpdate(
		{
			_id: id,
			_project: projectId,
			_creator: req.user._id
		},
		{
			$set: { deviceName: body.name }
		},
		{ new: true }
	)
		.then(device => {
			if (!device) {
				return res.status(404).send();
			}

			res.send({ device });
		})
		.catch(e => {
			res.status(400).send();
		});
};

exports.destroy = async (req, res) => {
	const id = req.params.id;
	const projectId = req.params.projectId;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (!ObjectID.isValid(projectId)) {
		return res.status(404).send();
	}

	try {
		const device = await Device.findOneAndDelete({
			_id: id,
			_project: projectId,
			_creator: req.user._id
		});
		if (!device) {
			return res.status(404).send();
		}

		res.send({ device });
	} catch (e) {
		res.status(400).send();
	}
};
