'use strict';

var express     = require("express");
var port        = process.env.PORT || 3000;
var app         = express();
var server      = require('http').createServer(app);
var bodyParser  = require('body-parser');


app.use(bodyParser());
app.use(function(req, res, next) {

  var origin = req.headers.origin || "*";

  res.setHeader("access-control-allow-origin", origin);
  res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type accept");
  res.setHeader("access-control-max-age", 10);

  if (req.method === "OPTIONS") { res.send(204) };
  next();
});
app.use(express.static(__dirname + '/client'));
require("./routes.js")(app);

app.listen(port);

console.log('Server listening on port: ' + port);