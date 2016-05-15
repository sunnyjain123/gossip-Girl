angular.module('gossipApp').controller('profileController', ['$scope', '$rootScope', '$http', 'Global', '$location', '$routeParams',
	function($scope, $rootScope, $http, Global, $location, $routeParams) {
		$scope.global = Global;
		// $scope.l_t = 1;
		$scope.updateuserbtn = true;
		var id = $routeParams.profileId;
		if($scope.global.user._id != id){
			$scope.updateuserbtn = false;
		}
		// Get user function
		$scope.getUser = function(){
			$http.get('/user?id=' + id).success(function(result) {
				$scope.user = result;
			}).error(function(error){
				console.log(error);
			});
		}

		// update user function
		$scope.updateuser = function(user){
			$http.post('/updateuser', user).success(function(result) {
				$location.path('/');
			}).error(function(error){
				console.log(error);
			});
		}
	}
]);