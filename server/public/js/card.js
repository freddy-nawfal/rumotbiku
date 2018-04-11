var cardIsSet = false;
var card;
var cardTimer;

function cardShow(){
  if(cardIsSet)
    card.show();
}
function cardHide(){
  if(cardIsSet)
    card.hide();
}
function cardText(text, type){
  if(cardIsSet){
    switch (type) {
      case "alert":
        card.html('<div class="container"><div class="card border-danger" id="card"><div class="card-body">'+text+'</div></div></div>');
        break;
      default:
        card.html('<div class="container"><div class="card" id="card"><div class="card-body">'+text+'</div></div></div>');
    }

  }
}
function cardCreate(text, time, type){
  if(!cardIsSet){
    $("body").prepend('<span id="card"></span>');
    card = $("#card");
    cardIsSet = true;
  }
  cardText(text, type);
  cardShow();

  if(time > 0){
    //cardTimer = setInterval(cardShow, 0);
    clearInterval(cardTimer);
    cardTimer = setInterval(cardHide, time*1000);
  }
  else{
    clearInterval(cardTimer);
  }
}
