const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { app } = require("../../config/app");
const { User } = require("../../api/models/User");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
	{
		_id: userOneId,
		email: "lugas@example.com",
		password: "userOnePass",
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

module.exports = { users, populateUsers };
