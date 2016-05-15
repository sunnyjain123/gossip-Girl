angular.module('gossipApp').controller('activityController', ['$scope', '$rootScope', '$http', 'Global',
	function($scope, $rootScope, $http, Global) {
		$scope.global = Global;
		
		// Get all activities
		$scope.getactivity = function(){
			$http.get('/activities?email=' + $scope.global.user.email).success(function(result){
				$scope.activities = result.activity;
				$scope.activitylength = result.activity.length;
			}).error(function(error){
				console.log(error);
			});
		}
	}
]);