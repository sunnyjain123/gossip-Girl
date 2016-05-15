var mongoose = require('mongoose'),
    _ = require('underscore');

// if user render fill user with current user else null
exports.render = function(req, res) {
	res.render('index', {
    	user: req.user ? JSON.stringify(req.user) : "null"
    });
};