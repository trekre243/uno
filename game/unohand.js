const UnoCardCollection  = require('./unocardcollection');

module.exports = class UnoHand extends UnoCardCollection {
    constructor() {
        super();
    }

    //draw initial seven cards from deck
    drawSeven(deck) {
        if(!(deck instanceof UnoCardCollection)) {
            throw TypeError('Can only draw from card collection');
        }
        for(let i = 0; i < 7; i++) {
            this.add(deck.draw());
        }
    }

    //remove a specific card by index
    selectCard(index) {
        if(index >= this.cards.length) {
            throw RangeError('Card selection out of range');
        }
        return this.cards.splice(index, 1)[0];
    }

}