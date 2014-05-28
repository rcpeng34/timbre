( function (global) {
  if (!PUBNUB) throw 'PUBNUB required, see pubnub.com';

  var timbre = global.timbre = global.timbre || {};

  // Polyfill WebRTC
  navigator.getUserMedia =
    navigator.GetUserMedia || navigator.webkitGetUserMedia;

  var pubnub,
    localStream;

  var gUMSuccess = function (name, cb, stream) {
    timbre._localStream = localStream = stream;
    initialize(name, cb);
  };

  // Initialize pubnub
  var initialize = function (name, cb) {
    timbre._name = uuid = name;

    pubnub = PUBNUB.init({
      publish_key: 'pub-c-7070d569-77ab-48d3-97ca-c0c3f7ab6403',
      subscribe_key: 'sub-c-49a2a468-ced1-11e2-a5be-02ee2ddab7fe',
      uuid: name
    });

    // Reciprocate peerConnection
    pubnub.onNewConnection(function(uuid) {
      if (localStream) {
        call(uuid);
      }
    });

    cb(null);
  };

  // Initiate timbre with name (gobbledygook if not given)
  var init = function (name, cb) {
    navigator.getUserMedia(
      { audio: true }, gUMSuccess.bind(null, name, cb), cb);
  };

  // Exchange streams with remote
  //   remote client should have called init(remote)
  var call = function(remote) {
    pubnub.publish({
      user: remote,
      stream: localStream
    });

    pubnub.subscribe({
      user: remote,
      // Consume stream from remote
      stream: function(bad, event) {
        var audio = document.createElement('audio');
        audio.id = remote;
        audio.src = URL.createObjectURL(event.stream);
        document.querySelector('body').appendChild(audio);
        audio.play();
      }
    });
  };

  timbre.init = init;
  timbre.call = call;
}(this) );