var socket = io.connect('http://localhost:8000');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});


$("#roomcode").submit(function(e){
  socket.emit('joinRoom', $("#codeid").val());
  e.preventDefault();
});

$("#createRoom").click(function(e){
  socket.emit('createRoom');
  e.preventDefault();
});

socket.on("joinedRoom", function(id) {
  cardCreate("Vous rejoignez la room: "+id, 10);
  roomID = id;
  showPlayZone();
});
socket.on("createdRoom", function(id) {
  roomID = id;
  cardCreate("Vous créez une room\n Envoyez cet ID à vos amis pour qu'ils vous rejoignent: "+id, 10);
  showPlayZone();
});


socket.on("roomControl", function() {
  showRoomControl();
});


socket.on("quitRoom", function() {
  cardCreate("Le créateur de la room est parti", 5);
  showRoomControl();
});


var roomID;

function showPlayZone(){
  $("#playArea").show();
  $('#roomControl').hide();
  if(roomID){
    $("#roomID").html("Room: "+roomID);
  }
}

function showRoomControl(){
  $('#roomControl').show();
  $("#playArea").hide();

  roomID = "";
  $("#roomID").html(roomID);

  $("#codeid").val("");
}
