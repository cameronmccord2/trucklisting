function navBarCtrl($scope, $location){
	
	$scope.adminTruckList = function(){
		$location.path('/truckAdmin');
	}

	$scope.contactList = function(){
		$location.path('/truckContacts');
	}

	$scope.clientTruckList = function(){
		$location.path('/truckListing');
	}

	$scope.trucksNeedImage = function(){
		$location.path('/trucksNeedImage');
	}

	$scope.logout = function(){
		$location.path('/truckListing');
	}
}