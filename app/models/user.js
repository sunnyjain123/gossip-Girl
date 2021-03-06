var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	_ = require('underscore'),
	authTypes = ['github', 'twitter', 'facebook', 'google'];

// user model
var UserSchema = new Schema({
	name: String,
	email: {
		type: String,
		unique: true
	},
	admin: {
		type: Boolean,
		default: false
	},
	self: {
		type: Boolean,
		default: true
	},
	followers :{
		type : Array,
		default: []
	},
	following :{
		type : Array,
		default: []
	},
	username: {
		type: String,
		unique: true
	},
	created: {
		type: Date,
		default: Date.now()
	},
	edited: {
		type: Date,
		default: Date.now()
	},
	hashed_password: String,
	provider: String,
	salt: String,
	facebook: {},
	twitter: {},
	github: {},
	google: {}
});

// Virtuals
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.encryptPassword(password);
}).get(function() {
	return this._password;
});

// Validations
var validatePresenceOf = function(value) {
	return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('name').validate(function(name) {
	// if you are authenticating by any of the oauth strategies, don't validate
	if (authTypes.indexOf(this.provider) !== -1) return true;
	return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
	// if you are authenticating by any of the oauth strategies, don't validate
	if (authTypes.indexOf(this.provider) !== -1) return true;
	return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function(username) {
	// if you are authenticating by any of the oauth strategies, don't validate
	if (authTypes.indexOf(this.provider) !== -1) return true;
	return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
	// if you are authenticating by any of the oauth strategies, don't validate
	if (authTypes.indexOf(this.provider) !== -1) return true;
	return hashed_password.length;
}, 'Password cannot be blank');


 // User Pre SAve Function
UserSchema.pre('save', function(next) {
	if (!this.isNew) return next();

	if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
		next(new Error('Invalid password'));
	else
		next();
});

// Methods
UserSchema.methods = {
	// Check if passwords are same
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},
	// make salt
	makeSalt: function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	},
	// Encrypt Password
	encryptPassword: function(password) {
		if (!password || !this.salt) return '';
		return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	}
};

mongoose.model('User', UserSchema);