var mongoose = require('mongoose'),
	activity = mongoose.model('activities'),
	User = mongoose.model('User'),
	async = require('async');

// Function to get all ACTIVITIES of a USER
exports.getall = function (req, res, next) {
	// find user Activity
	activity.findOne({email : req.query.email}, function(err, result){
		if(err){
			return res.send(err);
		}else{
			return res.jsonp(result);
		}
	});
}

// Function to UPDATE Status of a USER
exports.updatestatus = function(req, res, next){
	// find activities of current user
	activity.findOne({email : req.query.email}, function(err, result){
		if(err){
			return res.send(err);
		}else{
			// push activities to current user
			var activity_user = result;
			activity_user.activityown.push(req.body);
			// update current user's own activity status
			activity.update({
				email : req.query.email
			}, {
				$set: activity_user
			}, function(errupdate, resultupdate){
				if(errupdate){
					return res.send(errupdate);
				}else{
					// find followers of current user
					User.findOne({email : req.query.email}, function(err, user){
						if(err){
							return res.send(err);
						}else{
							if(user.followers.length == 0){
								return res.jsonp(user);
							}else{
								// async map on user followers
								async.map(user.followers, function(userf, callback){
									// find follower activity and update their friends activity field
									activity.findOne({email : userf}, function(erruser, resultuser){
										if(erruser){
											callback(erruser, null);
										}else{
											var fact = resultuser;
											var userup = {
												status :  user.username + ' ' +req.body.status,
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
								}, function(updateerr, updateresult){
									if(updateerr){
										return res.send(updateerr);
									}else{
										return res.jsonp(updateresult);
									}
								});
							}
						}
					})
				}
			});
		}
	});
}

// Function to get new NOTIFICATION
exports.notification = function(req, res, next){
	// Find activities of current user
	activity.findOne({email : req.query.email}, function(err, result){
		if(err){
			return res.send(err);
		}else{
			// async on activities
			async.map(result.activity, function(act, callback){
				if(new Date(act.createdat).getTime() <= parseInt(req.query.time) && new Date(act.createdat).getTime() > (parseInt(req.query.time) - 1000)){
					callback(null, act);
				}else{
					callback(null, null);
				}
			}, function(err, resp){
				if(err){
					return res.send(err);
				}else{
					// send latest activities
					var data = [];
					for(var i =0; i < resp.length; i++){
						if(resp[i] != null){
							data.push(resp[i]);
						}
					}
					return res.jsonp(data);
				}
			})
		}
	});
}
