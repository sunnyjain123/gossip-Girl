var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	activity = mongoose.model('activities'),
	async = require('async');

// Function to validate email
function validateEmail(email) {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

	if (reg.test(email.value) == false) {
		alert('Invalid Email Address');
		return false;
	}
	return true;
}

// auth function
exports.authCallback = function(req, res, next) {
	res.redirect('/');
};

// signin function
exports.signin = function(req, res) {
	res.render('users/signin', {
		title: 'Signin',
		message: req.flash('error')
	});
};

// signup function
exports.signup = function(req, res) {
	res.render('users/signup', {
		title: 'Sign up',
		user: new User()
	});
};

// Unauthorized Access
exports.unauth = function(req, res) {
	res.render('users/unauth', {
		title: 'Unauthorized',
		message: req.flash('error')
	});
};

// signout function
exports.signout = function(req, res) {

	req.logout();
	res.redirect('/signin');
};

// sessions function
exports.session = function(req, res) {
	res.redirect('/');
};

// create user function
exports.create = function(req, res) {
	var user = new User(req.body);
	var message = null;

	user.provider = 'local';
	user.save(function(err){
		if(err){
			switch(err.code){
				case 11000:
				case 11001:
					message = 'Username or Email already exists';
					break;
				default:
					message = 'Please fill all the required fields';
			}

			return res.render('users/signup', {
				message: message,
				user: user
			});
		}else{
			var act = {
				email : user.email,
				activityown : [],
				activity : []
			};
			var Activity = new activity(act);
			Activity.save(function(error, acti){
				if(error){
					return next(error);
				}else{
					req.logIn(user, function(err) {
						if (err) return next(err);
						return res.redirect('/');
					});
				}
			});
		}
	});
};

// Function to set user
exports.user = function(req, res, next, id) {
	User
		.findOne({
			_id: id
		})
		.exec(function(err, user) {
			if (err) return next(err);
			if (!user) return next(new Error('Failed to load User ' + id));
			req.profile = user;
			next();
		});
}

// find user function
exports.getuser = function(req, res, next){
	User.findOne({_id: req.query.id}, function(err, user) {
		if (err){
			return res.send(err);
		}else{
			return res.jsonp(user);
		}
	});
}

// cupdate user function
exports.updateuser = function(req, res, next){
	// update user
	User.update({
		_id: req.body._id
	}, {
		$set: req.body
	}, function(err, docs) {
		if(err){
			return res.send(err);
		}else{
			// Find user
			User.findOne({_id: req.body._id}, function(err, user){
				if(err){
					return res.send(err);
				}else{
					if(user.followers.length == 0){
						return res.jsonp(user);
					}else{
						// send users notification
						async.map(user.followers, function(userf, callback){
							activity.findOne({email : userf}, function(erruser, resultuser){
								if(erruser){
									callback(erruser, null);
								}else{
									console.log(user);
									var fact = resultuser;
									var changes = {
										status : user.username + ' Changed his profile info',
										createdat : new Date()
									}
									fact.activity.push(changes);
									activity.update({
										email : userf
									}, {
										$set: fact
									}, function(errfupdate, resultfupdate){
										if(errfupdate){
											callback(errfupdate, null);
										}else{
											callback(null, resultfupdate);
										}
									});
								}
							});
						}, function(updateerr, updateresult){
							if(updateerr){
								return res.send(updateerr);
							}else{
								return res.jsonp(updateresult);
							}
						});
					}
				}
			});
		}
	});
}

// function to follow users
exports.follow = function(req, res, next){
	var femail = req.query.femail;
	var email = req.query.email;
	// find current user
	User.findOne({email: email}, function(err, user) {
		if(err){
			return res.send(err);
		}else{
			// update current users following field
			user.following.push(femail);
			User.update({
				email: email
			}, {
				$set: user
			}, function(err, docs) {
				if(err){
					return res.send(err);
				}else{
					// find following user
					User.findOne({email: femail}, function(ferr, fuser) {
						if(ferr){
							return res.send(ferr);
						}else{
							// update folllowing users followers field
							fuser.followers.push(email);
							User.update({
								email: femail
							}, {
								$set: fuser
							}, function(err, docs) {
								if(err){
									return res.send(err);
								}else{
									// find current users followers and send them notification
									async.map(user.followers, function(userf, callback){
										if(userf != femail){
											activity.findOne({email : userf}, function(erruser, resultuser){
												if(erruser){
													callback(erruser, null);
												}else{
													var fact = resultuser;
													var userup = {
														status :  user.username + ' Started following ' + fuser.username,
														createdat : new Date()
													}
													fact.activity.push(userup);
													activity.update({
														email : userf
													}, {
														$set: fact
													}, function(errfupdate, resultfupdate){
														if(errfupdate){
															callback(errfupdate, null);
														}else{
															callback(null, resultfupdate);
														}
													});
												}
											});
										}else{
											callback(null, null);
										}
									}, function(updateerr, updateresult){
										if(updateerr){
											return res.send(updateerr);
										}else{
											// find current following user and send him notification
											activity.findOne({email : femail}, function(erruser, resultuser){
												if(erruser){
													callback(erruser, null);
												}else{
													var fact = resultuser;
													var userup = {
														status :  user.username + ' Started following You',
														createdat : new Date()
													}
													fact.activity.push(userup);
													activity.update({
														email : femail
													}, {
														$set: fact
													}, function(errfupdate, resultfupdate){
														if(errfupdate){
															return res.send(errfupdate);
														}else{
															return res.jsonp(resultfupdate);
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

// function to unfollow user
exports.unfollow = function(req, res, next){
	var femail = req.query.femail;
	var email = req.query.email;
	// find current user
	User.findOne({email: email}, function(err, user) {
		if(err){
			return res.send(err);
		}else{
			// update current users following field
			var index = user.following.indexOf(femail);
			user.following.splice(index, 1);
			User.update({
				email: email
			}, {
				$set: user
			}, function(err, docs) {
				if(err){
					return res.send(err);
				}else{
					// find unfollow user
					User.findOne({email: femail}, function(ferr, fuser) {
						if(ferr){
							return res.send(ferr);
						}else{
							// updaet followers field
							var findex = fuser.followers.indexOf(email);
							fuser.followers.splice(findex, 1);
							User.update({
								email: femail
							}, {
								$set: fuser
							}, function(err, docs) {
								if(err){
									return res.send(err);
								}else{
									// async on current users followers and send them notification
									async.map(user.followers, function(userf, callback){
										if(userf != femail){
											activity.findOne({email : userf}, function(erruser, resultuser){
												if(erruser){
													callback(erruser, null);
												}else{
													var fact = resultuser;
														var userup = {
															status :  user.username + ' unfollowed ' + fuser.username,
															createdat : new Date()
														}
														fact.activity.push(userup);
													activity.update({
														email : userf
													}, {
														$set: fact
													}, function(errfupdate, resultfupdate){
														if(errfupdate){
															callback(errfupdate, null);
														}else{
															callback(null, resultfupdate);
														}
													});
												}
											});
										}else{
											callback(null, null);
										}
									}, function(updateerr, updateresult){
										if(updateerr){
											return res.send(updateerr);
										}else{
											// send unfollow user notification
											activity.findOne({email : femail}, function(erruser, resultuser){
												if(erruser){
													callback(erruser, null);
												}else{
													var fact = resultuser;
													var userup = {
														status :  user.username + ' Unfollowed You',
														createdat : new Date()
													}
													fact.activity.push(userup);
													activity.update({
														email : femail
													}, {
														$set: fact
													}, function(errfupdate, resultfupdate){
														if(errfupdate){
															return res.send(errfupdate);
														}else{
															return res.jsonp(resultfupdate);
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

// function to get all users
exports.getall = function(req, res, next){
	User.find({}, function(err, users){
		if(err){
			res.send(err);
		}else{
			res.jsonp(users);
		}
	})
}
