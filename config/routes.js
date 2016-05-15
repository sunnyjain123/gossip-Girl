module.exports = function(app, passport, auth) {

	//User Routes
	var users = require('../app/controllers/users');
	var authorization = require('./middlewares/authorization');

	app.get('/signin', authorization.requiresAnonymous, users.signin);
	app.get('/signup', authorization.requiresAnonymous, users.signup);
	app.get('/signout', users.signout);
	app.get('/unauth', authorization.requiresAnonymous, users.unauth);
	app.get('/getall', users.getall);
	app.get('/user', users.getuser);
	app.get('/follow', users.follow);
	app.get('/unfollow', users.unfollow);
	app.post('/users', authorization.requiresAnonymous, users.create);
	app.post('/updateuser', users.updateuser);

	app.post('/users/session', passport.authenticate('local', {
		failureRedirect: '/signin',
		failureFlash: true
	}), users.session);

	app.param('userId', users.user);

	var index = require('../app/controllers/index');
	app.get('/', auth.requiresLogin, index.render);

	var activity = require('../app/controllers/activity');

	app.get('/activities', activity.getall);
	app.get('/notification', activity.notification);
	app.post('/updatestatus', activity.updatestatus)
};
