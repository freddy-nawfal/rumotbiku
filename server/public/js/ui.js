var roomID;
var players = {};
var myID;
var rooms = {};
var refreshRooms;
var showReadyStatus = false;
var currentRoom;

/* later */

function showPlayZone(){
  clearInterval(refreshRooms);

  $("#playArea").show();
  $('#roomControl').hide();
  if(roomID){
    $("#roomID").html("Room: "+roomID);
  }

  $("#readyArea").html("");
  var waitForPlayers = setInterval(function(){
    if(players[myID]){
      if(players[myID].game.status == 'master'){
        $("#readyArea").html('<button type="button" class="btn btn-info" id="btnBegin">Commencer</button>');
        clearInterval(waitForPlayers);
      }
    }
  },1000);
}

function showRoomControl(){
  cardHide();
  $('#roomControl').show();
  $("#playArea").hide();

  roomID = "";
  $("#roomID").html(roomID);

  currentRoom = {};
  $("#roundWord").html("");

  $("#codeid").val("");

  players = {};
  printListOfRooms();
  refreshRooms = setInterval(printListOfRooms, 5000);
}

function hideReadyBtn(){
  $("#readyArea").html("");
}
function showReadyBtn(){
  $("#readyArea").html('<button type="button" class="btn btn-success" id="btnReady">Prêt</button>');
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
    if(showReadyStatus && players[key].game.ready){
      if(players[key].id == myID){
        if(players[key].game.status == 'master') $("#meDisplay").html('<div class="card-header alert-info"><b>MOI: </b>'+players[key].pseudo+'</div>');
        else $("#meDisplay").html('<div class="card-header alert-info"><b>MOI: </b>'+players[key].pseudo+'</div>');
      }
      else{
        if(players[key].game.status == 'master') $("#listOfPlayers").append('<li class="list-group-item border border-danger list-group-item-primary">(master)'+players[key].pseudo+'</li>');
        else $("#listOfPlayers").append('<li class="list-group-item list-group-item-primary">'+players[key].pseudo+'</li>');
      }
    }
    else{
      if(players[key].id == myID){
        if(players[key].game.status == 'master') $("#meDisplay").html('<div class="card-header alert-success"><b>MOI: </b>'+players[key].pseudo+'</div>');
        else $("#meDisplay").html('<div class="card-header"><b>MOI: </b>'+players[key].pseudo+'</div>');
      }
      else{
        if(players[key].game.status == 'master') $("#listOfPlayers").append('<li class="list-group-item border border-danger">(master)'+players[key].pseudo+'</li>');
        else $("#listOfPlayers").append('<li class="list-group-item">'+players[key].pseudo+'</li>');
      }
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
