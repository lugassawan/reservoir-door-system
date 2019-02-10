const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { server } = require("../server");
const { User } = require("../api/models/User");
const { Project } = require("../api/models/Project");
const { Device } = require("../api/models/Device");
const {
	devices,
	populateDevices,
	projects,
	populateProjects,
	users,
	populateUsers
} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateProjects);
beforeEach(populateDevices);

describe("POST /projects/:projectId/devices", () => {
	it("should create a new device", done => {
		const name = "Device test name";

		request(server)
			.post(`/projects/${projects[0]._id.toHexString()}/devices`)
			.set("x-auth", users[0].tokens[0].token)
			.send({ name })
			.expect(200)
			.expect(res => {
				expect(res.body.deviceName).toBe(name);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Device.find({ deviceName: name })
					.then(devices => {
						expect(devices.length).toBe(1);
						expect(devices[0].deviceName).toBe(name);
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should not create device with invalid body data", done => {
		request(server)
			.post(`/projects/${projects[0]._id.toHexString()}/devices`)
			.set("x-auth", users[0].tokens[0].token)
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Device.find()
					.then(devices => {
						expect(devices.length).toBe(2);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe("GET /projects/:projectId/devices", () => {
	it("should get all devices", done => {
		request(server)
			.get(`/projects/${projects[0]._id.toHexString()}/devices`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.devices.length).toBe(1);
			})
			.end(done);
	});
});

describe("GET /projects/:projectId/devices/:id", () => {
	it("should return device doc", done => {
		request(server)
			.get(
				`/projects/${projects[0]._id.toHexString()}/devices/${devices[0]._id.toHexString()}`
			)
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.device.deviceCode).toBe(devices[0].deviceCode);
				expect(res.body.device.deviceName).toBe(devices[0].deviceName);
			})
			.end(done);
	});

	it("should not return device doc created by other user", done => {
		request(server)
			.get(
				`/projects/${projects[1]._id.toHexString()}/devices/${devices[1]._id.toHexString()}`
			)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should not return device doc from other project", done => {
		request(server)
			.get(
				`/projects/${projects[0]._id.toHexString()}/devices/${devices[1]._id.toHexString()}`
			)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should return 404 if device not found", done => {
		const hexId = new ObjectID().toHexString();

		request(server)
			.get(`/projects/${projects[0]._id.toHexString()}/devices/${hexId}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should return 404 for non-object ids", done => {
		request(server)
			.get(`/projects/${projects[0]._id.toHexString()}/devices/123abc`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe("DELETE /projects/:projectId/devices/:id", () => {
	it("should remove a device", done => {
		const hexId = devices[1]._id.toHexString();

		request(server)
			.delete(`/projects/${projects[1]._id.toHexString()}/devices/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.device._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Device.findById(hexId)
					.then(device => {
						expect(device).toBeFalsy();
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should not remove a device", done => {
		const hexId = devices[0]._id.toHexString();

		request(server)
			.delete(`/projects/${projects[0]._id.toHexString()}/devices/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Device.findById(hexId)
					.then(device => {
						expect(device).toBeTruthy();
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should not remove a device if it is different project", done => {
		const hexId = devices[0]._id.toHexString();

		request(server)
			.delete(`/projects/${projects[1]._id.toHexString()}/devices/${hexId}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Device.findById(hexId)
					.then(device => {
						expect(device).toBeTruthy();
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should return 404 if device not found", done => {
		const hexId = new ObjectID().toHexString();

		request(server)
			.delete(`/projects/${projects[1]._id.toHexString()}/devices/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should return 404 if object id is invalid", done => {
		request(server)
			.delete(`/projects/${projects[1]._id.toHexString()}/devices/123abc`)
			.set("x-auth", users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe("PACTH /projects/:projectId/devices/:id", () => {
	it("should update the device", done => {
		const hexId = devices[0]._id.toHexString();
		const name = "This should be the new device name";

		request(server)
			.patch(`/projects/${projects[0]._id.toHexString()}/devices/${hexId}`)
			.set("x-auth", users[0].tokens[0].token)
			.send({
				name
			})
			.expect(200)
			.expect(res => {
				expect(res.body.device.deviceName).toBe(name);
			})
			.end(done);
	});

	it("should not update the device created by other user ", done => {
		const hexId = devices[0]._id.toHexString();
		const name = "This should be the new device name";

		request(server)
			.patch(`/projects/${projects[0]._id.toHexString()}/devices/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.send({
				name
			})
			.expect(404)
			.end(done);
	});

	it("should not update the device created by other project ", done => {
		const hexId = devices[0]._id.toHexString();
		const name = "This should be the new device name";

		request(server)
			.patch(`/projects/${projects[1]._id.toHexString()}/devices/${hexId}`)
			.set("x-auth", users[0].tokens[0].token)
			.send({
				name
			})
			.expect(404)
			.end(done);
	});
});

describe("POST /projects", () => {
	it("should create a new project", done => {
		const name = "Test project";

		request(server)
			.post("/projects")
			.set("x-auth", users[0].tokens[0].token)
			.send({ name })
			.expect(200)
			.expect(res => {
				expect(res.body.projectName).toBe(name);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Project.find({ projectName: name })
					.then(projects => {
						expect(projects.length).toBe(1);
						expect(projects[0].projectName).toBe(name);
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should not create project with invalid body data", done => {
		request(server)
			.post("/projects")
			.set("x-auth", users[0].tokens[0].token)
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Project.find()
					.then(projects => {
						expect(projects.length).toBe(2);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe("GET /projects", () => {
	it("should get all projects", done => {
		request(server)
			.get("/projects")
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.projects.length).toBe(1);
			})
			.end(done);
	});
});

describe("GET /projects/:id", () => {
	it("should return project doc", done => {
		request(server)
			.get(`/projects/${projects[0]._id.toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.project.projectCode).toBe(projects[0].projectCode);
				expect(res.body.project.projectName).toBe(projects[0].projectName);
			})
			.end(done);
	});

	it("should not return project doc created by other user", done => {
		request(server)
			.get(`/projects/${projects[1]._id.toHexString()}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should return 404 if project not found", done => {
		const hexId = new ObjectID().toHexString();

		request(server)
			.get(`/projects/${hexId}`)
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should return 404 for non-object ids", done => {
		request(server)
			.get("/projects/123abc")
			.set("x-auth", users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe("DELETE /projects/:id", () => {
	it("should remove a project", done => {
		const hexId = projects[1]._id.toHexString();

		request(server)
			.delete(`/projects/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.project._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Project.findById(hexId)
					.then(project => {
						expect(project).toBeFalsy();
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should not remove a project", done => {
		const hexId = projects[0]._id.toHexString();

		request(server)
			.delete(`/projects/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Project.findById(hexId)
					.then(project => {
						expect(project).toBeTruthy();
						done();
					})
					.catch(e => done(e));
			});
	});

	it("should return 404 if project not found", done => {
		const hexId = new ObjectID().toHexString();

		request(server)
			.delete(`/projects/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it("should return 404 if object id is invalid", done => {
		request(server)
			.delete("/projects/123abc")
			.set("x-auth", users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe("PACTH /projects/:id", () => {
	it("should update the project", done => {
		const hexId = projects[0]._id.toHexString();
		const name = "This should be the new project name";

		request(server)
			.patch(`/projects/${hexId}`)
			.set("x-auth", users[0].tokens[0].token)
			.send({
				name
			})
			.expect(200)
			.expect(res => {
				expect(res.body.project.projectName).toBe(name);
			})
			.end(done);
	});

	it("should not update the project created by other user ", done => {
		const hexId = projects[0]._id.toHexString();
		const name = "This should be the new project name";

		request(server)
			.patch(`/projects/${hexId}`)
			.set("x-auth", users[1].tokens[0].token)
			.send({
				name
			})
			.expect(404)
			.end(done);
	});
});

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
