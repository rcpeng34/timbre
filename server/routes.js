module.exports = function(app){
  // app.get('/client/host', function(req, res){
    
  // });
  // app.get('/client/guest', function(req, res){
    
  // });
  app.get('*', function(req, res){
    res.send(404);
  });
};