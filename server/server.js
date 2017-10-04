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
      rooms[room.roomid] = room;

      players[playerIndex].game = game;

      console.log(players[playerIndex]);

      //ICI TRANSITIONNER LE JOUEUR VERS SA ROOM

      socket.emit("joinedRoom", room.roomid);

    }
    else{
      //afficher message d'erreur
      console.log("Joueur deja dans une game");
    }
  });
  socket.on("joinRoom", function(data){
//tester si data a un format correct
var playerIndex = socket.playerID;
  if(playerIndex){
    if(players[playerIndex].game == undefined){
      //rejoindre la room
      if(rooms[data]){
        var game = new classes.Game('player');
        game.room = data;
        players[playerIndex].game = game;

        console.log(players[playerIndex]);

        //ICI TRANSITIONNER LE JOUEUR VERS LA ROOM

        socket.emit("joinedRoom", game.room);
      }
      else{
        console.log("Tentative de room non existante");
      }
    }
    else{
      //message d'erreur et demande d'autorisation de changer de game
      console.log("Joueur deja dans une game.\nVoulez vous quitter cette game ?\n(fonction a faire)");
      //demande de oui ou non
    }
  }
  else{
    console.log("bug.");
  }
  });

  socket.on('disconnect', function(){
    deleteUser(socket);
  });
});




server.listen(8000);

function quitGame(p){
  if(players[playerIndex].game != undefined){

  }
}

function deleteUser(s){
  testRoom(s);
  delete players[s.playerID];
  console.log(rooms);
}


function testRoom(s){
  if(players[s.playerID].game){
    var room = rooms[players[s.playerID].game.room];
    var playersInRoom = getPlayersByRoomId(room.roomid);
    if(playersInRoom.length <= 1){
      delete rooms[room.roomid];
    }
  }
}

function getPlayersByRoomId(id){
  var playerList = [];
  Object.keys(players).forEach(function(key) {
    if(players[key].game){
      if(players[key].game.room == id) playerList.push(key);
    }
  });
  return playerList;
}
