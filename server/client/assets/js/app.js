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
}]);

app.run(function($rootScope){
  $rootScope.name = 'helloworld';
});

app.controller('HostController', ['$scope', '$interval', '$routeParams', function($scope, $interval, $routeParams){
  timbre.init($routeParams.name, console.log.bind(console));
  $scope.interview = [];
  $scope.hostName = $routeParams.name;
  $scope.wasCalled = false;
  $scope.called = function(){
    timbre.on('transcribe', function(transcription) {
      $scope.interview.push(transcription);
    });
    $socket.on('transcript', function (transcription) {
      console.log('received a transcription');
      $scope.interview.push(transcription);
    });
  };
}]);

app.controller('GuestController', ['$scope','$routeParams', function($scope, $routeParams){
  timbre.init($routeParams.name, console.log.bind(console));
  $scope.me = "guest";
  $scope.guestName = $routeParams.name;
  $socket.on('call',
    function(data) {
    console.log('received a call with ' + data);
      timbre.call(data);
      timbre.on('transcribe', function(transcription) {
        $socket.emit('transcript', transcription);
        console.log('sent a transcription');
      });
    }
  );
}]);

