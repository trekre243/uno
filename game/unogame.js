const UnoPlayer = require('./unoplayer');
const UnoDeck = require('./unodeck');
const UnoHand = require('./unohand');
const UnoCardCollection = require('./unocardcollection')
const EventEmitter = require('events');

module.exports = class UnoGame extends EventEmitter {

    players = []; //the players that are in this particular game
    gameStarted = false; //has the game begun
    playerTurnI = 0; //the index of the player whose turn it is
    deck; //the cards of the deck
    discardPile; //the pile of cards that have already been used
    playCW = true; //the current order of play. true = clockwise
    drawnCard; //the card that was drawn and awaits a player decision as to play
    skipNextTurn = false; //used if a skip/draw2 card begins the begin to skip second player
    nextDraw2 = false; //used to draw2 for next player if draw2 card is first discard

    constructor() {
        super();
    }

    //add new player(s) to the game if not already started
    addPlayer(...players) {
        if(this.gameStarted == true) { //make sure that the game hasn't already started before adding players
            this.emit('addplayertostartedgame');
            return;
        }

        //make sure that not more than four players joins the game
        if(this.players.length + players.length > 4) {
            this.emit('toomanyplayers');
            return;
        }

        for(let player of players) {
            if(!(player instanceof UnoPlayer)) {
                throw TypeError('Player must be an instance of UnoPlayer');
            } 
            this.players.push(player); //add player to game
            this.emit('playerjoined', player); //emit that a new player has joined the game
        }
    }

    //draws cards to players
    begin() {
        //make sure that there are enough players to begin
        if(this.players.length < 2) {
            this.emit('insufficientplayers', this.players.length);
            return;
        }

        //mark game as having started
        this.gameStarted = true;

        //inform players that the game has begun
        this.emit('gamestarted');

        //begin new round
        this.newRound();

    }

    //start a new round
    newRound() {
        this.emit('newround'); //emit that a new round is beginning

        this.deck = new UnoDeck(); //create a new deck to begin play

        for(let player of this.players) {
            player.hand = new UnoHand(); //reset everybody's hands
            player.hand.drawSeven(this.deck); //draw seven cards\
        }

        this.playerTurnI = 0; //reset the player iterator

        this.discardPile = new UnoCardCollection(); //make new discard pile

        //if the first discard card is a wild draw 4 return and pick again
        let topCard = this.deck.draw();
        while(topCard.name == 'wildd4') {
            this.deck.add(topCard);
            this.deck.shuffle();
            topCard = this.deck.draw();
        }
        this.discardPile.add(this.deck.draw()); //draw new top card
        this.emit('newtopcard', this.discardPile.top); //emit new top card

        this.firstDiscard(this.discardPile.top); //handle logic associated with first discard card

        //inform the first player that they need to make a move
        this.emit('moverequest', this.players[this.playerTurnI]);
        
    }

    //handle logic associtated with wild and action cards
    firstDiscard(card) {
        switch(card.name) {
            //if the first discard card is a skip then mark that the following turn needs to be skipped
            case 'skip':
                this.skipNextTurn = true;
                break;
            //if the first card is a reverse then reverse direction of play
            case 'reverse':
                this.reverseDirection(); //reverse the direction of play
                break;
            case 'draw2':
                this.skipNextTurn = true;
                this.nextDraw2 = true;
                break;
            //if the first card is a wild then then the player to the dealers left declares the first color and plays a card
            case 'wild':
                this.emit('selectwildcolor', this.players[1]);
        }
    }

    //process selection the first card
    wildSelection(player, cardIndex) {
        let selectedCard = player.hand.selectCard(cardIndex); //grab selected card
        this.emit('firstcardcolorselected', player, selectedCard); //emit that the user has selected a card
        this.discardPile.add(selectedCard); //add card to discard pile
        this.emit('moverequest', this.players[0]); //begin game with first player
    }

    //use cards from discard pile to form new deck
    resetDeck() {
        const topCard = this.discardPile.draw(); //take top card off discard pile
        this.deck = new UnoDeck(this.discardPile); //use the remaining cards from the discard pile to form new deck
        this.discardPile = new UnoCardCollection(); //make new discard pile
        this.discardPile.add(topCard); //add the top card back on the new discard pile
    }

    //respond to the players selections
    playerTurn(player, move) { // move: {type: "draw", card: index}
        //make sure that the player trying to go is the player whose turn it is
        if(this.players[this.playerTurnI].playerID == player.playerID) {
            //if the player wishes to draw a card
            if(move.type == 'draw') {
                this.drawnCard = this.deck.draw(); //draw a card from the deck
                if(this.deck.cards.length == 0) { //check to see if deck is out of cards
                    this.emit('deckreset'); //the deck is out of cards
                    this.resetDeck(); //deck empty so using cards in discard pile
                }

                this.emit('drawdecision', player, this.drawnCard);  //inform player they need to decide if they want to play card
            } else if(move.type == 'card') { //if the player wishes to play a card
                const selectedCard = player.hand.selectCard(move.card); //take selected card from player's hand

                if(!this.discardPile.top.match(selectedCard)) {
                    player.hand.add(selectedCard); //return selected card to player's hand
                    this.emit('invalidcardselection', player, selectedCard); //emit that the user has selected an invalid card
                    this.emit('moverequest', player); //request player make a new move
                    return;
                }

                if(player.hand.cards.length == 1) {
                    this.emit('declareuno', player); //declare uno if a player only has one card
                } else if(player.hand.cards.length == 0) {
                    const pointsWon = this.calcPoints(selectedCard); //calculate points won in round
                    this.emit('roundwin', player, pointsWon); //player has won the round
                    player.points += pointsWon; //add points to player total
                    if(player.points >= 500) { //check to see if player has won the game
                        this.emit('gamewin', player);
                        return;
                    }
                    this.newround(); //begin a new round
                    return;
                }

                let cardsToDraw = 0; //used to determine how many cards to add to next player
                switch(selectedCard.name) {
                    case 'skip': //playing skip card
                        this.incTurn(); //increment to the skipped player
                        this.emit('skipturn', this.players[this.playerTurnI]); //emit skip event
                        break;
                    case 'reverse': //playing a reverse card
                        this.reverseDirection(); //reverse play direction
                        break;
                    case 'draw2': //playing a draw two card
                        cardsToDraw = 2; //next player draws two cards
                        break;
                    case 'wild': //playing a wild card
                        selectedCard.color = this.discardPile.top.color; //set the color for the wild card
                        break;
                    case 'wildd4': //playing a draw 4 wild card
                        cardsToDraw = 4; //next player draws 4 cards
                        selectedCard.color = this.discardPile.top.color; //set the color for the wild card
                }
                
                this.discardPile.add(selectedCard); //add card to discard pile
                this.emit('newtopcard', selectedCard); //emit new top card event

                this.incTurn(); //move to next player

                //player draws however many cards required
                if(cardsToDraw != 0) {
                    for(let i = 0; i < cardsToDraw; i++) {
                        this.players[this.playerTurnI].hand.add(this.deck.draw());
                    }
                    this.emit('drawcards', player, cardsToDraw); //emit draw cards event
                }

                //if the first card was a draw 2 then player left of dealer draws 2 cards
                //no risk of deck reset as only occurs at beginning of play
                if(this.nextDraw2) {
                    this.nextDraw2 = false;
                    this.players[this.playerTurnI].hand.add(this.deck.draw());
                    this.players[this.playerTurnI].hand.add(this.deck.draw());
                }

                //if the first discard was a skip then skip turn of player after dealer
                if(this.skipNextTurn) {
                    this.skipNextTurn = false;
                    this.emit('skipturn', this.players[this.playerTurnI]);
                    this.incTurn();
                }

                this.emit('moverequest', this.players[this.playerTurnI]); //alert next player it's their turn
            }
        }
    }

    //reverse play direction
    reverseDirection() {
        if(this.players.length == 2) {
            this.incTurn(); //a reverse card in a two player game skips other player's turn
            this.emit('skipturn', this.players[this.playerTurnI]); //emit skipping next player turn
        } else {
            this.playCW = !this.playCW; //reverse play direction
            this.emit('reverse', this.playCW); //emit reversed event
        }
    }

    //handle the decision of the user about if they want to play the card
    drawDecision(player, playCard) {
        //make sure it is the correct player
        if(this.players[this.playerTurnI].playerID == player.playerID) {

            player.hand.add(this.drawnCard); //add card to deck

            //the user wants to play the card
            if(playCard) {
                this.playerTurn(player, {type: 'card', card: player.hand.cards.length - 1}); //play drawn card
            } else { //the user doesn't want to play the card
                this.players[this.playerTurnI].hand.add(this.drawnCard); //add drawn card to player's hand
                this.incTurn(); //move to the next player's turn
                this.emit('moverequest', this.players[this.playerTurnI]); //tell next player it's their turn
            }
        }
    }

    //increment the players turn
    incTurn() {
        if(this.playCW == true) {
            this.playerTurnI += 1;
            if(this.playerTurnI == this.players.length) { //loop to beginning of players array
                this.playerTurnI = 0;
            }
        } else {
            this.playerTurnI -= 1;
            if(this.playerTurnI == -1) {
                this.playerTurnI = this.players.length - 1; //loop to end of players array
            }
        }
    }

    //calculate the number of points won in the round
    calcPoints(lastCard) {
        let totalPoints = 0;
        //add up the total points of all the players
        for(let player of this.players) {
            for(let card of player.hand.cards) {
                totalPoints += card.pointValue;
            }
        }

        //add up any points from playing a draw card last
        if(lastCard.name == 'draw2' || lastCard.name == 'wildd4') {
            //determine number of cards to draw
            let numCards = 0;
            if(lastCard.name == 'draw2') {
                numCards = 2;
            } else {
                numCards = 4;
            }

            //add points from drawn cards
            for(let i = 0; i < numCards; i++) {
                totalPoints = this.deck.draw().pointValue; //add points from card
                if(this.deck.cards.length == 0) { //check if deck out of cards
                    this.resetDeck(); //if out of cards we need to reset the deck
                }
            }
        }

        return totalPoints; //send back summed point total
    }

}