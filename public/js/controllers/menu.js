angular.module('gossipApp').controller('menuController', ['$scope', '$rootScope', '$http', 'Global', '$location',
	function($scope, $rootScope, $http, Global, $location) {
		$scope.global = Global;
		$scope.l_t = 1;

		// active url function
		$scope.isActive = function(viewLocation) {
			return viewLocation === $location.path();
		}
	}
]);