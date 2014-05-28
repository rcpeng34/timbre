'use strict';

var app = angular.module('transcribeApp', []);

app.run(function($rootScope){
  $rootScope.name = 'helloworld';
});

app.controller('MessageController', function($scope){
  $scope.message = {
    speaker: 'user2',
    time: '5:05:05',
    text: 'This will be the text of a message'
  };
});
