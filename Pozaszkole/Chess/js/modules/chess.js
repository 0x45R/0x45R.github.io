// THIS CODE IS IN NO MEANS FINAL, IT WILL BE REFACTORED IN THE FUTURE DO NOT PUT THIS ON R/BADCODE PLS

const generateNumberOfTilesToEdge = () => {
  let result = []
  for(let file = 0; file < 8; file ++){
    for(let rank = 0; rank < 8; rank ++){
      let numNorth =  rank;
      let numSouth = 7- rank;
      let numWest = 7- file;
      let numEast =  file;
      
      let tileIndex = rank * 8 + file;
      result[tileIndex] = [
        numNorth,
        numSouth,
        numWest,
        numEast,
        Math.min(numNorth, numWest),
        Math.min(numSouth, numEast),
        Math.min(numNorth, numEast),
        Math.min(numSouth, numWest)
      ];
    }
  }
  return result;
}

const numberOfTilesToEdge = generateNumberOfTilesToEdge();
const directionOffsets = [ 8, -8, -1, 1, 7, -7, 9, -9];


const generateValidSlidingMoves = (piece) => {
  let result = []
  let startTile = parseInt(piece.startingIndex)

  let startDirectionIndex = (piece.pieceObject == PieceType.bishop) ? 4 : 0; // Bishop can only move diagonally
  let endDirectionIndex = (piece.pieceObject == PieceType.rook ) ? 4: 8; // While rook can only move in a straight line
  // If <piece> is neither rook or bishop then it can move in every direction like a queen

  for(let directionIndex = startDirectionIndex; directionIndex < endDirectionIndex; directionIndex++){ // Repeat
    for(let n = 0; n < numberOfTilesToEdge[startTile][directionIndex]; n++){
      let targetTile = piece.board.getTile(startTile - directionOffsets[directionIndex] * (n+1)) // Offset starting position
      let pieceOnTargetTile = targetTile.getPiece; // Get piece on valid tile
      if(!pieceOnTargetTile){
        result.push(targetTile)
        continue; // There is nothing in way we can move forward
      }

      if(piece.pieceColor == pieceOnTargetTile.pieceColor){
        break; // There's an allied piece in way that's blocking us
      }
      result.push(targetTile) // If there aren't any allied pieces in the way then targeted tile is valid
      if(piece.pieceColor != pieceOnTargetTile.pieceColor){
        break; // There's an enemy piece that's blocking us 
      }
    }
  }

  return result; // Return every valid tile
}

const generateValidKnightMoves = (piece) => {
  let result = [];
  let startTile = parseInt(piece.startingIndex);

  let knightOffsets = [15, 17, 6, 10, -6, -10, -15, -17] // Setting up knight's offset
  let direction = (piece.pieceColor == "white") ? -1 : 1; // Setting up the direction based on piece's color

  for(let i = 0; i < knightOffsets.length; i++){ // For every knight possible move
    let targetIndex = startTile+knightOffsets[i]*direction; // Get targeted index

    if(targetIndex > 63 || targetIndex < 0){ // If index's out of bounds
      continue;
    }

    let targetTile = piece.board.getTile(targetIndex) // Get target tile that has targeted index
    let pieceOnTargetTile = targetTile.getPiece; // Get the piece that's on the tile

    if(!pieceOnTargetTile){ // If there is no piece on this tile then move is valid and continue
      result.push(targetTile);
      continue;
    }

    if(pieceOnTargetTile.pieceColor != piece.pieceColor){ // If piece is our enemy then move is valid
      result.push(targetTile);
    }

  }

  return result;
}

const generateValidPawnMoves = (piece) => {
  let result = [];
  let startTile = parseInt(piece.startingIndex);

  let row = 8-Math.ceil((startTile+1)/8)+1; // Get row based on start tile index
  let direction = (piece.pieceColor == "white") ? -1 : 1; // Set up the direction based on piece's color
   
  let step = (piece.pieceMoved === 'false') ? 1 : 0; //(row==2 && piece.pieceColor == "white" || row == 7 && piece.pieceColor == "black") ? 1 : 0; // If pawn never moved before then it can make a double move

  for(let i = 1; i < 2+step; i++){
    let targetTile = piece.board.getTile(startTile+8*i*direction); // Get targeted tile
    let pieceOnTargetTile = targetTile.getPiece; // Get piece on the targeted tile

    if(!pieceOnTargetTile){ // If there's no pieces on the targeted tile then this move is valid
      result.push(targetTile);
    }else{
      break;
    }
    
  }
 
  let captureTiles = [7, 9]; // Pawn can only capture diagonally (excluding en passant but that's too complicated for now)
  for(let i = 0; i < captureTiles.length; i++){
    let targetTile = piece.board.getTile(startTile+direction*captureTiles[i]); // Get targeted tile
    let pieceOnTargetTile = targetTile.getPiece; // Get piece on targeted tile

    if(pieceOnTargetTile && pieceOnTargetTile.pieceColor != piece.pieceColor){ // If there's a piece on targeted tile and it's our enemy then the move is valid
      result.push(targetTile);
    }
 
  }

  return result;
}


const generateValidKingMoves = (piece) => {
  // TOO COMPLICATED FOR NOW, NOT GONNA BOTHER WITH THIS
  let result = []
  let startTile = parseInt(piece.startingIndex)

  let startDirectionIndex = 0;
  let endDirectionIndex = 8;

  for(let directionIndex = startDirectionIndex; directionIndex < endDirectionIndex; directionIndex++){
    for(let n = 0; n < numberOfTilesToEdge[startTile][directionIndex]; n++){
      let targetTile = piece.board.getTile(startTile - directionOffsets[directionIndex] * (n+1))
      let pieceOnTargetTile = targetTile.getPiece;
      if(!pieceOnTargetTile){
        result.push(targetTile)
        break;
      }

      if(piece.pieceColor == pieceOnTargetTile.pieceColor){
        break;
      }
      result.push(targetTile)
      if(piece.pieceColor != pieceOnTargetTile.pieceColor){
        break;
      }
    }
  }

  return result;
}

// Some enums

export const PieceType = {
  "pawn":{
    "innerHTML": `♟︎`,
    'short': 'p',
    'validMoves': generateValidPawnMoves
  },
  "rook":{
    "innerHTML": `♜`,
    'short': 'r',
    'validMoves': generateValidSlidingMoves      
  },
  "knight":{
    "innerHTML": `♞`,
    'short': 'n',
    'validMoves': generateValidKnightMoves
  },
  "bishop":{
    "innerHTML": `♝`,
    'short': 'b',
    'validMoves': generateValidSlidingMoves
  },
  "queen":{
    "innerHTML": `♛`,
    'short': 'q',
    'validMoves': generateValidSlidingMoves
  },
  "king":{
    "innerHTML": `♚`,
    'short': 'k',
    'validMoves': generateValidKingMoves
  }
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

export class ChessGame extends HTMLElement{ // Main class
  get fenNotation(){ // Getter for fenNotation
    return this.getAttribute('fen')  
  }

  set fenNotation(val){ // Setter for fenNotation
    this.setAttribute('fen', val)
  }

  convertPiecesToFen(){ // Function that converts pieces on the board to fen notation
    let fen = ""
    let restOfFen = this.fenNotation.split(" ")
    restOfFen.shift()

    let count = 0

    for(let c = 0; c < 8; c++){
      for(let r = 0; r < 8; r++){
        let tile = this.board.getTile(r+c*8)
        let piece = tile.getPiece
        if(piece){
          if(count > 0){
            fen+=count
          }
          count = 0;

          let pieceType = piece.pieceObject;
          fen += (piece.pieceColor == "black") ? pieceType.short : pieceType.short.toUpperCase()

        }else{
          count++;
        }
        if(r==7){
          if(count > 0){
            fen+=count
          }
          fen+="/"
          count = 0
        }
      }
    }
    this.fenNotation = fen.substring(0, fen.length - 1) + " " + restOfFen.join(" ")

    this.display.innerHTML = `<p>${this.fenNotation}</p>`
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
  }

  connectedCallback(){
    this.board = document.createElement('chess-board');
      
    for(let c = 0; c < 8; c++){
      for(let r = 0; r < 8; r++){
        let tile = document.createElement('chess-tile');

        (c+r)%2 ? tile.setAttribute("color","black") : tile.setAttribute("color","white")
        
        let distance = document.createElement("div")
        distance.classList.add("distance")
        let tilesToEdge = numberOfTilesToEdge[r+c*8]

        let correction = [6,0,4,3,2,5,1,7]

        // 0 1 2 3 4 5 6 7
        // 4 0 6 2 3 7 1 5

        tilesToEdge.forEach((current,index)=>{
          let paragraph = document.createElement("p")
          paragraph.innerHTML = tilesToEdge[correction[index]]
          paragraph.setAttribute("originalIndex", index)
          paragraph.setAttribute("newIndex", correction[index])
          distance.appendChild(paragraph)
          if(index == tilesToEdge.length/2-1){
            let blank = document.createElement("div")
            distance.appendChild(blank)
          }
        }) 

        if(true){
          tile.appendChild(distance)
        }

        if(r==0){tile.setAttribute('top-left-corner', Math.abs((c)-8))}
        if(c==7){tile.setAttribute('bottom-right-corner',alphabet[r])}
        tile.setAttribute('tile-index', r+c*8)
        this.board.appendChild(tile)

      }
    }
    this.appendChild(this.board)
     
    this.convertFenToPieces(this.fenNotation, this.board);
    
    this.display = document.createElement('chess-display');
    this.display.innerHTML = `<p>${this.fenNotation}</p>`

    this.appendChild(this.display)
  }
}

export class ChessTile extends HTMLElement{
  constructor(){
    super();   
    this.game = this.parentElement.parentElement;
    this.board = this.parentElement;
  }
 
  get getPiece(){
    return this.querySelector("chess-piece");
  }
   
  replacePiece(val){
    let piece = this.querySelector("chess-piece") 
    if(piece){
      this.replaceChild(val, piece)
    }
    else{
      this.appendChild(val)
    }
  }

  get tileIndex(){
    return this.getAttribute("tile-index")
  }

  acceptPieceMove(piece){
    if(piece.pieceMoved === 'false'){
      piece.pieceMoved = true;
    }
    this.replacePiece(piece)
  }

  cancelPieceMove(piece){
    this.classList.add("invalid-move");
    this.board.getTile(piece.startingIndex).replacePiece(piece);
    setTimeout(()=>{this.classList.remove("invalid-move")},800)
  }

  movePiece(piece){
    if(Array.from(piece.validMoves).includes(this)){
      if(this.getPiece != null){
        if(this.getPiece.pieceObject != PieceType.king){
          this.acceptPieceMove(piece)
        }else{
          this.cancelPieceMove(piece)
        }
          
      }else{
        this.acceptPieceMove(piece)
      }
    }else{
      this.cancelPieceMove(piece)
    }
  }
  connectedCallback(){

  }
}

export class ChessBoard extends HTMLElement{
  constructor(){
    super();
    this.game = this.parentElement;
  }
  getTile(index){
    return this.querySelector(`[tile-index="${index}"]`);
  }
}

export class ChessPiece extends HTMLElement{
  constructor(){
    super();
    this.game = this.parentElement.parentElement.parentElement;
    this.board = this.parentElement.parentElement;
    this.pieceMoved = false;
  }

  get pieceMoved(){
    return this.getAttribute("moved")
  }

  set pieceMoved(val){
    this.setAttribute("moved", val)
  }

  get pieceColor(){
    return this.getAttribute('color')
  }

  get pieceType(){
    return this.getAttribute('type')
  }

  get pieceObject(){
    return PieceType[this.pieceType]
  }

  connectedCallback(){
    var chesstiles = document.querySelectorAll("chess-tile")
  
    this.addEventListener('mousedown', (e)=>{
      this.classList.add("dragged");
      if(this.parentElement.tagName != "CHESS-TILE"){return false;}
      this.parentElement.classList.add("selected-piece")
      this.startingIndex = this.parentElement.tileIndex;
      console.log(this.parentElement.tagName)

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

      const checkForValidMoves = () => {
        let validMoves = this.pieceObject.validMoves(this);
        chesstiles.forEach((current, index) => {
          if(Array.from(validMoves).includes(current)){
            if(current.getPiece != null){
              if(current.getPiece.pieceObject != PieceType.king){
                current.classList.add("possible-capture")
              }
            }else{
              current.classList.add("possible-move")
            }
          }
        });
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
      this.validMoves = this.pieceObject.validMoves(this);
      checkForValidMoves();
      checkForHoverTiles();

      document.addEventListener('mousemove', mouseMovement)

      this.addEventListener("mouseup", (e)=>{
        document.removeEventListener("mousemove", mouseMovement)
        this.mouseup = null
        this.style = null
        this.classList.remove("dragged")
        this.validMoves.filter(x=>{x.classList.remove('possible-move');})
        Array.from(document.querySelectorAll(".selected-piece")).filter(x=>{x.classList.remove('selected-piece')})
        Array.from(document.querySelectorAll(".possible-capture")).filter(x=>{x.classList.remove('possible-capture')})
        this.hover.movePiece(this);
        this.game.convertPiecesToFen();
      })
    })

    this.innerHTML = this.pieceObject.innerHTML
  }
}

window.customElements.define('chess-game', ChessGame);
window.customElements.define('chess-piece', ChessPiece);
window.customElements.define('chess-tile', ChessTile);
window.customElements.define('chess-board',ChessBoard);
