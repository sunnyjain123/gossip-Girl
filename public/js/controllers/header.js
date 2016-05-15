angular.module('gossipApp').controller('headerController', ['$scope', '$rootScope', '$http', 'Global',
	function($scope, $rootScope, $http, Global) {
		$scope.global = Global;
		$scope.id = $scope.global.user._id;
	}
]);