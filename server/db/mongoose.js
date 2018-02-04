var mongoose = require('mongoose');

var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/TodoApp';
mongoose.promise = global.promise;
mongoose.connect(url);


module.exports = {
	mongoose
}
