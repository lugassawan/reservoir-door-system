const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { server } = require("../server");
const { User } = require("../api/models/User");
const { users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);

describe("GET /users/me", () => {
	it("should return user if authenticated", done => {
		request(server)
			.get("/users/me")
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it("should return 401 if not authenticated", done => {
		request(server)
			.get("/users/me")
			.expect(401)
			.expect(res => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe("GET /users", () => {
	it("should show greeting", done => {
		request(server)
			.get("/users")
			.expect(200)
			.expect(res => {
				expect(res.body).toEqual({ message: "Hi there" });
			})
			.end(done);
	});
});

describe("POST /users", () => {
	it("should create user", done => {
		const email = "example@example.com";
		const password = "123coba!";

		request(server)
			.post("/users")
			.send({ email, password })
			.expect(200)
			.expect(res => {
				expect(res.headers["x-auth"]).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			.end(err => {
				if (err) {
					return done(err);
				}

				User.findOne({ email })
					.then(user => {
						expect(user).toBeTruthy();
						expect(user.password).not.toBe(password);
						expect(user.apiKey).toBeTruthy();
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should return validation errors if request invalide", done => {
		request(server)
			.post("/users")
			.send({
				email: "lug",
				password: "123"
			})
			.expect(400)
			.end(done);
	});

	it("should not create user if email in user", done => {
		request(server)
			.post("/users")
			.send({
				email: users[0].email,
				password: "Password123!"
			})
			.expect(400)
			.end(done);
	});
});

describe("POST /users/login", () => {
	it("should login user and return auth token", done => {
		request(server)
			.post("/users/login")
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect(res => {
				expect(res.headers["x-auth"]).toBeTruthy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id)
					.then(user => {
						expect(user.toObject().tokens[1]).toMatchObject({
							access: "auth",
							token: res.headers["x-auth"]
						});
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should reject invalid login", done => {
		request(server)
			.post("/users/login")
			.send({
				email: users[1].email,
				password: users[1].password + "1"
			})
			.expect(400)
			.expect(res => {
				expect(res.headers["x-auth"]).toBeFalsy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id)
					.then(user => {
						expect(user.tokens.length).toBe(1);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe("DELETE /users/me/token", () => {
	it("should remove auth token on logout", done => {
		request(server)
			.delete("/users/me/token")
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id)
					.then(user => {
						expect(user.tokens.length).toBe(0);
						done();
					})
					.catch(e => done(e));
			});
	});
});
