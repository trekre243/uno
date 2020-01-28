const UnoHand = require('./unohand');

module.exports = class UnoPlayer {

    constructor(playerID) {
        this.hand = new UnoHand(); //the players cards
        this.points = 0; //the player's points

        //returns player id
        this.getPlayerID = () => {
            return playerID;
        }
    }

    //getter for playerID
    get playerID() {
        return this.getPlayerID();
    }
}