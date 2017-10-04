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
  createPlayer(socket);


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
//tester si data a un format correct
  if(playerIndex != NULL){
    if(players[playerIndex].game == undefined){
      //rejoindre la room
      if(rooms[data]){
        var game = new classes.Game('player');
        game.room = data;
        players[playerIndex].game = game;
      }
    }
    else{
      //message d'erreur et demande d'autorisation de changer de game
      console.log("Joueur deja dans une game.\nVoulez vous quitter cette game ?\n(fonction a faire)"
      //demande de oui ou non
    }
  else{
    createPlayer(socket);
    console.log("joueur créé.");
  }
  }
  });

  socket.on('disconnect', function(){
    deleteUser(socket);
  });
});




server.listen(8000);


function createPlayer(s){
  var newPlayer = new classes.Player();
  s.playerID = newPlayer.id;
  players[newPlayer.id] = newPlayer;
}

function quitGame(p){
  if(players[playerIndex].game != undefined){

  }
}

function deleteUser(s){
  delete players[s.playerID];
}
