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
      this.game = undefined;
    }

    generateId(){
      return "15235";
    }
  },

  Game : class{
    constructor(){
      this.room = undefined;
      this.score = 0;
      this.status = "player"; // ou master
    }
  },

  Room : class{
    constructor(){
      this.roomid = undefined;
      this.currentWord = undefined;
    }
  }
}
