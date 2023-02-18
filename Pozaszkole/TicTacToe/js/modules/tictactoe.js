function generate_attribute_template(that, attrName, defaultValue){
  if(!that.hasAttribute(attrName)){
    that.setAttribute(attrName, defaultValue)
  }
  return that.getAttribute(attrName)
}

const Score = {
  "playing": {},
  "stalemate": {
    "message": "It's a DRAW!"
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

  calculateScore(){
    if(this.emptySquares.length == 0){
      return Score.stalemate;
    }
    
    return Score.playing
  }

  update(){
    this.game.currentPlayer = (this.game.currentPlayer == "circle") ? "cross" : "circle"
    let calculatedScore = this.calculateScore();
    if(calculatedScore != Score.playing){
      this.game.finish(calculatedScore);
    }
  }

  connectedCallback(){
    this.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    this.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
    
    for(let c = 0; c<this.columns; c++){
      for(let r = 0; r<this.rows; r++){
        let tile = document.createElement("ttc-tile")
        this.appendChild(tile)
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

  rematch(){
    this.finished = false;
    this.connectedCallback()

  }

  attributeChangedCallback(attrName, oldVal, newVal){
    if(attrName == "current_player"){
      let elem = this.querySelector(`.${attrName}`)
      if(elem){elem.innerText = newVal}
    }

  }

  connectedCallback(){
    this.innerHTML = `<div class='game-information'><p class='title'>tic-tac-toe</p><p>Current player: <span class='current_player'>${this.currentPlayer}</span></p></div><ttc-board></ttc-board>`
  }
}

class Tile extends HTMLElement{
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

  connectedCallback(){
    this.state;
    this.addEventListener("mouseenter", (e)=>{
      let keyframes = [{color:"white"},{color:"black"}]
      let options = {duration: 200, fill: 'forwards'}
      if(this.state == "solid"){
        return false;
      }
      if(this.type == "blank" && this.state != "solid"){
        this.type= this.game.currentPlayer;
        this.animate(keyframes, options)
      }
    })

    this.addEventListener("click", (e)=>{
      this.state = "solid"
      this.board.update();
    })

    this.addEventListener("mouseleave", (e)=>{
      let keyframes = [{color:"black"},{color:"white"}]
      let options = {duration: 200, fill: 'forwards'}
      if(this.state == "solid"){
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
