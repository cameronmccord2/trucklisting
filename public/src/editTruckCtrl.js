function editTruckCtrl($scope, $routeParams, $rootScope, $http, $location, $q){

    $scope.whichContactView = 'new';
    $scope.flags = new Object();
    $scope.flags.removeError = false;
    $scope.flags.updateError = false;
    $scope.flags.updateErrorMessage = "";

    if($routeParams.stockNumber)
        $http.get($rootScope.nodeUrl + "/truckAdmin/specificTruck/" + $routeParams.stockNumber, '').success(function (data) {
            $scope.detailsData = data;
            $scope.detailsInit(data);
            console.log(data)
        }).error(function (data, status, headers, config) {
            console.log("truckdetails error, id: " + $routeParams.stockNumber, data, status, headers, config);
        });
    else if($routeParams.id)
        $http.get($rootScope.nodeUrl + "/truckAdmin/specificTruckId/" + $routeParams.id, '').success(function (data) {
            $scope.detailsData = data;
            $scope.detailsInit(data);
            console.log(data)
        }).error(function (data, status, headers, config) {
            console.log("truckdetails error, id: " + $routeParams.id, data, status, headers, config);
        });

    $scope.detailsInit = function(data){
        $scope.tileImage = data.tileImage;
        $scope.largeImage = data.largeImage;
        $scope.currentImage = data.largeImage;
    }

    $scope.removeTruck = function(id){
        $scope.editTruckByField('status',$rootScope.truckStatusFlags.remove,id).then(function(){
            $location.path('/truckAdmin');
        });
    }

    $scope.needsImage = function(){
        var promise;
        if($scope.detailsData.needsImage)
            promise = $scope.editTruckByField('needsImage',false,$scope.detailsData._id);
        else
            promise = $scope.editTruckByField('needsImage',true,$scope.detailsData._id);

        promise.then(function(){// change the local data
            if($scope.detailsData.needsImage)
                $scope.detailsData.needsImage = false;
            else
                $scope.detailsData.needsImage = true;
        });
    }

    $scope.editTruckByField = function(whatField, fieldData, truckId){
        console.log(whatField, fieldData,"editTruckByField in truck list");
        var config = {headers:{
            'whatField':whatField,
            'fieldData':fieldData,
            'id':truckId,
            'time':(new Date()).getTime()
        }};
        return $http.post($rootScope.nodeUrl + "/truckAdmin/updateTruck", '{}', config).success(function(data){
                    console.log("truck successfully edited", data, truckId);
                    $scope.flags.updateError = false;
                }).error(function(data, status, headers, config){
                    console.log("truck edit failure", data, status, headers, config);
                    $scope.flags.updateErrorMessage = data;
                    $scope.flags.updateError = true;
                });
    }
}