const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");
const uuidApiKey = require("uuid-apikey");
const randomstring = require("randomstring");

const { app } = require("../../config/app");
const { User } = require("../../api/models/User");
const { Project } = require("../../api/models/Project");
const { Device } = require("../../api/models/Device");
const { Data } = require("../../api/models/Data");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const projectOneId = new ObjectID();
const projectTwoId = new ObjectID();
const deviceOneId = new ObjectID();
const deviceTwoId = new ObjectID();
const dataOneId = new ObjectID();
const dataTwoId = new ObjectID();

const users = [
	{
		_id: userOneId,
		email: "lugas@example.com",
		password: "userOnePass",
		apiKey: uuidApiKey.create().apiKey,
		tokens: [
			{
				access: "auth",
				token: jwt
					.sign({ _id: userOneId, access: "auth" }, app.jwtKey)
					.toString()
			}
		]
	},
	{
		_id: userTwoId,
		email: "test@example.com",
		password: "userTwoPass",
		apiKey: uuidApiKey.create().apiKey,
		tokens: [
			{
				access: "auth",
				token: jwt
					.sign({ _id: userTwoId, access: "auth" }, app.jwtKey)
					.toString()
			}
		]
	}
];

const projects = [
	{
		_id: projectOneId,
		projectCode: randomstring.generate(10),
		projectName: "First Project",
		_creator: userOneId
	},
	{
		_id: projectTwoId,
		projectCode: randomstring.generate(10),
		projectName: "Second Project",
		_creator: userTwoId
	}
];

const devices = [
	{
		_id: deviceOneId,
		deviceCode: randomstring.generate(10),
		deviceName: "First Device",
		_project: projectOneId,
		_creator: userOneId
	},
	{
		_id: deviceTwoId,
		deviceCode: randomstring.generate(10),
		deviceName: "Second Device",
		_project: projectTwoId,
		_creator: userTwoId
	}
];

const datas = [
	{
		_id: dataOneId,
		detail: {
			status: false
		},
		_device: deviceOneId
	},
	{
		_id: dataTwoId,
		detail: {
			status: false
		},
		_device: deviceTwoId
	}
];

const populateUsers = done => {
	User.deleteMany({})
		.then(() => {
			const userOne = new User(users[0]).save();
			const userTwo = new User(users[1]).save();

			return Promise.all([userOne, userTwo]);
		})
		.then(() => done())
		.catch(e => done(e));
};

const populateProjects = done => {
	Project.deleteMany({})
		.then(() => {
			return Project.insertMany(projects);
		})
		.then(() => done())
		.catch(e => done(e));
};

const populateDevices = done => {
	Device.deleteMany({})
		.then(() => {
			return Device.insertMany(devices);
		})
		.then(() => done())
		.catch(e => done(e));
};

const populateDatas = done => {
	Data.deleteMany({})
		.then(() => {
			return Data.insertMany(datas);
		})
		.then(() => done())
		.catch(e => done(e));
};

module.exports = {
	datas,
	populateDatas,
	devices,
	populateDevices,
	projects,
	populateProjects,
	users,
	populateUsers
};
