function contactsCtrl($scope, $routeParams, $rootScope, $http, $location, $q){
	$scope.contactOrder = new Object();
	$scope.contactOrder.column = 'status';
	$scope.contactOrder.reverse = false;
	$scope.flags = new Object();
	$scope.flags.editSuccess = $rootScope.flagStatus.success;
	$scope.messages = new Object();
	

	$scope.refreshContacts = function(){
		$http.get($rootScope.nodeUrl + '/truckAdmin/contact/all').success(function(data){
			for (var i = data.length - 1; i >= 0; i--) {
				for (var j = 0; j < $rootScope.contactStatus.length;j += 2) {
					if($rootScope.contactStatus[j] == data[i].status){
						data[i].statusText = $rootScope.contactStatus[j+1];
						break;
					}
				};
			};
			$scope.contacts = data;
			console.log(data)
		}).error(function(data, status, headers, config){
			console.log("get admin contacts error", data, status, headers, config);
		});
	}
	$scope.refreshContacts();

	$scope.contactDetails = function(contact){
		$location.path('/contactDetails/id/' + contact._id);
	}

	$scope.sortBy = function(how){
		if(how == $scope.contactOrder.column)
			if($scope.contactOrder.reverse)
				$scope.contactOrder.reverse = false;
			else
				$scope.contactOrder.reverse = true;
		else
			$scope.contactOrder.column = how;
	}

	$scope.editContactByField = function(whatField, fieldData, contactId){
		console.log(whatField, fieldData, contactId)
		console.log("editContactByField in contact list")
		var config = {headers:{
			'whatField':whatField,
			'fieldData':fieldData,
			'id':contactId,
			'time':(new Date()).getTime()
		}};
		console.log(config)
		$http.post($rootScope.nodeUrl + "/truckAdmin/contact/update", '{}', config).success(function(data){
			console.log("contact successfully edited");
			//$scope.contactDetails = data;
			$scope.flags.editSuccess = $rootScope.flagStatus.success;
		}).error(function(data, status, headers, config){
			console.log("contact edit failure", data, status, headers, config);
			$scope.flags.editSuccess = $rootScope.flagStatus.error;
			$scope.messages.editError = data;
		});
	}
}