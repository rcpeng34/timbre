'use strict';

// ********** Helper Functions *********

// ********** End Helper Functions *********
var app = angular.module('transcribeApp', [
  'ngRoute',
  'ngSocket'
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
}]);

app.run(function($rootScope){
  $rootScope.name = 'helloworld';
});

app.controller('HostController', ['$scope', '$interval', '$routeParams', '$socket', function($scope, $interval, $routeParams, $socket){
  timbre.init($routeParams.name, console.log.bind(console));
  $scope.interview = [];
  $scope.hostName = $routeParams.name;
  $scope.wasCalled = false;
  $scope.called = function(){
    timbre.call($scope.toCall);
    $scope.wasCalled = true;
    $socket.emit('call', true);
    timbre.on('transcribe', function(transcription) {
      $scope.interview.push(transcription);
    });
    $scope.on('transcript', function (transcription) {
      $scope.interview.push(transcription);
    });
  };
}]);

app.controller('GuestController', ['$scope','$routeParams', '$socket', function($scope, $routeParams, $socket){
  timbre.init($routeParams.name);
  $scope.me = "guest";
  $scope.guestName = $routeParams.name;
  $scope.on('call',
    function(data) {
      timbre.on('transcribe', function(transcription) {
        $scope.emit('transcript', transcription);
      });
    }
  );
}]);

