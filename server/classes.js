var randomstring = require("randomstring");


module.exports = {
  Word : class{
    constructor() {
      this.word = this.generateWord();
      this.generatedTime = Date.now();
      return this.word;
    }
    generateWord(){
      return "bonjour";
    }
  },

  Player : class{
    constructor(pseudo, id) {
      this.id = id;
      if(!pseudo)this.pseudo = "Player_"+randomstring.generate(7);
      else this.pseudo = this.verifyPseudo(pseudo);
      this.game = undefined; // game de type Game
    }

    verifyPseudo(p){
      if(p.trim().length == 0){
        return "Player_"+randomstring.generate(7);
      }
      return p;
    }

    setPseudo(p){
      this.pseudo = this.verifyPseudo(p);
    }
  },

  Game : class{
    constructor(status){
      this.room = undefined; // id de la room
      this.score = 0;
      this.status = status;
      this.ready = false;
      this.guess = "";
    }
  },

  Room : class{
    constructor(rounds){
      this.roomid = this.generateRoomId();
      this.currentWord = undefined; // mot actuel (de type Word)
      this.guesserID = undefined; // id du joueur qui fait deviner
      this.guesserName = undefined; //pseudo du joueur qui fait deviner
      this.createdOn = Date.now();
      this.public = true;
      this.started = false;
      this.rounds = rounds;
      this.maxPlayers = 4;
      this.playersCount = 0;
      this.readyCount = 0;
      this.readyCountDown;
      this.roundStarted = false;
    }

    generateRoomId(){
      return (randomstring.generate(7)).toUpperCase();
    }

    getSafe(withWord){
      var safeRoom = {};
      if(withWord){
        safeRoom.word = this.currentWord.word;
      }
      safeRoom.guesserID = this.guesserID;
      safeRoom.guesserName = this.guesserName;
      safeRoom.rounds = this.rounds;

      return safeRoom;
    }
  }
}
