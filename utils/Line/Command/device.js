const _ = require("lodash");
const axios = require("axios");

const { app } = require("../../../config/app");

const device = {};
const instance = axios.create({
	baseURL: `${app.url}`
});

device.two = async (req, user) => {
	const requestSplit = _.split(req, "=");
	const body = _.trim(requestSplit[1], `"`);
	let message = "Perintah tidak sesuai";

	const { tokens } = user;
	instance.defaults.headers.common["x-auth"] = tokens[0].token;

	const sendData = await instance.get(`/projects/${body}/devices`);
	const devices = sendData.data.devices;

	if (_.isEmpty(devices)) {
		message = `Anda belum memiliki device terhubung pada projek tersebut. Untuk melihat perintah yang ada, silahkan ketik "help".`;
	} else {
		const messageText = [];
		devices.forEach(p => {
			const status = p.isActive ? "NYALA" : "MATI";
			messageText.push(
				`Device ID : ${p._id}\r\nNama Device : ${
					p.deviceName
				}\r\nKode Device : ${p.deviceCode}\r\nStatus : ${status}`
			);
		});
		message = `Berikut daftar device Anda yang terhubung pada projek : \r\n\r\n${messageText.join(
			"\r\n\r\n"
		)}`;
	}

	return message;
};

device.three = async (req, user) => {
	const id = _.split(req[0], "=")[1];
	const nameKey = _.split(req[1], "=")[0];
	const body = _.trim(_.split(req[1], "=")[1], `"`);
	let message = "Perintah tidak sesuai";

	const { tokens } = user;
	instance.defaults.headers.common["x-auth"] = tokens[0].token;

	if (nameKey === "name") {
		const sendData = await instance.post(`/projects/${id}/devices`, {
			name: body.replace("-", " ")
		});
		const res = sendData.data;
		const status = res.isActive ? "NYALA" : "MATI";
		message = `Device baru berhasil dibuat.\r\n\r\nDevice ID : ${
			res._id
		}\r\nNama Device : ${res.deviceName}\r\nKode Device : ${
			res.deviceCode
		}\r\nStatus : ${status}`;
	} else if (nameKey === "id") {
		const sendData = await instance.get(`/projects/${id}/devices/${body}`);
		const res = sendData.data.device;
		const status = res.isActive ? "NYALA" : "MATI";
		message = `Informasi device.\r\n\r\nDevice ID : ${
			res._id
		}\r\nNama Device : ${res.deviceName}\r\nKode Device : ${
			res.deviceCode
		}\r\nStatus : ${status}`;
	}

	return message;
};

device.four = async (req, user) => {
	const projectId = _.split(req[0], "=")[1];
	const id = _.split(req[1], "=")[1];
	const nameKey = _.split(req[2], "=")[0];
	const body = _.trim(_.split(req[2], "=")[1], `"`);
	let message = "Perintah tidak sesuai";

	const { tokens } = user;
	instance.defaults.headers.common["x-auth"] = tokens[0].token;

	if (nameKey === "name") {
		const sendData = await instance.patch(
			`/projects/${projectId}/devices/${id}`,
			{
				name: body.replace("-", " ")
			}
		);
		const res = sendData.data.device;
		const status = res.isActive ? "NYALA" : "MATI";
		message = `Device berhasil di perbarui.\r\n\r\nDevice ID : ${
			res._id
		}\r\nNama Device : ${res.deviceName}\r\nKode Device : ${
			res.deviceCode
		}\r\nStatus : ${status}`;
	} else if (nameKey === "hapus") {
		const sendData = await instance.delete(
			`/projects/${projectId}/devices/${id}`
		);
		const res = sendData.data.device;
		const status = res.isActive ? "NYALA" : "MATI";
		message = `Device berhasil di hapus.\r\n\r\nDevice ID : ${
			res._id
		}\r\nNama Device : ${res.deviceName}\r\nKode Device : ${
			res.deviceCode
		}\r\nStatus : ${status}`;
	}

	return message;
};

module.exports = device;
