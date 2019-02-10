const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");
const uuidApiKey = require("uuid-apikey");
const randomstring = require("randomstring");

const { app } = require("../../config/app");
const { Project } = require("../../api/models/Project");
const { User } = require("../../api/models/User");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

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
		_id: new ObjectID(),
		projectCode: randomstring.generate(10),
		projectName: "First Project",
		_creator: userOneId
	},
	{
		_id: new ObjectID(),
		projectCode: randomstring.generate(10),
		projectName: "Second Project",
		_creator: userTwoId
	}
];

const populateProjects = done => {
	Project.deleteMany({})
		.then(() => {
			return Project.insertMany(projects);
		})
		.then(() => done())
		.catch(e => done(e));
};

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

module.exports = { projects, populateProjects, users, populateUsers };
