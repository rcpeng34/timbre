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

app.controller('HostController', ['$scope', '$interval', '$routeParams', '$http',function($scope, $interval, $routeParams, $http){
  timbre.init($routeParams.name, console.log.bind(console));
  $scope.interview = [];
  $scope.hostName = $routeParams.name;
  var called = function() {
    $http.get('/call/$routeParams.name').success(function(data) {
      if (data) {
        timbre.on('transcribe', function(transcription) {
          $scope.interview.push(transcription);
        });
        window.setInterval(getTranscriptions(), 5000);
      } else {
        window.setInterval(called, 2500);
      }
    });
  };
  var getTranscriptions = function() {
    $http.get('/transcription').success(function(data) {
      if (data) {
        $scope.interview.push(transcription);
      }
    });
  };
  called();
}]);

app.controller('GuestController', ['$scope','$routeParams', '$http', function($scope, $routeParams, $http){
  timbre.init($routeParams.name, console.log.bind(console));
  $scope.me = "guest";
  $scope.guestName = $routeParams.name;
  $scope.called = function () {
    timbre.call($scope.toCall)
    $http.post('http://localhost:3000/call', {name: $scope.toCall});
    timbre.on('transcribe', function(transcription) {
        $http.post('http://localhost:3000/transcription', {transcription: transcription});
        console.log('sent a transcription');
    });
  };
}]);

