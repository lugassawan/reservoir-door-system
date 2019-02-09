const _ = require("lodash");

const { User } = require("../models/User");

exports.greeting = async (req, res) => {
	res.status(200).send({ message: "Hi there" });
};

exports.register = async (req, res) => {
	try {
		const body = _.pick(req.body, ["email", "password"]);
		const user = new User(body);
		await user.save();
		const token = await user.generateAuthToken();
		res.header("x-auth", token).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
};

exports.profil = async (req, res) => {
	res.send(req.user);
};

exports.login = async (req, res) => {
	try {
		const body = _.pick(req.body, ["email", "password"]);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header("x-auth", token).send(user);
	} catch (e) {
		res.status(400).send();
	}
};

exports.logout = async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();
	} catch (e) {
		res.status(400).send();
	}
};
