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
      speaker: 'user3',
      time: '5:05:05',
      text: 'This will be the text of a message from user 3'
    },
    {
      speaker: 'user1',
      time: '6:06:06',
      text: 'This is a reponse from user 1'  
    },
    {
      speaker: 'user2',
      time: '6:06:06',
      text: 'This is a reponse from user 2'  
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
        speaker: 'user2',
        time: '6:06:06',
        text: 'This is a reponse from user 2'  
      })
  }, 10000);
}]);

app.controller('GuestController', ['$scope','$routeParams', function($scope, $routeParams){
  $scope.me = "guest";
  $scope.guestName = $routeParams.name;
}]);

