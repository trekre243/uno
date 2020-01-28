const UnoCard = require('./unocard');
const shuffler = require('shuffle-array');

module.exports = class UnoCardCollection {

    cards = [];

    constructor() {

    }

    //place a card on top of the collection
    add(card) {
        //make sure that type being added is a card
        if(!(card instanceof UnoCard)) {
            throw TypeError('Only Uno card may be added to deck');
        }

        this.cards.push(card);
    }

    //draw a card from the top of the deck
    draw() {
        if(this.cards.length != 0) {
            return this.cards.pop();
        }
    }

    //shuffle the deck
    shuffle() {
        shuffler(this.cards);
    }

    ///show the top card
    get top() {
        return this.cards[this.cards.length - 1];
    }
}