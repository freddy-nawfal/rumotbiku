var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var classes = require('./classes.js');

server.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  var player = new classes.Player();
});
