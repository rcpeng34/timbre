( function (timbre) {
  var WEBSOCKET_HOST = 'wss://api.wit.ai/speech_ws';

  var on = function (event, cb) {
    if (event === 'transcribe') {
      connect(cb);
    }
  };

  var connect = function (cb) {
    var witsock = new WebSocket(WEBSOCKET_HOST);

    witsock.onopen = function(e) {
      witsock.send(JSON.stringify(['auth', 'ATMHGCDP74KFTTR647Y3ZUZCDSBMPJB6']));

      // Process audio
      process(witsock, timbre._localStream);
    };

    witsock.onmessage = function(e) {
      var response = JSON.parse(event.data);
      // Check response type
      if (response[0] === 'result' && response[1].msg_body.length) {
        cb({
          name: timbre._name,
          time: new Date(),
          message: response[1].msg_body
        });
      }
    };
  };

  var process = function (witsock, stream) {
    // Set up audio context
    var context = new window.webkitAudioContext();
    var analyser = context.createAnalyser();
    // Buffer of 4096 to mirror wit microphone.js
    var processor = context.createScriptProcessor(4096, 1, 1);
    var source = context.createMediaStreamSource(stream);

    // Set up pause detection
    var speech, pause;
    var bins = analyser.frequencyBinCount;
    var freqs = new Uint8Array(bins);
    var duration = 0;
    var pauseDuration = 0;
    var stopped = true;

    // Measure immediate noise level
    analyser.smoothingTimeConstant = 0;

    processor.onaudioprocess = function(e) {
      /* 
       * Analyse for pause, see:
       *   http://aia-i.com/ijai/sample/vol2/no1/145-160.pdf
       * Note: this is an incredibly simplified implementation
       */
      var mean = 0;
      
      // Capture frequencies
      var bins = analyser.frequencyBinCount;
      var freqs = new Uint8Array(bins);
      analyser.getByteFrequencyData(freqs);

      // Calculate mean
      for (var i = 0; i < bins; i++) {
        mean += freqs[i];
      }
      mean /= bins;

      // Calculate duration
      duration += e.inputBuffer.duration;

      // Calculate pause duration
      if (!speech) {
        // Assign initial thresholds
        speech = mean;
        pause = speech * 1.2;
      } else {
        if ( mean < speech || (!pauseDuration && mean < pause) ) {
          pauseDuration += e.inputBuffer.duration;
          // Recalibrate thresholds
          speech = mean * 1.2;
          pause = speech * 1.2; 
        } else {
          if (stopped) {
            witsock.send(JSON.stringify(['start', {}]));
            stopped = false;
          }
          pauseDuration = 0;
        }
      }
      if (pauseDuration > 0.12 || 
          ( duration > 7 && pauseDuration > 0.06 ) ||
          ( duration > 8 && pauseDuration > 0.01 ) ||
          ( duration > 9 && pauseDuration ) ||
          ( duration > 9.5 ) ) {
        // Poll wit
        witsock.send(JSON.stringify(['stop']));
        duration = 0;
        pauseDuration = 0;
        stopped = true;
        return;
      }

      var bytes = e.inputBuffer.getChannelData(0);
      // Send to wit
      witsock.send(bytes);
    };

    source.connect(analyser);
    analyser.connect(processor);
    processor.connect(context.destination);
  };

  timbre.on = on;
}(this.timbre) );
