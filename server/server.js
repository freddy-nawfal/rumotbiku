var express = require('express');
 var path = require('path');
 var app = express();
 var server = require('http').Server(app);
 var io = require('socket.io')(server);
 var classes = require("./classes.js");

 var publicPath = path.resolve(__dirname, 'public');


 app.use(express.static(publicPath));
 app.get('/', function(req, res){
     res.sendFile('index.html', {root: publicPath});
 });


var players = [];

io.on('connection', function (socket) {
  players.push(new classes.Player());


  socket.on("createRoom", function(){
    if(this.game == undefined){
      //creation de la room
    }
    else{
      //afficher message d'erreur
    }
  });
  socket.on("joinRoom", function(data){
    if(this.game == undefined){
      //rejoindre la room
    }
    else{
      //afficher message d'erreur
    }
  });
});




server.listen(8000);
