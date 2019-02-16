const _ = require("lodash");
const axios = require("axios");

const { app } = require("../../config/app");
const { User } = require("../../api/models/User");

const projectCommand = require("./Command/project");
const deviceCommand = require("./Command/device");

const message = {};
const instance = axios.create({
	baseURL: `${app.url}`
});

register = async (data, userId) => {
	const email = _.trim(_.split(data[1], "=")[1], `"`);
	const password = _.trim(_.split(data[2], "=")[1], `"`);

	const user = await User.findOne({ email });
	if (user) {
		return "Email sudah terdaftar";
	}

	const userByLine = await User.findOne({ lineId: userId });
	if (userByLine) {
		return "Akun line Anda sudah terdaftar";
	}

	const sendData = await instance.post("/users", {
		email,
		password,
		lineId: userId
	});
	const res = sendData.data;
	const sendMessageReplay = `Berikut data untuk mengakses fitur pada bot ini.

	Email : ${res.email}
	Api Key : ${res.apiKey}
	`;
	return sendMessageReplay;
};

userInfo = async (data, userId) => {
	const userByLine = await User.findOne({ lineId: userId });
	if (!userByLine) {
		return "Akun belum terdaftar";
	}

	const { email, apiKey } = userByLine;
	const sendMessageReplay = `Berikut data untuk mengakses fitur pada bot ini.\r\n\r\nEmail : ${email}\r\nApi Key : ${apiKey}`;
	return sendMessageReplay;
};

project = async (data, userId) => {
	const userByLine = await User.findOne({ lineId: userId });
	if (!userByLine) {
		return "Akun belum terdaftar";
	}

	let sendMessageReplay = "Perintah tidak sesuai";

	if (data.length === 1) {
		sendMessageReplay = projectCommand.one(userByLine);
	} else if (data.length === 2) {
		sendMessageReplay = projectCommand.two(data[1], userByLine);
	} else if (data.length === 3) {
		const req = [data[1], data[2]];
		sendMessageReplay = projectCommand.three(req, userByLine);
	}

	return sendMessageReplay;
};

device = async (data, userId) => {
	const userByLine = await User.findOne({ lineId: userId });
	if (!userByLine) {
		return "Akun belum terdaftar";
	}

	let sendMessageReplay = "Perintah tidak sesuai";

	if (data.length === 2) {
		sendMessageReplay = deviceCommand.two(data[1], userByLine);
	} else if (data.length === 3) {
		const req = [data[1], data[2]];
		sendMessageReplay = deviceCommand.three(req, userByLine);
	} else if (data.length === 4) {
		const req = [data[1], data[2], data[3]];
		sendMessageReplay = deviceCommand.four(req, userByLine);
	}

	return sendMessageReplay;
};

message.init = async (message, userId) => {
	const command = _.split(message, " ");
	let data = "Terjadi kesalahan";
	if (command[0] === "project") {
		data = project(command, userId);
	} else if (command[0] === "device") {
		data = device(command, userId);
	} else if (command[0] === "daftar") {
		data = register(command, userId);
	} else if (command[0] === "info") {
		data = userInfo(command, userId);
	}

	return data;
};

module.exports = message;
