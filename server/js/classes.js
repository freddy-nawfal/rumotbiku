module.exports = {
  Word = class{
    constructor() {
      this.word = this.generateWord();
      this.generatedTime = date.now();
    }
    generateWord(){
      return "bonjour";
    }
  },

  Player = class{
    constructor(pseudo) {
      this.id = generateId();
      if(!pseudo)this.pseudo = "Random Player";
      else this.pseudo = verifyPseudo(pseudo);
      this.game = NULL;
    }

    generateId(){
      return "15235";
    }
  },

  Game = class{
    constructor(){
      this.room = NULL;
      this.score = 0;
      this.status = "player"; // ou master
    }
  },

  Room = class{
    constructor(){
      this.roomid = NULL;
      this.currentWord = NULL;
    }
  }
}
