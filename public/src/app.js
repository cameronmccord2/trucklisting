var truckListingApp = angular.module('TRUCKLISTING', []);
//console.log("app start")
truckListingApp.config(['$routeProvider',function ($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider.
        when('/truckListing', { templateUrl: 'templates/landing.html', controller: mainCtrl }).
        when('/truckDetails/:stockNumber', { templateUrl: 'templates/truckDetails.html', controller: detailsCtrl }).
        when('/truckAdmin', {templateUrl: 'templates/admin.html', controller: adminCtrl}).
        when('/truckContacts', {templateUrl: 'templates/contactList.html', controller: contactsCtrl}).
        when('/contactDetails/:whatField/:fieldData', {templateUrl: 'templates/editContact.html', controller: editContactCtrl}).
        when('/truckAdmin/:stockNumber', {templateUrl: 'templates/editTruck.html', controller: editTruckCtrl}).
        when('/truckAdminId/:id', {templateUrl: 'templates/editTruck.html', controller: editTruckCtrl}).
        otherwise({ redirectTo: '/truckListing' });
}]);

//http://jsfiddle.net/dandoyon/wxZRR/
truckListingApp.directive('rangeSlider', function () {
    //console.log("in rangeSlider directive");
    return function (scope, elm, attrs) {
        scope.initPromise.then(function () {
            if (attrs.type == "miles") var pos = scope.arrayValue.miles;
            else if (attrs.type == "price") var pos = scope.arrayValue.price;
            else if (attrs.type == "year") var pos = scope.arrayValue.year;
            //console.log(scope.current[pos+1])
            //console.log(attrs)
            console.log(scope.arrayValue.year)
            $(elm).slider({
                range: true,
                min: scope.current[pos],
                max: scope.current[pos + 1],
                step: scope.current[pos + 2],
                values: [scope.current[pos], scope.current[pos + 1]],
                slide: function (event, ui) {
                    scope.$apply(function () {
                        //console.log(scope.current)
                        //console.log(attrs);
                        //console.log(elm);
                        //console.log("in elm.slider")
                        //console.log(ui.values[0])
                        scope.current[pos] = ui.values[0];
                        scope.current[pos + 1] = ui.values[1];
                    });
                }
            });
        })
    };
});

//******************************************
// Rootscope Setup
//********************************************
truckListingApp.run(function ($rootScope) {
    $rootScope.clientSessionId = Math.floor(Math.random()*10000);
    //$rootScope.awsUrl = 'http://54.225.66.110:8001/truck/getData';
    //$rootScope.nodeUrl = 'http://trucklisting.azurewebsites.net';

    // $rootScope.nodeUrl = 'http://127.0.0.1:8080';
    $rootScope.nodeUrl = 'http://54.214.238.10:8080';

    // global variables and statuses
    $rootScope.setupContactStatuses = function(){
        $rootScope.contactStatus = [
            1,
            'New',
            2,
            'Contacted',
            3,
            'Buying',
            10,
            'Sold',
            11,
            'Removed'
        ];
        $rootScope.contactStatusArray = new Array();
        
        for (var i = 0; i < $rootScope.contactStatus.length; i += 2) {
            var temp = new Object();
            temp.statusNum = $rootScope.contactStatus[i];
            temp.statusText = $rootScope.contactStatus[i+1];
            $rootScope.contactStatusArray.push(temp);
        };
    }
    $rootScope.setupContactStatuses();

    $rootScope.setupTruckStatuses = function(){
        $rootScope.truckStatus = [
            1,
            'New',
            'Hidden from customers',
            'new',
            2,
            'Active',
            'Seen by customers',
            'active',
            10,
            'Removed',
            'Hidden from customers',
            'remove'
        ];

        $rootScope.truckStatusFlags = new Object();
        $rootScope.truckStatusArray = new Array();
        for (var i = 0; i < $rootScope.truckStatus.length; i += 4) {
            var temp = new Object();
            temp.statusNum = $rootScope.truckStatus[i];
            temp.label = $rootScope.truckStatus[i+1];
            temp.message = $rootScope.truckStatus[i+2];
            temp.longMessage = $rootScope.truckStatus[i+1] + ' - ' + $rootScope.truckStatus[i+2];
            temp.objectName = $rootScope.truckStatus[i+3];
            $rootScope.truckStatusArray.push(temp);
            $rootScope.truckStatusFlags[$rootScope.truckStatus[i+3]] = $rootScope.truckStatus[i]
        };
    }
    $rootScope.setupTruckStatuses();
    
    $rootScope.flagStatus = {
        'error':0,
        'success':1,
        'unset':2
    }
})