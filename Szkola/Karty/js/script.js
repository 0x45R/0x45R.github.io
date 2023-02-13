import { Card, Rank, Suit } from "./modules/cards.js";


let bad_card = new Card(Rank.Numeric, Suit.Tile,2)
document.body.appendChild(bad_card.DOM_object)

let good_card = new Card(Rank.Numeric, Suit.Tile,9)
document.body.appendChild(good_card.DOM_object)


let jack_card = new Card(Rank.Jack, Suit.Spade)
document.body.appendChild(jack_card.DOM_object)

let queen_card = new Card(Rank.Queen, Suit.Club)
document.body.appendChild(queen_card.DOM_object)

let king_card = new Card(Rank.King, Suit.Tile)
document.body.appendChild(king_card.DOM_object)

let ace_card = new Card(Rank.Ace, Suit.Heart)
document.body.appendChild(ace_card.DOM_object)

let joker_card = new Card(Rank.Joker, Suit.Spade)
document.body.appendChild(joker_card.DOM_object)


