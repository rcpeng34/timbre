'use strict';

// ********** Helper Functions *********

// ********** End Helper Functions *********
var app = angular.module('transcribeApp', [
  'ngRoute'
]);

app.config(['$routeProvider',function($routeProvider){
  $routeProvider
  .when('/host/:name',{
    templateUrl: 'views/partials/_host.html',
    controller: 'HostController'
  })
  .when('/guest/:name',{
    templateUrl: 'views/partials/_guest.html',
    controller: 'GuestController'
  })
  .otherwise('/');
}])
var messages = [ 
    {
      user: 'user3',
      time: '5:05:05',
      message: 'This will be the text of a message from user 3'
    },
    {
      user: 'user1',
      time: '6:06:06',
      message: 'This is a reponse from user 1'  
    },
    {
      user: 'user2',
      time: '6:06:06',
      message: 'This is a reponse from user 2'  
    }
  ];

app.run(function($rootScope){
  $rootScope.name = 'helloworld';
});

app.controller('HostController', ['$scope', '$interval', '$routeParams', function($scope, $interval, $routeParams){
  $scope.interview = messages;
  $scope.hostName = $routeParams.name;
  $scope.wasCalled = false;
  $scope.called = function(){
     $scope.wasCalled = true;
  }
  $interval(function(){
    messages.push({
        user: 'user2',
        time: '6:06:06',
        message: 'This is a reponse from user 2'  
      })
  }, 10000);
}]);

app.controller('GuestController', ['$scope','$routeParams', function($scope, $routeParams){
  $scope.me = "guest";
  $scope.guestName = $routeParams.name;
}]);

