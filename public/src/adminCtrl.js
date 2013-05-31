function adminCtrl($scope, $routeParams, $rootScope, $http, $location, $q){

    $scope.initDefer = $q.defer();
    $scope.initPromise = $scope.initDefer.promise;
    $scope.search = new Object();//used for text searches such as stockNumber
    $scope.current = new Array();// holds the current slider values
    $scope.currentO = new Object();
    $scope.makes2 = new Array();// holds which makes are currently checkboxed
    $scope.engineMake = new Array();// holds which engines are currently checkboxed
    $scope.arrayValue = new Object();//allows easy indexing into $scope.current by: $scope.current[$scope.arrayValue.price]
    $scope.sortBy = "priority";//for sorting the trucks
    $scope.truckDetails;
    $scope.showTheTruckDetails = false;
    $scope.showPage = new Object();
    $scope.showPage.truckListing = false;
    $scope.showPage.truckDetails = true;
    $scope.contact = new Object();//contact information object
    $scope.truckList = new Object();
    $scope.truckList.orderByList = new Array();
    $scope.truckList.howToOrderTrucks;
    $scope.flags = new Object();
    $scope.flags.removeTruckError = false;
    $scope.flags.editSuccess = $rootScope.flagStatus.success;
    $scope.messages = new Object();
    $scope.showSuccess = false;
    $scope.showError = false;
    $scope.onlyShowNeedsImage = 'f';
    
    $scope.$watch(function () {
        return $location.path();
    }, function (path) {
        if (path == '/') $scope.showTheTruckDetails = false;// check for a return to the main page
    });

    $http.get($rootScope.nodeUrl + "/truckAdmin/allTrucks", '').success(function (data) {
        $scope.truckData = data;// used by landing.html
        $scope.initializeEverything(data);
    }).error(function(data, status, headers, config) {
        console.log("data retrieval error!!", data, status, headers, config);
        console.log(data);
        console.log(config);
        console.log(headers);
    });

    $scope.initializeEverything = function (data) {
        //initialize values for sliders
        $scope.arrayValue.miles = 0;
        $scope.current[0] = data.setup.minMiles;
        $scope.current[1] = data.setup.maxMiles;
        $scope.current[2] = 1000;

        $scope.arrayValue.price = 3;
        $scope.current[3] = data.setup.minPrice;
        $scope.current[4] = data.setup.maxPrice;
        $scope.current[5] = 1000;

        $scope.arrayValue.year = 6;
        console.log(data.setup)
        $scope.current[6] = data.setup.minYear;
        $scope.current[7] = data.setup.maxYear;
        $scope.current[8] = 1;

        $scope.truckList.orderByList[0] = new Object();
        $scope.truckList.orderByList[0].title = "Oldest - Newest";
        $scope.truckList.orderByList[0].attribute = "year";
        $scope.truckList.orderByList[0].reverse = false;
        $scope.truckList.orderByList[1] = new Object();
        $scope.truckList.orderByList[1].title = "Newest - Oldest";
        $scope.truckList.orderByList[1].attribute = "year";
        $scope.truckList.orderByList[1].reverse = true;
        $scope.truckList.orderByList[2] = new Object();
        $scope.truckList.orderByList[2].title = "Lowest Miles";
        $scope.truckList.orderByList[2].attribute = "miles";
        $scope.truckList.orderByList[2].reverse = false;
        $scope.truckList.orderByList[3] = new Object();
        $scope.truckList.orderByList[3].title = "Highest Miles";
        $scope.truckList.orderByList[3].attribute = "miles";
        $scope.truckList.orderByList[3].reverse = true;
        $scope.truckList.orderByList[4] = new Object();
        $scope.truckList.orderByList[4].title = "Lowest Price";
        $scope.truckList.orderByList[4].attribute = "price";
        $scope.truckList.orderByList[4].reverse = false;
        $scope.truckList.orderByList[5] = new Object();
        $scope.truckList.orderByList[5].title = "Highest Price";
        $scope.truckList.orderByList[5].attribute = "price";
        $scope.truckList.orderByList[5].reverse = true;
        $scope.truckList.orderByList[6] = new Object();
        $scope.truckList.orderByList[6].title = "Featured Items";
        $scope.truckList.orderByList[6].attribute = "priority";
        $scope.truckList.orderByList[6].reverse = false;
        $scope.truckList.orderByList[7] = new Object();
        $scope.truckList.orderByList[7].title = "Stock Number";
        $scope.truckList.orderByList[7].attribute = "stockNumber";
        $scope.truckList.orderByList[7].reverse = false;
        $scope.truckList.orderByList[8] = new Object();
        $scope.truckList.orderByList[8].title = "Needs Image";
        $scope.truckList.orderByList[8].attribute = "needsImage";
        $scope.truckList.orderByList[8].reverse = true;

        $scope.truckList.howToOrderTrucks = $scope.truckList.orderByList[7];

        $scope.initDefer.resolve();
    }

    $scope.needsImageStyle = function(needsImage){
        if(needsImage)
            return {'background-color':'green'};
        return '{}';
    }

    $scope.showTruckDetails = function (truck) {
        $location.path('/truckAdmin/' + truck.stockNumber);
    }

    $scope.formMakesChange = function (name) {//changes filter values for makes
        for (var i = 0; i < $scope.makes2.length; i++) {
            if (name == $scope.makes2[i]) {//if found, remove this make
                $scope.makes2.splice(i, 1);
                return;
            }
        }
        $scope.makes2.splice(0, 0, name);// not found in list so add this make
    }

    $scope.formEngineChange = function (name) {
        for (var i = 0; i < $scope.engine.length; i++) {
            if (name == $scope.engine[i]) {
                $scope.engine.splice(i, 1);//if found add this engine
                return;
            }
        }
        $scope.engine.splice(1, 0, name);// not found in list so add this engine
    }

    $scope.truckFilter = function (item) {
        // only show filters
        if($scope.onlyShowNeedsImage == 't')
            if(item.needsImage == true || item.needsImage == 1 || item.needsImage == "true" || item.needsImage == "1")
                {}
            else
                return false;

        //Makes
        var good = true;
        if ($scope.makes2.length > 0) {//checks if in the makes list
            good = false;
            for (var i = 0; i < $scope.makes2.length; i++) {
                if (item.make == $scope.makes2[i])
                    good = true;
            }
        }
        if (!good)
            return false;

        if (item.price >= $scope.current[$scope.arrayValue.price] && item.price <= $scope.current[$scope.arrayValue.price + 1] && item.miles >= $scope.current[$scope.arrayValue.miles] && item.miles <= $scope.current[$scope.arrayValue.miles + 1] && item.year >= $scope.current[$scope.arrayValue.year] && item.year <= $scope.current[$scope.arrayValue.year + 1]) {}//continue if all these are true
        else
            return false;// if any fail then dont show this item
        return true;// passed all tests, show this item
    }

    $scope.needsImageFilter = function(needsImage){
        
    }

    // separate admin functions
    $scope.needsImagesList = function(){
        $http.get($rootScope.nodeUrl + '/truckAdmin/needsImage', '').success(function(data){
            $scope.needsImages = data;
        }).error(function(data, status, headers, config){
            console.log("get needsImagesList error", data, status, headers, config);
        });
    }
    $scope.needsImagesList();

    $scope.needsImage = function(truck){
        console.log("lbaba")
        if(truck.needsImage)
            $scope.editTruckByField('needsImage',false,truck._id);
        else
            $scope.editTruckByField('needsImage',true,truck._id);
    }

    $scope.removeTruck = function(stockNumber){
        $http.post($rootScope.nodeUrl + '/truckAdmin/removeTruck/' + stockNumber, '{}', '').success(function(data){
            $scope.truckData.trucks = data;
            console.log("remove success", data);
        }).error(function(data, status, headers, config){
            console.log("post removeTruck error", data, status, headers, config);
            return false;
        });
    }

    $scope.editTruck = function (truck) {
        $location.path('/truckAdmin/' + truck.stockNumber);
    }

    $scope.viewContacts = function(){
        $location.path('/truckContacts');
    }

    $scope.editTruckByField = function(whatField, fieldData, truckId){
        console.log(whatField, fieldData,"editTruckByField in truck list");
        var config = {headers:{
            'whatField':whatField,
            'fieldData':fieldData,
            'id':truckId,
            'time':(new Date()).getTime()
        }};
        $http.post($rootScope.nodeUrl + "/truckAdmin/updateTruck", '{}', config).success(function(data){
            console.log("truck successfully edited", data, truckId);
            for (var i = $scope.truckData.trucks.length - 1; i >= 0; i--) {
                if($scope.truckData.trucks[i]._id == truckId){
                    $scope.truckData.trucks[i] = data;
                    return;
                }
            };
            $scope.flags.editSuccess = $rootScope.flagStatus.success;
        }).error(function(data, status, headers, config){
            console.log("truck edit failure", data, status, headers, config);
            $scope.flags.editSuccess = $rootScope.flagStatus.error;
            $scope.messages.editError = data;
        });
    }

    $scope.editSuccess = function(){
        $scope.showSuccess = true;
        setTimeout(function(){
            $scope.showSuccess = false;
            $scope.$apply();
        });
    }

    $scope.newTruck = function(){
        $http.put($rootScope.nodeUrl + '/truckAdmin/newTruck', '{}').success(function(data){
            console.log("new truck created", data[0]);
            $location.path('/truckAdminId/' + data[0]._id);
        }).error(function(data, status, headers, config){
            console.log("error creating new truck", data ,status, headers, config);
        });
    }
}