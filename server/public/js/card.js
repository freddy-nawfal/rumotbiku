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
function cardText(text){
  if(cardIsSet)
    card.html('<div class="container"><div class="card" id="card"><div class="card-body">'+text+'</div></div></div>');
}
function cardCreate(text, time){
  if(!cardIsSet){
    $("body").prepend('<span id="card"></span>');
    card = $("#card");
    cardIsSet = true;
  }
  cardText(text);
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
