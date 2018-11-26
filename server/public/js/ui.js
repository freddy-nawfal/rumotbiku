var roomID;
var players = {};
var myID;
var rooms = {};
var refreshRooms;
var showReadyStatus = false;
var currentRoom;
var iAmGuesser = false;

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

function hideProgressBar(){
  $("#progressBar").hide();
}
function showProgressBar(){
  $("#progressBar").show();
}

function addPlayer(p){
  players[p.id] = p;
  insertLog(p.pseudo+ "a rejoint la room");
}
function removePlayer(id){
  insertLog(players[id].pseudo+ "a quitté la room");
  delete players[id];
}

function printListOfPlayers(){
  $("#listOfPlayers").html("");
  $("#meDisplay").html("");

  Object.keys(players).forEach(function(key) {
    var isMaster = (players[key].game.status == 'master');
    if(showReadyStatus && players[key].game.ready){
      if(players[key].id == myID){
        $("#meDisplay").html('<div class="card-header alert-info"><b>MOI: </b>'+players[key].pseudo+'</div>');
      }
      else{
        if(isMaster) $("#listOfPlayers").append('<li class="list-group-item border border-danger list-group-item-primary">(master)'+players[key].pseudo+'</li>');
        else $("#listOfPlayers").append('<li class="list-group-item list-group-item-primary">'+players[key].pseudo+'</li>');
      }
    }
    else{
      if(players[key].id == myID){
        if(isMaster) $("#meDisplay").html('<div class="card-header alert-success"><b>MOI: </b>'+players[key].pseudo+'</div>');
        else $("#meDisplay").html('<div class="card-header"><b>MOI: </b>'+players[key].pseudo+'</div>');
      }
      else{
        if(isMaster) $("#listOfPlayers").append('<li class="list-group-item border border-danger">(master)'+players[key].pseudo+'</li>');
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


function progress(timeleft, timetotal, $element) {
  var progressBarWidth = timeleft * $element.width() / timetotal;
  $element.find('div').animate({ width: progressBarWidth }, 500).html(Math.floor(timeleft/60) + ":"+ timeleft%60);
  if(timeleft > 0) {
      setTimeout(function() {
          progress(timeleft - 1, timetotal, $element);
      }, 1000);
  }
};

function insertChat(data){
  console.log(data.player+": "+myID);
  var player = players[data.player];
  if(data.player == myID){
    $("#chat-area").append('<div class="chatmsgme">'+data.word+'</div>');
  }
  else{
    $("#chat-area").append('<div class="chatmsg">'+player.pseudo+": "+data.word+'</div>');
  }
}

function insertLog(data){
  $("#chat-area").append('<div class="log">'+data+'</div>');
}