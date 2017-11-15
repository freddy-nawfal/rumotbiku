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
  // On instancie le nouveau joueur
  var newPlayer = new classes.Player(false, socket.id);
  players[newPlayer.id] = newPlayer;
  socket.emit("roomControl");


  // Event de creation de room
  socket.on("createRoom", function(){
    var playerIndex = socket.id;
    if(players[playerIndex].game == undefined){ //s'il n'est pas dans une game
      //creation de la room
      var room = new classes.Room();
      var game = new classes.Game('master');
      game.room = room.roomid;
      rooms[room.roomid] = room;

      players[playerIndex].game = game;

      console.log(players[playerIndex]);

      //Transition du joueur dans sa room

      socket.emit("createdRoom", room.roomid);

    }
    else{ // s'il est déjà dans une game
      //afficher message d'erreur
      console.log("Joueur deja dans une game");
    }
  });
  socket.on("joinRoom", function(data){
//tester si data a un format correct
var playerIndex = socket.id;
  if(playerIndex){
    if(players[playerIndex].game == undefined){//s'il n'est pas dans une game
      //rejoindre la room
      if(rooms[data]){
        var game = new classes.Game('player');
        game.room = data;
        players[playerIndex].game = game;
        //Transition du joueur dans sa room
        socket.emit("joinedRoom", game.room);

        //On informe les autres joueurs
        emitToAllPlayersInRoom(game.room, "newPlayerInRoom", players[playerIndex].id)
      }
      else{
        console.log("Tentative de room non existante");
      }
    }
    else{// s'il est déjà dans une game
      //message d'erreur et demande d'autorisation de changer de game
      console.log("Joueur deja dans une game.");
    }
  }
  else{
    forceDisconnect(socket);
  }
  });

  socket.on('disconnect', function(){
    deleteUser(socket);
  });
});


server.listen(8000);


// fonctions utilitaires
function forceDisconnect(socket){
  socket.emit("forceDisconnect");
  socket.disconnect();
}

function deleteUser(s){
  testRoomAndQuit(s);
  delete players[s.id];
}


function testRoomAndQuit(s){
  if(players[s.id].game){
    var room = rooms[players[s.id].game.room];
    var playersInRoom = getPlayersByRoomId(room.roomid);
    for(i=0; i<playersInRoom.length; i++){
      players[playersInRoom[i]].game = undefined;
      io.to(players[playersInRoom[i]].id).emit("quitRoom");
    }
    delete rooms[room.roomid];
  }
}

function emitToAllPlayersInRoom(room, eventName, options){
  var playersInRoom = getPlayersByRoomId(room.roomid);
  for(i=0; i<playersInRoom.length; i++){
    if(options)
      io.to(players[playersInRoom[i]].id).emit(eventName, options);
    else
      io.to(players[playersInRoom[i]].id).emit(eventName);
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

function startRound(roomid){
  if(rooms[roomid].rounds > 0){
    switchTurns(roomid);
    //emit round status to all players
    //emit word to guesser
  }
  else{
    //end game
    //display scores
  }
}

function switchTurns(roomid){
  var playersInRoom = getPlayersByRoomId(roomid);
  rooms[roomid].guesserID = (getRandomPlayer(playersInRoom)).id;
  rooms[roomid].currentWord = new Word();
  rooms[roomid].rounds--;
}

function getRandomPlayer(ListOfPlayers){
  var random = Math.floor(Math.random() * (ListOfPlayers.length-1)) + 1;
  return players[ListOfPlayers[random]];
}
