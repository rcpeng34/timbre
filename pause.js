( function(navigator) {
  var stream;

  var run = function() {
    // Set up audio context
    var context = new window.webkitAudioContext();
    var source = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();
    // Buffer of 4096 to mirror wit microphone.js
    var processor = context.createScriptProcessor(4096, 1, 1);

    // Set up pause detection
    var speech, pause;
    var bins = analyser.frequencyBinCount;
    var freqs = new Uint8Array(bins);
    var duration = 0;
    var pauseDuration = 0;
    var stopped = true;

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
            connection.send(JSON.stringify(['start', {}]));
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
        connection.send(JSON.stringify(['stop']));
        duration = 0;
        pauseDuration = 0;
        stopped = true;
        return;
      }

      var bytes = e.inputBuffer.getChannelData(0);
      // Send to wit
      connection.send(bytes);
    };

    source.connect(analyser);
    analyser.connect(processor);
    processor.connect(context.destination);

    window.process = processor;
  };

  navigator.webkitGetUserMedia(
    {audio: true},
    function(data) {
      stream = data;
      run();
    },
    function(err) { console.log(err); }
  );
}(navigator) );
