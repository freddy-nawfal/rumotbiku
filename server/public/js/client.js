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
$("#roomList").on('click', 'li', function(event){
    $(this).html("Veuillez patienter");
    socket.emit('joinRoom', $(this).attr("room"));
});
$(document.body).on('click', '#btnReady', function(e){
  hideReadyBtn();
  socket.emit('ready');
  e.preventDefault();
});
$(document.body).on('click', '#btnBegin', function(e){
  socket.emit("beginGame");
  e.preventDefault();
});





socket.on("hello", function(info){
  myID = info.id;
});

socket.on("changedPseudo", function(p){
  $("#pseudoform").html("Votre pseudo est <b>"+p+"</b>");
});

socket.on("joinedRoom", function(gameInfo) {
  cardCreate("En attente du master ...");
  roomID = gameInfo.room;
  players = gameInfo.players;
  showPlayZone();
  printListOfPlayers();
});
socket.on("createdRoom", function(id) {
  roomID = id;
  cardCreate("Envoyez cet ID à vos amis pour qu'ils vous rejoignent: "+id, 5);
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


socket.on("listOfRooms", function(r){
  rooms = r;
  printListOfRooms();
});


socket.on("getReady", function(){
  cardHide();
  showReadyStatus = true;
  showReadyBtn();
});
socket.on("playerIsReady", function(id){
  players[id].game.ready = true;
  printListOfPlayers();
});
socket.on("roundStart", function(){
  showReadyStatus = false;
  hideReadyBtn();
  cardCreate("Le round va commencer sous peu...");
});


socket.on("roomStatus", function(roomData){
  if(roomData.word){
    cardCreate("Vous faites deviner: <b>"+roomData.word+"</b>");
    $("#roundWord").html("Mot: "+roomData.word);
  }
  else{
    cardCreate("<b>"+roomData.guesserName+"</b> vous fait deviner le mot");
  }
  currentRoom = roomData;
});

socket.on("errorMSG", function(data){
  cardCreate(data, 5, "alert");
});
