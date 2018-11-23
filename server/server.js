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

io.on('connection', function(socket) {
  // On instancie le nouveau joueur
  var newPlayer = new classes.Player(false, socket.id);
  players[newPlayer.id] = newPlayer;
  socket.emit("hello", {id: newPlayer.id});
  socket.emit("roomControl");

  sendListOfLobbys(newPlayer.id);

  socket.on('pseudo', function(p){
    players[socket.id].setPseudo(p);
    socket.emit("changedPseudo", players[socket.id].pseudo);
  });

  // Event de creation de room
  socket.on("createRoom", function(){
    if(!isPlayerInGame(socket)){ //s'il n'est pas dans une game
      //creation de la room
      var room = new classes.Room(5);
      var game = new classes.Game('master');
      game.room = room.roomid;
      rooms[room.roomid] = room;

      players[socket.id].game = game;

      //Transition du joueur dans sa room
      socket.emit("createdRoom", room.roomid);
      socket.emit("newPlayerInRoom", returnSafePlayer(socket.id));
      rooms[room.roomid].playersCount++;
    }
    else{ // s'il est déjà dans une game
      //afficher message d'erreur
      console.log("Joueur deja dans une game");
    }
  });



  socket.on("joinRoom", function(data){
    //tester si data a un format correct
    if(!isPlayerInGame(socket)){//s'il n'est pas dans une game
      //rejoindre la room
      if(rooms[data]){
        if(rooms[data].playersCount < rooms[data].maxPlayers && !rooms[data].started){
          var game = new classes.Game('player');
          game.room = data;
          players[socket.id].game = game;

          //On informe les autres joueurs
          broadcastToAllPlayersInRoom(socket.id, rooms[game.room], "newPlayerInRoom", returnSafePlayer(socket.id));

          //Transition du joueur dans sa room
          socket.emit("joinedRoom", {room: game.room, players: returnAllPlayersInRoomSafe(game.room)});
          rooms[data].playersCount++;

          if(rooms[data].playersCount == rooms[data].maxPlayers){
            rooms[data].started = true;
            beginReadyCountDown(rooms[data]);
          }
        }
      }
      else{
        console.log("Tentative de room non existante");
      }
    }
    else{// s'il est déjà dans une game
      //message d'erreur et demande d'autorisation de changer de game
      console.log("Joueur deja dans une game.");
    }
  });

  socket.on('beginGame', function(){
      if(isPlayerInGame(socket)){//s'il n'est pas dans une game
        if(players[socket.id].game.status == 'master'){
          if(!rooms[players[socket.id].game.room].started){
            if(getPlayersByRoomId(players[socket.id].game.room).length >= 2){
              rooms[players[socket.id].game.room].started = true;
              beginReadyCountDown(rooms[players[socket.id].game.room]);
            }
            else{
              socket.emit("errorMSG", "Il doit y avoir au moins 2 personnes dans la room");
            }
          }
        }
      }
  });

  socket.on("ready", function(){
    if(isPlayerInGame(socket)){
      players[socket.id].game.ready = true;
      emitToAllPlayersInRoom(rooms[players[socket.id].game.room], "playerIsReady", socket.id);
      if(allPlayersReadyInRoom(rooms[players[socket.id].game.room])){
        beginRound(rooms[players[socket.id].game.room]);
      }
    }
  });

  socket.on("draw", function(data){
    if(isPlayerInGame(socket)){
      if(rooms[players[socket.id].game.room].guesserID == socket.id){ // we are the guesser
        broadcastToAllPlayersInRoom(socket.id, rooms[players[socket.id].game.room], "drawing", data);
      }
    }
  });

  socket.on('disconnect', function(){
    deleteUser(socket);
  });
});


server.listen(8000);

// fonctions à rafraichissement
setInterval(function(){
  sendListOfLobbys();
}, 5000);


// fonctions utilitaires
function isPlayerInGame(s){
  var playerIndex = s.id;
    if(playerIndex){
      if(players[playerIndex].game){
        return true;
      }
    }
    return false;
}

function beginReadyCountDown(room){
  rooms[room.roomid].roundStarted = false;
  rooms[room.roomid].readyCount = 0;
  emitToAllPlayersInRoom(rooms[room.roomid], "getReady");
  rooms[room.roomid].readyCountDown = setInterval(function(){
    if(rooms[room.roomid].readyCount == 30){
      beginRound(rooms[room.roomid]);
    }
    else{
      rooms[room.roomid].readyCount++;
    }
  }, 1000);
}

function beginRound(room){
  if(!rooms[room.roomid].roundStarted){
    rooms[room.roomid].roundStarted = true;
    clearInterval(rooms[room.roomid].readyCountDown);
    var playersInRoom = getPlayersByRoomId(room);
    for(i=0; i<playersInRoom.length; i++){
      players[playersInRoom[i]].game.ready = false;
    }
    startRound(room.roomid);
  }
}

function startRound(roomid){
  if(rooms[roomid].rounds > 0){
    emitToAllPlayersInRoom(rooms[roomid], "roundStart", rooms[roomid].rounds);
    switchTurns(roomid);


    //emit round status to all players
    emitToAllPlayersInRoom(rooms[roomid], "roomStatus", rooms[roomid].getSafe(false));
    //emit word to guesser
    emitToPlayer(rooms[roomid].guesserID, "roomStatus", rooms[roomid].getSafe(true));
  }
  else{
    //end game
    //display scores
  }
}

function switchTurns(roomid){
  var playersInRoom = getPlayersByRoomId(roomid);
  rooms[roomid].guesserID = (getRandomPlayer(playersInRoom)).id;
  rooms[roomid].guesserName = players[rooms[roomid].guesserID].pseudo;
  rooms[roomid].currentWord = new classes.Word();
  rooms[roomid].rounds--;

  Object.keys(playersInRoom).forEach(function(key) {
    if(playersInRoom[key].game){
      playersInRoom[key].game.guess = "";
    }
  });
  console.log("rounds: "+rooms[roomid].rounds+" Guesser: "+rooms[roomid].guesserName+" word: "+rooms[roomid].currentWord.word);
}

function getRandomPlayer(ListOfPlayers){
  var random = Math.floor(Math.random() * (ListOfPlayers.length-1)) + 1;
  return players[ListOfPlayers[random]];
}


////////////////////////


function allPlayersReadyInRoom(room){
  var playersInRoom = getPlayersIDByRoomId(room.roomid);
  for(i=0; i<playersInRoom.length; i++){
    if(!players[playersInRoom[i]].game.ready){
      return false;
    }
  }
  return true;
}

function sendListOfLobbys(user){
  var roomList = {};
  Object.keys(rooms).forEach(function(key) {
    if(!rooms[key].started && rooms[key].public && (rooms[key].playersCount < rooms[key].maxPlayers)){
      var safeRoom = new classes.Room(rooms[key].rounds);
      safeRoom.guesserID = rooms[key].guesserID;
      safeRoom.rounds = rooms[key].rounds;
      safeRoom.roomid = rooms[key].roomid;
      safeRoom.maxPlayers = rooms[key].maxPlayers;
      safeRoom.playersCount = rooms[key].playersCount;
      safeRoom.createdOn = rooms[key].createdOn;

      roomList[key] = safeRoom;
    }
  });

  if(user){
    io.to(user).emit("listOfRooms", roomList);
  }
  else{
    io.sockets.emit("listOfRooms", roomList);
  }
}



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
    if(players[s.id].game.status == 'master'){
      var room = rooms[players[s.id].game.room];
      var playersInRoom = getPlayersByRoomId(room.roomid);
      for(i=0; i<playersInRoom.length; i++){
        players[playersInRoom[i]].game = undefined;
        io.to(players[playersInRoom[i]].id).emit("quitRoom");
      }
      clearInterval(rooms[room.roomid].readyCountDown);
      delete rooms[room.roomid];
    }
    else{
      emitToAllPlayersInRoom(rooms[players[s.id].game.room], "playerLeftRoom", players[s.id].id);
      players[s.id].game == undefined;
      rooms[players[s.id].game.room].playersCount--;
    }
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

function emitToPlayer(id, eventName, options){
  if(options)
    io.to(id).emit(eventName, options);
  else
    io.to(id).emit(eventName);
}

function broadcastToAllPlayersInRoom(myid, room, eventName, options){
  var playersInRoom = getPlayersByRoomId(room.roomid);
  for(i=0; i<playersInRoom.length; i++){
    if(players[playersInRoom[i]].id != myid){
      if(options)
        io.to(players[playersInRoom[i]].id).emit(eventName, options);
      else
        io.to(players[playersInRoom[i]].id).emit(eventName);
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

function getPlayersIDByRoomId(id){
  var playerList = [];
  Object.keys(players).forEach(function(key) {
    if(players[key].game){
      if(players[key].game.room == id) playerList.push(players[key].id);
    }
  });
  return playerList;
}

function returnAllPlayersInRoomSafe(id){
  var playerList = {};
  Object.keys(players).forEach(function(key) {
    if(players[key].game){
      if(players[key].game.room == id){
        var safePlayer = new classes.Player(players[key].pseudo, players[key].id);
        safePlayer.id = players[key].id;
        safePlayer.pseudo = players[key].pseudo;

        safePlayer.game = new classes.Game(players[key].game.status);
        safePlayer.game.score = players[key].game.score;
        safePlayer.game.status = players[key].game.status;
        safePlayer.game.ready = players[key].game.ready;

        safePlayer.game.room = new classes.Room(players[key].game.room.rounds);
        safePlayer.game.room.guesserID = players[key].game.room.guesserID;
        safePlayer.game.room.started = players[key].game.room.started;
        safePlayer.game.room.rounds = players[key].game.room.rounds;

        playerList[key] = safePlayer;
      }
    }
  });
  return playerList;
}

function returnSafePlayer(id){
  var safePlayer = new classes.Player(players[id].pseudo, id);
  safePlayer.id = players[id].id;
  safePlayer.pseudo = players[id].pseudo;

  safePlayer.game = new classes.Game(players[id].game.status);
  safePlayer.game.score = players[id].game.score;
  safePlayer.game.status = players[id].game.status;
  safePlayer.game.ready = players[id].game.ready;

  safePlayer.game.room = new classes.Room(players[id].game.room.rounds);
  safePlayer.game.room.guesserID = players[id].game.room.guesserID;
  safePlayer.game.room.started = players[id].game.room.started;
  safePlayer.game.room.rounds = players[id].game.room.rounds;
  return safePlayer;
}
