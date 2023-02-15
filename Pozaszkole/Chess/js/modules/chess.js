export const PieceType = {
  "pawn":{
    "innerHTML": `♟︎`,
    'short': 'p'
  },
  "rook":{
    "innerHTML": `♜`,
    'short': 'r'
  },
  "knight":{
    "innerHTML": `♞`,
    'short': 'n'
  },
  "bishop":{
    "innerHTML": `♝`,
    'short': 'b'
  },
  "queen":{
    "innerHTML": `♛`,
    'short': 'q'
  },
  "king":{
    "innerHTML": `♚`,
    'short': 'k'
  }
}

export class ChessGame extends HTMLElement{
  constructor(){
    super();
  }

  get fenNotation(){
    return this.getAttribute('fen')
  }
  
  set fenNotation(val){
    this.setAttribute('fen', val)
  }

  // Implement fen notation
  convertFenToPieces(fen, board){
    let boardIndex = 0;
    fen = fen.split(" ")[0]
    for(let i = 0; i < fen.length; i++){       
      let tile = board.querySelector(`[tile-index="${boardIndex}"]`)
      let char = fen[i];
      console.log(char)
      if(!isNaN(char - parseFloat(char))){
        boardIndex+=parseInt(char);
      }
      else{
      Object.keys(PieceType).forEach((current)=>{
          if(char.toLowerCase() == PieceType[current].short){
            let chessPiece = document.createElement('chess-piece');
            chessPiece.setAttribute('type',current);
            (char == char.toLowerCase()) ? chessPiece.setAttribute('color', 'black') : chessPiece.setAttribute('color', 'white')
            tile.appendChild(chessPiece)
            boardIndex++;
          }
        })
      }
    }
    

    /*
    for(let c = 0; c < 8; c++){
      for(let r = 0; r < 8; r++){
        let tile = board.querySelector(`[tile-index="${r+c*8}"]`)
        if(Math.floor(Math.random()*10)%2==0){
          let chessPiece = document.createElement('chess-piece');
          let choices = Object.keys(PieceType)
          let randomType = choices[ Math.floor(Math.random() * choices.length)]
          chessPiece.setAttribute('type',randomType)
          tile.appendChild(chessPiece)
        }
      }
    }*/
  }

  connectedCallback(){
    this.board = document.createElement('chess-board');
      
    for(let c = 0; c < 8; c++){
      for(let r = 0; r < 8; r++){
        let tile = document.createElement('chess-tile');

        (c+r)%2 ? tile.classList.add("black") : tile.classList.add("white")
        //tile.innerHTML = `<p>${r+c*8}</p>`
        tile.setAttribute('tile-index', r+c*8)
        this.board.appendChild(tile)

      }
    }
    this.appendChild(this.board)
     
    this.convertFenToPieces(this.fenNotation, this.board)
      
    this.display = document.createElement('chess-display');
    this.display.innerHTML = `<p>${this.fenNotation}</p>`

    this.appendChild(this.display)
  }
}

export class ChessTile extends HTMLElement{
  constructor(){
    super();
  }
  transferPiece(piece){
    this.replaceChildren(piece);
  }
  connectedCallback(){

  }
}

export class ChessPiece extends HTMLElement{
  constructor(){
    super();
  }

  get pieceColor(){
    return this.getAttribute('color')
  }

  get pieceType(){
    return this.getAttribute('type')
  }

  connectedCallback(){
    var chesstiles = document.querySelectorAll("chess-tile")

    this.addEventListener('mousedown', (e)=>{
      this.classList.add("dragged")

      let shiftX = e.clientX - this.getBoundingClientRect().left;
      let shiftY = e.clientY - this.getBoundingClientRect().top;

      const moveTo = (e) => {
        this.style.left = e.pageX - shiftX + 'px';
        this.style.top = e.pageY - shiftY + 'px';
      }
      
      //tile.classList.add("possible-move")

      const getPositions = (element) => {
        var pos = element.getBoundingClientRect();
        return pos;
      }

      const checkForHoverTiles = () =>{
        chesstiles.forEach((current, index) => {
          let pos1 = getPositions(this)
          let pos2 = getPositions(current)
          if(comparePositions(pos2, pos1)){
            this.hover = current
            current.classList.add("drag-over")
           setTimeout(()=>{current.classList.remove('drag-over')}, 1000)
          }
        })
      }

      const comparePositions = (p1, p2) => {
        return p1.left < p2.left && p2.left < p1.right && p1.top < p2.top && p2.top < p1.bottom
      }
      
      const mouseMovement = (e) => {
        moveTo(e);

        if(this.lastExecution+100> Date.now()){
          return
        }

        checkForHoverTiles();

        this.lastExecution = Date.now();
      }

      document.body.append(this)
      moveTo(e);
      checkForHoverTiles();

      document.addEventListener('mousemove', mouseMovement)

      this.addEventListener("mouseup", (e)=>{
        document.removeEventListener("mousemove", mouseMovement)
        this.mouseup = null
        this.style = null
        this.classList.remove("dragged")
        this.hover.transferPiece(this)

      })
    })

    this.innerHTML = PieceType[this.pieceType].innerHTML
  }
}

window.customElements.define('chess-game', ChessGame);
window.customElements.define('chess-piece', ChessPiece);
window.customElements.define('chess-tile', ChessTile)
