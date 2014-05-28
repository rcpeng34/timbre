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
    $http.get('/call/' + $routeParams.name).success(function(data) {
      console.log('polled call endpoint:', data, 'for ' + $routeParams.name);
      if (data == 'true') {
        console.log('transcribing...');
        $scope.wasCalled = true;
        window.setTimeout(function() {
          timbre.on('transcribe', function(transcription) {
            $scope.interview.push(transcription);
          });
        }, 2500)
        window.setInterval(getTranscriptions, 2500);
      } else {
        window.setTimeout(called, 2500);
      }
    });
  };
  var getTranscriptions = function() {
    $http.get('/transcription').success(function(data) {
      console.log('polled transcription endpoint:', data);
      if (typeof data === 'object' && data.message) {
        $scope.interview.push(data);
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
    $scope.wasCalled = true;
    timbre.call($scope.toCall);
    $http.post('http://timbre.herokuapp.com/call', {name: $scope.toCall});
    console.log('sent for ' + $scope.toCall);
    timbre.on('transcribe', function(transcription) {
        $http.post('http://timbre.herokuapp.com/transcription', {transcription: transcription});
        console.log('sent a transcription');
    });
  };
}]);

