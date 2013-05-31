function editContactCtrl($scope, $routeParams, $rootScope, $http, $location, $q){
	console.log("in editContactCtrl")
	$scope.flags = new Object();
	$scope.flags.editSuccess = $rootScope.flagStatus.unset;
	$scope.messages = new Object();
	$scope.messages.editError = "";
	$scope.contactStatusList = new Array();
	$scope.newContactHistory = new Object();
	$scope.showSubmitEntryButton = false;
	$scope.newEntryError = false;


	var initConfig = {headers:{
            'whatField':$routeParams.whatField,
            'fieldData':$routeParams.fieldData
        }};
	$http.get($rootScope.nodeUrl + "/truckAdmin/contact/field", initConfig).success(function(data){
		console.log(data);
		$scope.statussss = parseInt(data[0].status);
		$scope.contactDetails = data[0];
	}).error(function(data, status, headers, config){
		console.log("get admin specific contact error", data, status, headers, config);
	});

	$scope.removeContact = function(){
		$scope.editContactByField('status',$rootScope.contactStatus.removed);
	}

	$scope.editContactByField = function(whatField, fieldData){
		console.log(whatField, fieldData)
		console.log("en editContactByField")
		var config = {headers:{
			'whatField':whatField,
			'fieldData':fieldData,
			'id':$scope.contactDetails._id,
			'time':(new Date()).getTime()
		}};
		console.log(config)
		$http.post($rootScope.nodeUrl + "/truckAdmin/contact/update", '{}', config).success(function(data){
			console.log("contact successfully edited");
			//$scope.contactDetails = data;
			$scope.flags.editSuccess = $rootScope.flagStatus.success;
			if(whatField == 'status' && fieldData == $rootScope.contactStatus.removed)
				$location.path('/truckContacts');
		}).error(function(data, status, headers, config){
			console.log("contact edit failure", data, status, headers, config);
			$scope.flags.editSuccess = $rootScope.flagStatus.error;
			$scope.messages.editError = data;
		});
	}

	$scope.submitNewEntry = function(){
		var newEntry = new Object();
		if($scope.newContactHistory.date == null)
			newEntry.entryDate = 'general';
		else
			newEntry.entryDate = $scope.newContactHistory.date;
		newEntry.entryComment = $scope.newContactHistory.note;
		newEntry.entryTime = (new Date()).getTime();
		var config = {headers:{
			'whatField':'historyEntry',
			'id':$scope.contactDetails._id
		}};

		$http.post($rootScope.nodeUrl + "/truckAdmin/contact/newHistoryEntry", newEntry, config).success(function(data){
			$scope.contactDetails.historyEntries = data;
			$scope.contactDetails.lastContacted = (new Date()).getTime();
			$scope.newContactHistory = new Object();
			$scope.showSubmitEntryButton = false;
			$scope.newEntryError = false;
			console.log(data);
		}).error(function(data, status, headers, config){
			console.log("submit new entry error", data, status, headers, config);
			$scope.newEntryError = true;
		});
	}

	$scope.alternateColor = function(index){
		console.log('heredsss', index % 2)
		if(index % 2)
			return 'cdDark';
		else
			return 'cdLight';
	}
}