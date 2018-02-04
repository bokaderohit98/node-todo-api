var mongoose = require('mongoose');

var url = 'mongodb://admin:password@ds223738.mlab.com:23738/bokaderohit98-todoapp'
mongoose.promise = global.promise;
mongoose.connect(url);


module.exports = {
	mongoose
}
