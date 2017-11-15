var socket = io.connect('http://localhost:8000');

$("#roomcode").submit(function(e){
  socket.emit('joinRoom', $("#codeid").val());
  e.preventDefault();
});

$("#pseudoform").submit(function(e){
  socket.emit('pseudo', $("#pseudo").val());
  e.preventDefault();
});

$("#createRoom").click(function(e){
  socket.emit('createRoom');
  e.preventDefault();
});

socket.on("hello", function(info){
  myID = info.id;
});

socket.on("changedPseudo", function(p){
  $("#pseudoform").html("Votre pseudo est <b>"+p+"</b>");
});

socket.on("joinedRoom", function(gameInfo) {
  cardCreate("Vous rejoignez la room: "+gameInfo.room, 10);
  roomID = gameInfo.room;
  players = gameInfo.players;
  showPlayZone();
  printListOfPlayers();
});
socket.on("createdRoom", function(id) {
  roomID = id;
  cardCreate("Envoyez cet ID à vos amis pour qu'ils vous rejoignent: "+id, 10);
  showPlayZone();
});
socket.on("newPlayerInRoom", function(id){
  addPlayer(id);
  printListOfPlayers();
});
socket.on("playerLeftRoom", function(id){
  removePlayer(id);
  printListOfPlayers();
});



socket.on("roomControl", function() {
  showRoomControl();
});
socket.on("quitRoom", function() {
  cardCreate("Le créateur de la room est parti", 5);
  showRoomControl();
});
