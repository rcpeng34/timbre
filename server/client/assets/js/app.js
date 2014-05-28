'use strict';

// ********** Helper Functions *********

var getMessages = function (){
  // should return all messages to display as an array

  return [ 
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
};

// ********** End Helper Functions *********

var app = angular.module('transcribeApp', []);
var messages = getMessages();

app.run(function($rootScope){
  $rootScope.name = 'helloworld';
});

app.controller('MessageController', function($scope){
  $scope.interview = messages;
});

