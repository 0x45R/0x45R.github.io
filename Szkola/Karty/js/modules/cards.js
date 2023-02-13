export const Suit = {
  "Club":{
    "symbol": '♣',
    "color": "black"
  },
  "Spade":{
    "symbol": '♠',
    "color": "black",
  },
  "Tile":{
    "symbol": "♦",
    "color": "red"
  },
  "Heart":{
    "symbol":"♥", 
    "color": "red"
  }
}

export const Rank = {
  "Joker":{
    "symbol": "✪",
    "center":"🃏",
    "custom_indicator": '{0}',
    "price": 15
  },
  "Ace": {
    "symbol": "A",
    "center": "🔥",
    "price": 14
  },
  "King":{
    "symbol": "K",
    "center": "🤴",
    "price": 13
  },
  "Queen": {
    "symbol":"Q",
    "center": "👸",
    "price": 12
  },
  "Jack":{
    "symbol": "J",
    "center": "👨",
    "price": 11
  },
  "Numeric":{
    "symbol": "{0}",
    "center": "<p>{0}</p>",
  },
}

String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] == 'undefined' ? match : args[index];
  });
};

export class Card{
  constructor(rank, suit, value = 1){
    this.rank = rank
    this.suit = suit
    this.value = value

    if(this.rank == Rank.Numeric){
      this.price = this.value
    }
    else{
      this.price = this.rank.price
    }

    this.DOM_object = document.createElement('div')
    this.DOM_object.classList.add('card-container')

    this.DOM_object.style.color = this.suit.color

    this.update()

    this.DOM_object.addEventListener('click', ()=>{this.changeAndAnimate(1);});
    this.DOM_object.addEventListener('contextmenu', (ev)=>{ev.preventDefault();this.changeAndAnimate(-1); return false;})
  }

  updateDOM(){
    this.DOM_object.innerHTML = `
      <div class="card-top-left-indicator">
        ${this.indicator}
      </div>
      <div class="card-center-indicator">
        ${this.rank.center.format(this.suit.symbol).repeat(this.value)}
      </div>
      <div class="card-bottom-right-indicator">
        ${this.indicator}
      </div>
    `
  }

  updateAttributes(){
    this.price = Math.min(Math.max(this.price, 2), 15)
    Object.keys(Rank).forEach(key=>{
        if(this.price > 10){
          if(this.price == Rank[key].price ){
            this.rank = Rank[key]
            this.value = 1
          }
        }else{
          this.value = this.price
          this.rank = Rank.Numeric
        }
    })

    this.default_indicator = `
      <p class="card-rank">${this.rank.symbol.format(this.value)}</p>
      <p class="card-suit">${this.suit.symbol}</p>
    `

    if(!this.rank.custom_indicator){
      this.indicator = this.default_indicator
    }
    else{
      this.indicator = this.rank.custom_indicator.format(this.rank.symbol)
    }
  }

  update(){
    this.updateAttributes()
    this.updateDOM()
  }
  changeAndAnimate(direction){
    this.price = this.price + direction;
    if(this.price > 2 && this.price < 16){
      this.DOM_object.animate(
        [
          {transform: `rotate3d(0,0,0,0deg)`},
          {transform: `rotate3d(0,1,0,${90*direction}deg)`},       
          {transform: `rotate3d(0,0,0,0deg)`},
        ],
        {
          duration: 500,
          delay: 0,
        }
      )
    }
    setTimeout(()=>{this.update()}, 250)
  }
};
