const _ = require("lodash");
const axios = require("axios");

const { app } = require("../../../config/app");

const project = {};
const instance = axios.create({
	baseURL: `${app.url}`
});

project.one = async user => {
	const { tokens } = user;
	instance.defaults.headers.common["x-auth"] = tokens[0].token;
	const sendData = await instance.get("/projects");

	const projects = sendData.data.projects;
	let message = "Ok";
	if (_.isEmpty(projects)) {
		message = `Anda belum memiliki projek sama sekali. Untuk melihat perintah yang ada, silahkan ketik "help".`;
	} else {
		const messageText = [];
		projects.forEach(p => {
			messageText.push(
				`Projek ID : ${p._id}\r\nNama Projek : ${
					p.projectName
				}\r\nKode Projek : ${p.projectCode}`
			);
		});
		message = `Berikut daftar projek Anda : \r\n\r\n${messageText.join(
			"\r\n\r\n"
		)}`;
	}

	return message;
};

project.two = async (req, user) => {
	const requestSplit = _.split(req, "=");
	const nameKey = requestSplit[0];
	const body = _.trim(requestSplit[1], `"`);
	let message = "Perintah tidak sesuai";

	const { tokens } = user;
	instance.defaults.headers.common["x-auth"] = tokens[0].token;

	if (nameKey === "name") {
		const sendData = await instance.post("/projects", {
			name: body.replace("-", " ")
		});
		const res = sendData.data;
		message = `Projek baru berhasil dibuat.\r\n\r\nProjek ID : ${
			res._id
		}\r\nNama Projek : ${res.projectName}\r\nKode Projek : ${res.projectCode}`;
	} else if (nameKey === "id") {
		const sendData = await instance.get(`/projects/${body}`);
		const res = sendData.data.project;
		message = `Informasi projek.\r\n\r\nProjek ID : ${
			res._id
		}\r\nNama Projek : ${res.projectName}\r\nKode Projek : ${res.projectCode}`;
	}

	return message;
};

project.three = async (req, user) => {
	const id = _.split(req[0], "=")[1];
	const nameKey = _.split(req[1], "=")[0];
	const body = _.trim(_.split(req[1], "=")[1], `"`);
	let message = "Perintah tidak sesuai";

	const { tokens } = user;
	instance.defaults.headers.common["x-auth"] = tokens[0].token;

	if (nameKey === "name") {
		const sendData = await instance.patch(`/projects/${id}`, {
			name: body.replace("-", " ")
		});
		const res = sendData.data.project;
		message = `Projek berhasil di perbarui.\r\n\r\nProjek ID : ${
			res._id
		}\r\nNama Projek : ${res.projectName}\r\nKode Projek : ${res.projectCode}`;
	} else if (nameKey === "hapus") {
		const sendData = await instance.delete(`/projects/${id}`);
		const res = sendData.data.project;
		message = `Projek berhasil di hapus.\r\n\r\nProjek ID : ${
			res._id
		}\r\nNama Projek : ${res.projectName}\r\nKode Projek : ${res.projectCode}`;
	}

	return message;
};

module.exports = project;
