// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, database) => {
	if (err) {
		console.log('Unable toconnect to database');
		return;
	}
	console.log('Connected to MongoDB server');
	const db = database.db('TodoApp');

 	//delete many
 	// db.collection('Todos').deleteMany({text: 'Lunch'})
 	// .then((result) => {
 	// 	console.log(result);
 	// });

 	//delete one
 	// db.collection('Todos')
 	// .deleteOne({
 	// 	text: 'Lunch'
 	// })
 	// .then((res) => {
 	// 	console.log(res);
 	// });


 	//find and delete
 	// db.collection('Todos')
 	// .findOneAndDelete({
 	// 	completed: false
 	// })
 	// .then((res) => {
 	// 	console.log(res.value);
 	// })
	//database.close();

	db.collection('Users')
	.deleteMany({name: 'Rohit Bokade'}).
	then((res) => {
		console.log(res);
	});

	db.collection('Users')
	.findOneAndDelete({_id: new ObjectID('5a758be316532709a44f98d1')})
	.then((res) => {
		console.log(res);
	});
});