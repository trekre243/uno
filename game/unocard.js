module.exports = class UnoCard {

    constructor(name, color = 'black') {
        //make sure that card is a string
        if(typeof name != 'string' || typeof color != 'string') {
            throw TypeError('Card name and color must be given as a string');
        }
        //make sure that the name of the card is valid
        if(['0','1','2','3','4','5', '6', '7', '8', '9', 'wild', 'wildd4', 'skip', 'draw2', 'reverse'].indexOf(name) == -1) {
            throw RangeError('Invalid card name');
        }
        
        //function to get the card name while keeping private
        this.getName = () => {
            return name;
        };

        this.setColor = newColor => {
            //make sure that the card color is valid
            if(['red', 'yellow', 'green', 'blue', 'black'].indexOf(color) == -1) {
                throw RangeError('Invalid card color');
            }
            color = newColor;
        }

        //assign color 
        this.setColor(color);
        

        //function to get the card color while keeping private
        this.getColor = () => {
            return color;
        }

    }

    //getter for name so that it is immutable
    get name() {
        return this.getName();
    }

    //function for color so that it is immutable
    get color() {
        return  this.getColor();
    }

    //setter for a new color
    set color(newColor) {
        this.setColor(newColor);
    }

    //returns true if action card
    get action() {
        if(['skip', 'draw2', 'reverse'].indexOf(this.name) != -1) {
            return true;
        } else {
            return false;
        }
    }

    //gets the point value of the card
    get pointValue() {
        if(this.name == 'wild' || this.name == 'wildd4') { //wild cards are worth 50
            return 50;
        } else if(this.action) { //action cards are worth 20
            return 20;
        } else { //all other cards are worth their face value
            return Number(this.name);
        }
    }

    //returns true if card passed to function "match"
    match(card) {
        //make sure that card to compare is another uno card
        if(!(card instanceof UnoCard)) {
            throw TypeError('Can only match another uno card')
        }

        //return true if the card's name or color match
        if(card.name == 'wild' || card.name == 'wildd4' || this.name == card.name || this.color == card.color) {
            return true;
        } else {
            return false;
        }
    }
}