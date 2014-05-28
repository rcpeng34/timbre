  var stream;

  var websocket_host = 'wss://api.wit.ai/speech_ws';

  window.connection = new WebSocket(websocket_host);

  connection.onopen = function(event) {
      connection.send(JSON.stringify(['auth', 'ATMHGCDP74KFTTR647Y3ZUZCDSBMPJB6']));
  };

  connection.onclose = function(event) {
      console.log('socket closed');
  };

  connection.onmessage = function(event) {
      var data = JSON.parse(event.data);
      //data is tuple
      if (data[0] === 'result') {
          console.log(data[1].msg_body);
      }
  };
  