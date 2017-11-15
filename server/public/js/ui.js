var roomID;
var players = {};
var myID;


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

  players = {};
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
