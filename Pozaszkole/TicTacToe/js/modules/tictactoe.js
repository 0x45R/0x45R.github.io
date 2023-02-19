function generate_attribute_template(that, attrName, defaultValue){
  if(!that.hasAttribute(attrName)){
    that.setAttribute(attrName, defaultValue)
  }
  return that.getAttribute(attrName)
}

const Score = {
  "playing": {},
  "stalemate": {
    "message": "It's a draw!"
  },
  "win": {
    "message": "You won!"
  },
  "lost":{
    "message": "You lose!"
  }
}

class Board extends HTMLElement{
  constructor(){
    super();
  }
 
  get game(){
    let elem = this
    while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
      elem = elem.parentNode;
      if(elem.tagName.toLowerCase() == "tic-tac-toe"){
        return elem;
      }
    }
  }

  get emptySquares(){
    return this.querySelectorAll("[state='empty']")
  }

  get circleTiles(){
    return this.querySelectorAll("[type='circle']")
  }

  get crossTiles(){
    return this.querySelectorAll("[type='cross']")
  }

  get tiles(){
    return this.querySelectorAll('ttc-tile')
  }

  tileByIndex(index){
    return this.tiles[Math.min(Math.max(index, 0),8)]
  }

  calculateScore(){
    // THAT CODE IS SO AWFUL I HATE IT
    let players = ["circle", "cross"];
    let types = ["horizontal","vertical", "diagonal", "inverse_diagonal"]
    for(let p = 0; p < players.length; p++){
      for(let t = 0; t < types.length; t++){
        let thisPlayer = players[p]
        let type = types[t]
        let score = 0;
        for(let c = 0; c < 3; c++){
          score = 0;
          for(let r = 0; r < 3; r++){
            let index ;
            if(type == "horizontal"){
              index = r+c*3;
            }
            else if(type == "vertical"){
              index = c+r*3
            }
            else{
              break;
            }
            if(this.tileByIndex(index).type != thisPlayer){
              break;
            }else{
              score++;
            }
          }

          if(score==3){
            console.log("TYPE",type)
            return (thisPlayer == "circle") ? Score.win : Score.lost
          }
        }
      }
    }
    for(let p = 0; p < players.length; p++){
      for(let t = 0; t < types.length; t++){
        let thisPlayer = players[p]
        let type = types[t]
        let score = 0;
        for(let i = 0; i < 3; i++){
          let index =0;
          if(type == "diagonal"){
            index = i*4;
          }
          else if(type == "inverse_diagonal"){
            index = (i+1)*2;
          }
          else{
            break;
          }
          console.log(this.tileByIndex(index))
          if(this.tileByIndex(index).type != thisPlayer){
            break;
          }else{
            score++;
          }
        }
        if(score==3){
          console.log("TYPE",type)
          return (thisPlayer == "circle") ? Score.win : Score.lost
        }  
      }
    }
    if(this.emptySquares.length == 0){
      return Score.stalemate;
    }
    return Score.playing
  }

  finishedMove(){
    this.game.currentPlayer = (this.game.currentPlayer == "circle") ? "cross" : "circle"

    let calculatedScore = this.calculateScore();
    if(calculatedScore != Score.playing){
      this.game.finish(calculatedScore);
      return false;
    }
    if(this.game.currentPlayer != this.game.humanPlayer){
      AIPlayer.calculateMove(this)
    }
  }

  connectedCallback(){
    this.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    this.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
    
    for(let c = 0; c<this.columns; c++){
      for(let r = 0; r<this.rows; r++){
        let tile = document.createElement("ttc-tile")
        this.appendChild(tile)
        tile.index
        tile.index = r+c*this.columns

      }
    }
  }

  get columns(){
    return generate_attribute_template(this, "columns", 3)
  }

  get rows(){
    return generate_attribute_template(this, "rows", 3)
  }
}

class AIPlayer{
  static calculateMove(board){
    let emptySquares = board.emptySquares;
    let chosenSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    console.log(chosenSquare)
    chosenSquare.mark(board.game.aiPlayer);
  }
}

class TicTacToe extends HTMLElement{
  constructor(){
    super();
  }

  static get observedAttributes(){
    return ['current_player', 'finished']
  }

  finish(calculatedScore){
    this.finished = true;
    let message = calculatedScore.message;
    let elem = document.createElement('div');
    elem.classList.add("post-game-menu")
    elem.innerHTML = `<p class='title'>${message}</p><p class='post-game-option rematch'>Rematch</p>`
    this.appendChild(elem)
    let rematch = this.querySelector('.rematch')
    rematch.addEventListener('click', ()=>{
      this.rematch()
    })
  }

  get finished(){
    return generate_attribute_template(this, 'finished', 'false')
  }

  set finished(val){
    this.setAttribute("finished", val)
  }

  get currentPlayer(){
    return generate_attribute_template(this, 'current_player', 'circle')
  }

  set currentPlayer(val){
    this.setAttribute("current_player", val);
  }

  get humanPlayer(){
    return generate_attribute_template(this, 'human_player', "circle")
  }

  get aiPlayer(){
    return (this.humanPlayer == "circle") ? "cross" : "circle"
  }

  rematch(){
    this.finished = false;
    this.currentPlayer = "circle";
    this.connectedCallback();


  }

  attributeChangedCallback(attrName, oldVal, newVal){
    if(attrName == "current_player"){
      let elem = this.querySelector(`.${attrName}`)
      if(elem){
        elem.innerText = newVal
      }
    }

  }

  connectedCallback(){
    this.innerHTML = `<div class='game-information'><p class='title'>tic-tac-toe</p><p>You play as <span class='human_player'>${this.humanPlayer}</span></p><p>Current player: <span class='current_player'>${this.currentPlayer}</span></p></div><ttc-board></ttc-board>`
  }
}

class Tile extends HTMLElement{
  constructor(){
    super();
  }

  set index(val){
    this.setAttribute('index', val)
  }

  get index(){
    return generate_attribute_template(this, 'index', 1)
  }

  get game(){
    let elem = this
    while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
      elem = elem.parentNode;
      if(elem.tagName.toLowerCase() == "tic-tac-toe"){
        return elem;
      }
    }
  }
  get board(){
    let elem = this
    while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
      elem = elem.parentNode;
      if(elem.tagName.toLowerCase() == "ttc-board"){
        return elem;
      }
    }
  }
  get state(){
    return generate_attribute_template(this, "state", 'empty')
  }

  set state(val){
    this.setAttribute("state", val)
  }

  get type(){
    return generate_attribute_template(this, "type", 'blank')
  }

  set type(val){
    this.setAttribute("type", val)
  }

  mark(type){
    if(this.state == "solid"){
      return false;
    }
    let keyframes = [{color:"white"},{color:"black"}]
    let options = {duration: 200, fill: 'forwards'}

    if(this.type == "blank" && this.state != "solid"){
      this.type= this.game.currentPlayer;
      this.animate(keyframes, options)
    }
    this.state = "solid";
    this.type = type;
    this.board.finishedMove();
  }

  connectedCallback(){
    this.state;

    this.addEventListener("mouseenter", (e)=>{
      let keyframes = [{color:"white"},{color:"black"}]
      let options = {duration: 200, fill: 'forwards'}
      if(this.state == "solid" || this.game.currentPlayer != this.game.humanPlayer){
        return false;
      }
      if(this.type == "blank" && this.state != "solid"){
        this.type= this.game.currentPlayer;
        this.animate(keyframes, options)
      }
    })

    this.addEventListener("click", (e)=>{
      if(this.state == "solid" || this.game.currentPlayer != this.game.humanPlayer){
        return false;
      }
      this.mark(this.game.humanPlayer)
   
    })

    this.addEventListener("mouseleave", (e)=>{
      let keyframes = [{color:"black"},{color:"white"}]
      let options = {duration: 200, fill: 'forwards'}
      if(this.state == "solid" || this.game.currentPlayer != this.game.humanPlayer){
        return false;
      }
      if(this.type == this.game.currentPlayer){
        this.animate(keyframes, options)
        setTimeout(()=>{this.type="blank";}, 200)
      }
    })
  }
}

window.customElements.define('tic-tac-toe', TicTacToe);
window.customElements.define('ttc-tile', Tile);
window.customElements.define('ttc-board', Board);
