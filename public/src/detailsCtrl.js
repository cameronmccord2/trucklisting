function detailsCtrl($scope, $rootScope, $routeParams, $http){

    $scope.whichContactView = 'new';

    $http.get($rootScope.nodeUrl + "/truckData/specificTruck/" + $routeParams.stockNumber, '').success(function (data) {
        $scope.detailsData = data;
        $scope.detailsInit(data);
    }).error(function (data, status, headers, config) {
        console.log("truckdetails error, id: " + $routeParams.stockNumber, data, status, headers, config);
    });

    $scope.detailsInit = function(data){
        $scope.currentImage = data.largeImage;
    }

    $scope.sendContact = function () {
        $scope.contact.clientSessionId = $rootScope.clientSessionId;
        $scope.contact.truckStockNumber = $routeParams.stockNumber;
        var config = {headers: {
            'clientSessionId':$rootScope.clientSessionId
        }};
        $http.put($rootScope.nodeUrl + "/truckData/contact/new" , angular.toJson($scope.contact), config).success(function (data) {
            $scope.whichContactView = 'success';
        }).error(function (data, status, headers, config) {
            console.log("contact send error", data, status, headers, config);
            $scope.whichContactView = 'failure';
        });
    }
}