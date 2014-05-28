module.exports = function(app){
  var storage = {};
  var transcriptions = null;
  app.get('/call/:name', function(req, res){
    if (storage[req.params.name]) {
      res.send('true');
    } else {
      res.send('false');
    }
  });
  app.post('/call', function(req, res){
    console.log(req.body);
    if (req.body.name && storage[req.body.name]) {
      res.send(true);
    } else {
      storage[req.body.name] = req.body.name;
      res.send(false);
    }
  });
  app.get('/transcription', function(req, res){
    // returns most recent and clears it so it returns nothing
    res.send(transcriptions);
    transcriptions = null;
  });
  app.post('/transcription', function(req, res){
    // updates most recent
    transcriptions = req.body.transcription;
    if (transcriptions) { 
      res.send(true)
    } else {
      res.send(false);
    }
  });
  app.get('*', function(req, res){
    res.send(404);
  });
};