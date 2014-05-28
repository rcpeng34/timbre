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
      user: 'Interviewer',
      time: '5:05:05',
      message: 'How are you?'
    },
    {
      user: 'Dracula',
      time: '5:06:06',
      message: 'It is night'  
    },
    {
      user: 'Dracula',
      time: '5:07:06',
      message: 'I vant to suck your blood'  
    }
  ];

app.run(function($rootScope){
  $rootScope.name = 'helloworld';
});

app.controller('HostController', ['$scope', '$interval', '$routeParams', function($scope, $interval, $routeParams){
  $scope.interview = [];
  $scope.hostName = $routeParams.name;
  $scope.wasCalled = false;
  $scope.called = function(){
     $scope.wasCalled = true;
  }
  $interval(function(){
    $scope.interview.push({
        user: 'Dracula',
        time: '7:06:06',
        message: 'I vant to suck your blood'  
      })
  }, 1000);
}]);

app.controller('GuestController', ['$scope','$routeParams', function($scope, $routeParams){
  $scope.me = "guest";
  $scope.guestName = $routeParams.name;
  $scope.wasCalled = false;
  $scope.called = function(){
     $scope.wasCalled = true;
  }
}]);

