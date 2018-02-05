var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var UserSchema = new mongoose.Schema({
		email: {
			type: String,
			required: true,
			trim: true,
			minlength: 5,
			unique: true,
			validate: {
				validator: validator.isEmail,
				message: '{VALUE} is not a valid email'
			}
		},
		password: {
			type: String,
			required: true,
			minlength: 5
		},
		tokens: [{
			access: {
				type: String,
				required: true
			},
			token: {
				type: String,
				required: true
			}
		}]
	});

UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return (_.pick(userObject, ['_id', 'email']));
};

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({
		_id: user._id.toHexString(),
		access
	}, 'abc123');

	user.tokens.push({
		access,
		token
	});

	return user.save().then(() => {
		return token;
	});
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
	var decoded = undefined;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch (err) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

var User = mongoose.model('User', UserSchema);


module.exports = {
	User,
}
