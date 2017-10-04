var uuid = require('uuid');

module.exports = {
  Word : class{
    constructor() {
      this.word = this.generateWord();
      this.generatedTime = Date.now();
    }
    generateWord(){
      return "bonjour";
    }
  },

  Player : class{
    constructor(pseudo) {
      this.id = this.generateId();
      if(!pseudo)this.pseudo = "Random Player";
      else this.pseudo = verifyPseudo(pseudo);
      this.game = undefined; // game de type Game
    }

    generateId(){
      return uuid.v4();
    }
  },

  Game : class{
    constructor(status){
      this.room = undefined; // id de la room
      this.score = 0;
      this.status = status; // ou master
    }
  },

  Room : class{
    constructor(){
      this.roomid = this.generateRoomId();
      this.currentWord = undefined; // mot actuel (de type Word)
      this.guesserID = undefined; // id du joueur qui fait deviner
      this.createdOn = Date.now();
    }

    generateRoomId(){
      return uuid.v4();
    }
  }
}
