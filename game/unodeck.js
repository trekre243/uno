const UnoCard = require('./unocard');
const UnoCardCollection = require('./unocardcollection');

module.exports = class UnoDeck extends UnoCardCollection {

    cards = [];

    constructor(inCards = null) {
        super();
        if(inCards) {
            if(!(inCards instanceof UnoCardCollection)) { //check type
                throw TypeError('A deck may only be created with an instance of UnoCardCollection');
            }
            this.cards = inCards.cards; //use the cards array from passed in card collection
        } else {
            this.reset(); //fill deck with all cards
        }
        //shuffle the deck
        this.shuffle();
    }

    //fill deck with all the uno cards
    reset() {
        //add the four wild and draw 4 wild cards to the deck
        for(let i = 0; i < 4; i++) {
            this.add(new UnoCard('wild'));
            this.add(new UnoCard('wildd4'));
        }

        //add one 0 and two of 1 - 9 for each color and action cards
        for(let color of ['red', 'yellow', 'green', 'blue']) {
            for(let i = 0; i < 2; i++) {
                this.add(new UnoCard('skip', color));
                this.add(new UnoCard('draw2', color));
                this.add(new UnoCard('reverse', color));
            }

            this.add(new UnoCard('0', color));

            for(let name = 1; name <= 9; name++) {
                this.add(new UnoCard(name.toString(), color));
                this.add(new UnoCard(name.toString(), color));
            }
        }

    }

}