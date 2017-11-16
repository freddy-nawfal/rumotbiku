var roomID;
var players = {};
var myID;
var rooms = {};
var refreshRooms;

/* later */

function showPlayZone(){
  clearInterval(refreshRooms);

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

  players = {};
  printListOfRooms();
  refreshRooms = setInterval(printListOfRooms, 5000);
}

function addPlayer(p){
  players[p.id] = p;
}
function removePlayer(id){
  delete players[id];
}

function printListOfPlayers(){
  $("#listOfPlayers").html("");
  $("#meDisplay").html("");

  Object.keys(players).forEach(function(key) {
    if(players[key].id == myID){
      if(players[key].game.status == 'master') $("#meDisplay").html('<div class="card-header alert-success"><b>MOI: </b>'+players[key].pseudo+'</div>');
      else $("#meDisplay").html('<div class="card-header"><b>MOI: </b>'+players[key].pseudo+'</div>');
    }
    else{
      if(players[key].game.status == 'master') $("#listOfPlayers").append('<li class="list-group-item border border-danger">(master)'+players[key].pseudo+'</li>');
      else $("#listOfPlayers").append('<li class="list-group-item">'+players[key].pseudo+'</li>');
    }
  });
}


function printListOfRooms(){
  $("#roomList").html("");

  var nbRooms = 0;
  Object.keys(rooms).forEach(function(key) {
    nbRooms++;
    $("#roomList").append('<li class="list-group-item d-flex justify-content-between align-items-center" room="'+rooms[key].roomid+'">'+rooms[key].roomid+' - Rounds: '+rooms[key].rounds+'<span class="badge badge-primary badge-pill">'+rooms[key].playersCount+'/'+rooms[key].maxPlayers+'</span></li>');
  });
  if(nbRooms == 0){
    $("#roomList").html("Il n'y a aucune room existante, créez-en une dès maintenant !");
  }
}
