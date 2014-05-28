'use strict';

var express     = require("express");
var port        = process.env.PORT || 3000;
var app         = express();
var server      = require('http').createServer(app);
var bodyParser  = require('body-parser');
var websocket   = require('socket.io');

var io = websocket.listen(server);

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

server.listen(port);

io.sockets.on('connection', function (socket) {
  io.sockets.emit('connection made', { test: 'connected' });

  socket.on('transcript', function (data) {
    console.log('I received a transcript from saying ', msg);
    socket.broadcast.emit('transcript', data);
  });

  socket.on('call', function (msg) {
    console.log('I received a call saying ', msg);
    socket.broadcast.emit('call', msg);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });
});

console.log('Server listening on port: ' + port);