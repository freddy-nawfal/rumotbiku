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


var players = {};
var rooms = {};

io.on('connection', function (socket) {
  var newPlayer = new classes.Player();
  socket.playerID = newPlayer.id;
  players[newPlayer.id] = newPlayer;


  socket.on("createRoom", function(){
    var playerIndex = socket.playerID;
    if(players[playerIndex].game == undefined){
      //creation de la room
      var room = new classes.Room();
      var game = new classes.Game('master');
      game.room = room.roomid;

      players[playerIndex].game = game;

      console.log(players[playerIndex]);

      //ICI TRANSITIONNER LE JOUEUR VERS SA ROOM
    }
    else{
      //afficher message d'erreur
      console.log("Joueur deja dans une game");
    }
  });
  socket.on("joinRoom", function(data){
    if(players[playerIndex].game == undefined){
      //rejoindre la room
      if(rooms[data]){
        var game = new classes.Game('player');
        game.room = data;
        players[playerIndex].game = game;
      }
    }
    else{
      //afficher message d'erreur
    }
  });

  socket.on('disconnect', function(){
    deleteUser(socket);
  });
});




server.listen(8000);



function deleteUser(s){
  delete players[s.playerID];
}
