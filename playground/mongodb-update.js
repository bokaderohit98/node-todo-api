// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, database) => {
	if (err) {
		console.log('Unable toconnect to database');
		return;
	}
	console.log('Connected to MongoDB server');
	const db = database.db('TodoApp');

	// db.collection('Todos')
	// .findOneAndUpdate({
	// 	_id: new ObjectID('5a756e8e862cc41823723b28')
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// },
	// {
	// 	returnOrigional: false
	// })
	// .then((res) => {
	// 	console.log(res);
	// })

	db.collection('Users')
	.findOneAndUpdate({
		_id: new ObjectID('5a7582ae69e71f0d81c2f6a5')
	}, {
		$set: {
			name: 'Keshav Dutt Asnora'
		},
		$inc: {
			age: 1
		}
	}, {
		resturnOrigional: false
	})
	.then((res) => {
		console.log(res);
	})
});