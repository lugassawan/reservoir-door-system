const Client = require("@line/bot-sdk").Client;
const _ = require("lodash");

const { line } = require("../../config/line");
const lineMessage = require("../../utils/Line/LineMessage");

const config = {
	channelAccessToken: line.token,
	channelSecret: line.secret
};

const client = new Client(config);

const handleEvent = async event => {
	if (event.type !== "message" || event.message.type !== "text") {
		return Promise.resolve(null);
	}

	const message = event.message.text;
	let messageText = event.message.text;
	const userId = event.source.userId;
	if (message === "help" || message === "Help") {
		messageText = `Untuk mengakses fitur pada bot ini silahkan ketik salah satu perintah di bawah ini.
		
		- help, Help
		- info

		- daftar email="example@gmail.com" password="12345678"
		
		- project
		- project name="Nama-Projek"
		- project id=932m823
		- project id=8829321 name="Nama-Projek-Baru"
		- project id=1182191 hapus

		- device project=162718318128
		- device project=162718318128 name="Nama-Device-1"
		- device project=162718318128 id=91811291
		- device project=162718318128 id=99128912 name="Nama-Device-Baru"
		- device project=162718318128 id=91212912 hapus
		`;
	} else if (
		_.startsWith(message, "project") ||
		_.startsWith(message, "device") ||
		_.startsWith(message, "daftar") ||
		_.startsWith(message, "info")
	) {
		messageText = await lineMessage.init(message, userId);
	} else {
		messageText =
			'Maaf, perintah yang Anda masukkan salah. Untuk melihat perintah yang ada, silahkan ketik "help".';
	}

	const echo = { type: "text", text: messageText };
	return client.replyMessage(event.replyToken, echo);
};

exports.webhook = (req, res) => {
	Promise.all(req.body.events.map(handleEvent))
		.then(result => res.json(result))
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
};
