// Setting up route
angular.module('gossipApp').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/activity', {
			templateUrl: 'views/activity.html'
		}).
		when('/follow', {
			templateUrl: 'views/follow.html'
		}).
		when('/:profileId/profile', {
			templateUrl: 'views/profile.html'
		}).
		when('/', {
			templateUrl: 'views/index.html'
		}).
		otherwise({
			redirectTo: '/signin'
		});
	}
]);

// Setting HTML5 Location Mode
angular.module('gossipApp').config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix("!");
	}
]);