const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First todo'
}, {
	_id: new ObjectID(),
	text: 'Second todo',
	completed: true,
	completedAt: 123
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

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
