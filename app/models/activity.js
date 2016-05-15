var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

// activity model
var ActivitySchema = new Schema({
	activity : {
		type : Array,
		default: []
	},
	activityown : {
		type : Array,
		default: []
	},
	email : {
		type : String,
		default : ''
	}
})

mongoose.model('activities', ActivitySchema);