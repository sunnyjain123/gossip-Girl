angular.module('gossipApp').controller('mainController', ['$scope', '$rootScope', '$http', 'Global', '$location', '$routeParams', '$interval', 'Notification',
	function($scope, $rootScope, $http, Global, $location, $routeParamsm, $interval, Notification) {
		$scope.global = Global;
		// Notification function
		var interval = $interval(function(){
			$http.get('/notification?email=' + $scope.global.user.email + '&time=' + new Date().getTime()).success(function(result){
				if(result.length > 0){
					for(var i = 0; i < result.length; i++){
						Notification({message: result[i].status, delay: 5000, positionY: 'bottom', positionX: 'left'});
					}
				}
			}).error(function(error){
				console.log(error);
			});
		}, 1000);
	}
]);