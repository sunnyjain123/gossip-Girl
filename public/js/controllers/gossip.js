angular.module('gossipApp').controller('GossipController', ['$scope', '$rootScope', '$http', 'Global',
	function($scope, $rootScope, $http, Global) {
		$scope.global = Global;
		$scope.statuserr = true;
		
		$scope.updatestatusmodel = '';

		// Get own activities
		$scope.getactivities = function(){
			$http.get('/activities?email=' + $scope.global.user.email).success(function(result){
				$scope.activities = result.activityown;
				$scope.activitylength = result.activityown.length;
			}).error(function(error){
				console.log(error);
			});
		};	

		// update status
		$scope.updatestatus = function(status){
			var statusobj = {
				createdat : new Date(),
				status : 'Updated Status to "' + status + '"'
			}
			$http.post('/updatestatus?email=' + $scope.global.user.email, statusobj).success(function(result){
				$scope.getactivities();
				$scope.updatestatusmodel = '';
				$scope.statuserr = true;
			}).error(function(error){
				console.log(error);
			});
		}

		// Change status textarea 
		$scope.statuschange = function(status){
			if(status == ''){
				$scope.statuserr = true;
			}else{
				$scope.statuserr = false;
			}
		}
	}
]);