// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, database) => {
	if (err) {
		console.log('Unable toconnect to database');
		return;
	}
	console.log('Connected to MongoDB server');
	const db = database.db('TodoApp');

	// db.collection('Todos').find({
	// 	_id: new ObjectID('5a756e8e862cc41823723b28'),
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch');
	// })

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log('Todos');
	// 	console.log(`Total todos: ${count}`);
	// }, (err) => {
	// 	console.log('Unable to fetch');
	// })

	db.collection('Users')
	.find({name: 'Rohit Bokade'})
	.toArray()
	.then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
			console.log('Unable to fetch');
	})

	//database.close();
});