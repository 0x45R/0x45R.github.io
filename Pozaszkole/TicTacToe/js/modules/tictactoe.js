class TicTacToe extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback(){

  }
}

window.customElements.define('tic-tac-toe', TicTacToe);
