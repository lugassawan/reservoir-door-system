const randomstring = require("randomstring");
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const { Project } = require("../models/Project");

exports.allProject = async (req, res) => {
	Project.find({
		_creator: req.user._id
	}).then(
		projects => {
			res.send({ projects });
		},
		e => {
			res.status(400).send(e);
		}
	);
};

exports.create = async (req, res) => {
	const project = new Project({
		projectCode: randomstring.generate(10),
		projectName: req.body.name,
		_creator: req.user._id
	});

	project.save().then(
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

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Project.findOne({
		_id: id,
		_creator: req.user._id
	})
		.then(project => {
			if (!project) {
				return res.status(404).send();
			}

			res.send({ project });
		})
		.catch(e => {
			res.status(400).send();
		});
};

exports.update = async (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ["name"]);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Project.findOneAndUpdate(
		{
			_id: id,
			_creator: req.user._id
		},
		{ $set: { projectName: body.name } },
		{ new: true }
	)
		.then(project => {
			if (!project) {
				return res.status(404).send();
			}

			res.send({ project });
		})
		.catch(e => {
			res.status(400).send();
		});
};

exports.destroy = async (req, res) => {
	const id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	try {
		const project = await Project.findOneAndDelete({
			_id: id,
			_creator: req.user._id
		});
		if (!project) {
			return res.status(404).send();
		}

		res.send({ project });
	} catch (e) {
		res.status(400).send();
	}
};
