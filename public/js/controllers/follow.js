angular.module('gossipApp').controller('followController', ['$scope', '$rootScope', '$http', 'Global',
	function($scope, $rootScope, $http, Global) {
		$scope.global = Global;
		
		// Get all Users
		$scope.getusers = function(){
			$http.get('/getall').success(function(result) {
				for(var i =0; i < result.length; i++){
					if(result[i]._id == $scope.global.user._id){
						result.splice(i, 1);
					}
				}
				if($scope.global.user.following.length != 0){
					for(var i =0; i < result.length; i++){
						for (var j = 0; j < result[i].followers.length; j++) {
							if(result[i].followers[j] ==  $scope.global.user.email){
								result[i].follow = true;
							}
						}
					}
				}
				$scope.users = result;
			}).error(function(error){
				console.log(error);
			});
		}

		// Follow Users
		$scope.follow = function(user){
			$http.get('/follow?email=' + $scope.global.user.email + '&femail=' + user.email).success(function(result) {
				user.follow = !user.follow;
			}).error(function(error){
				console.log(error);
			});
		}
		// Unfollow user
		$scope.unfollow = function(user){
			$http.get('/unfollow?email=' + $scope.global.user.email + '&femail=' + user.email).success(function(result) {
				user.follow = !user.follow;
			}).error(function(error){
				console.log(error);
			});
		}
	}
]);