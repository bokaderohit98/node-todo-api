const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {populateTodos, todos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST/todos', () => {
	it('Should create a new todo', (done) => {
		var text = 'Todo for test';
		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toEqual(text)
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find({text}).then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toEqual(text);
				done();
			}).catch((err) => done(err));
		});
	});

	it('Should not create todo with invalid body data', (done) => {
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((err) => done(err));
		});
	});
});


describe('Get/todos', () => {
	it('should get all todos', (done) => {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2);
		})
		.end(done);
	});
});

describe('Get/todos/id', () => {
	it('should return todo doc', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		}).end(done);
	});

	it('should return 404 error', (done) => {
		request(app)
		.get('/todos/1234')
		.expect(404)
		.end(done);
	});
});

describe('Delete/todos/id', () => {
	it('should delete a todo by id', (done) => {
		var id = todos[0]._id.toString();
		request(app)
		.delete(`/todos/${id}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toEqual(todos[0].text)
		}).end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.findById(id).then((todo) => {
				expect(todo).toBe(null);
				done();
			}).catch((err) => done(err));
		});
	});

	it('should return error 404 if todo is not found', (done) => {
		var id = new ObjectID().toString();

		request(app)
		.delete(`/todos/${id}`)
		.expect(404)
		.expect((res) => {
			expect(res.body).toEqual({});
		}).end(done);
	});

	it('should return error 404 id id is invalid', (done) => {
		var id = '123';

		request(app)
		.delete(`/todos/${id}`)
		.expect(404)
		.expect((res) => {
			expect(res.body).toEqual({});
		}).end(done);
	});
});

describe('Patch.todos/id', () => {

	it('should update the todo', (done) => {
		var id = todos[0]._id.toString();
		var newText = 'Updates made in test';

		request(app)
		.patch(`/todos/${id}`)
		.send({
			text: newText,
			completed: true,
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toEqual(id);
		}).end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.findById(id).then((todo) => {
				expect(todo.text).toEqual(newText);
				expect(todo.completed).toEqual(true);
				done();
			}).catch((err) => done(err))
		});
	});

	it('should clear completedAt when todo is not completed', (done) => {
		var id = todos[1]._id.toString();

		request(app)
		.patch(`/todos/${id}`)
		.send({
			completed: false
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id.toString()).toEqual(id);
		}).end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.findById(id).then((todo) => {
				expect(todo.completedAt).toEqual(null);
				done();
			}).catch((err) => done(err));
		});
	});
});


describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toEqual(users[0]._id.toString());
			expect(res.body.email).toEqual(users[0].email.toString());
		}).end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			expect(res.body).toEqual({});
		}).end(done);
	});
});

describe('Post /users', () => {

	it('should create user', (done) => {
		var email = 'example@asd.com';
		var password = '1234567789';

		request(app)
		.post('/users')
		.send({
			email,
			password
		})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toBeTruthy();
			expect(res.body._id).toBeTruthy();
			expect(res.body.email).toBe(email)
		}).end(done);
	});

	it('should return validation error', (done) => {
		var email = 'asssd';
		var password = 'ffjdfjf';

		request(app)
		.post('/users')
		.send({
			email,
			password
		})
		.expect(400)
		.end(done);
	});

	it('should not create user if email in use', (done) => {
		var email = users[0].email;
		var password = '1234567789';

		request(app)
		.post('/users')
		.send({
			email,
			password
		})
		.expect(400)
		.end(done);
	});
});

describe('Post /users/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email,
			password: users[1].password
		})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toBeTruthy();
		}).end((err, res) => {
			if (err) {
				return done(err);
			}
			User.findById(users[1]._id).then((user) => {
				expect(user.tokens[0].token).toEqual(res.headers['x-auth'].toString());
				done();
			}).catch((err) => done(err));
		});
	});

	it('should reject invalid login', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email,
			password: 'something'
		})
		.expect(400)
		.expect((res) => {
			expect(res.body).toEqual({});
		}).end(done);
	});
});

describe('Delete /users/me/token', () => {
	it('should delete auth token on logout ', (done) => {
		request(app)
		.delete('/users/me/token')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body).toEqual({});
		}).end((err, res) => {
			if (err) {
				return done(err);
			}
			User.findById(users[0]._id).then((user) => {
				expect(user.tokens.length).toEqual(0);
				done();
			}).catch((err) => done(err));
		});
	});
});
