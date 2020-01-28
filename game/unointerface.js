module.exports = unoGame => {
    //called whenever the game has started
    unoGame.on('gamestarted', () => {

    });

    //called whenever a new top card is placed in the discard pile
    //card: UnoCard - the card that was added to the discard pile
    unoGame.on('newtopcard', card => {

    });

    //called whenever a player needs to decide if they want to play a card or draw
    //player: UnoPlayer - the player that needs to make a move selection
    //action required - needs to call unoGame.playerturn(player, {type: 'card' (card or draw), card: 1 (index of card in hand user wishes to play)})
    unoGame.on('moverequest', player => {
        
    });

    //called whenever the user responds to a move request with 'draw'. The drawn card is passed to the function so that the
    //user can decide if they want to play it or not
    //player: UnoPlayer - they player that needs to decide if they want to play the drawn card
    //card: UnoCard - the card that the user needs to decide if they want to play
    //action required - needs to call the unoGame.drawDecision(player (current player), decision (play drawn card or not)) function
    unoGame.on('drawdecision', (player, card) => {
        
    });

    //called whenever a players turn is skipped from a skip card or a reverse with two people
    //player: UnoPlayer - the player whose turn is skipped
    unoGame.on('skipturn', player => {

    });

    //called whenever the direction of play is reversed
    //clockwise: boolean - is the direction of place clockwise
    unoGame.on('reverse', clockwise => {

    });

    //called whenever a player needs to draw cards from a draw2 or wild draw 4
    //player: UnoPlayer - the player that must draw cards
    //numCards: number - the number of cards they must draw
    unoGame.on('drawcards', (player, numCards) => {

    });

    //called whenever all the cards are drawn from the deck the discard pile used
    unoGame.on('deckreset', () => {

    });


    //called whenever a player only has one card remaining
    //player: UnoPlayer - the player that with one card remaining
    unoGame.on('declareuno', player => {

    });

    //called whenever somebody wins a round
    //player: UnoPlayer - the player that won the round
    //points: number - the number of points they won that round
    unoGame.on('roundwin', (player, points) => {

    });

    //called whenever somebody wins the game
    //player: UnoPlayer - the player that won the game
    unoGame.on('gamewin', player => {

    });

    //called at the start of every new round
    unoGame.on('newround', () => {

    });

    //called whenever somebody tries to start the game with fewer than two players
    //numPlayers: number - the number of players currently in the game
    unoGame.on('insufficientplayers', numPlayers => {

    });

    //called whenever somebody tries to add more than four people to the game
    unoGame.on('toomanyplayers', () => {

    });

    //called whenever somebody tries to add a player to a game that has already begun
    unoGame.on('addplayertostartedgame', () => {

    });

    //called whenver somebody tries to play a card that does not match the top discard card
    //player: UnoPlayer - the player attempting the invalid move
    //selectedCard: UnoCard - the card the player attempted to play
    //action required: none - the selected card is already returned to their hand
    unoGame.on('invalidcardselection', (player, selectedCard) => {

    });

    //called whenever a new player joins the game
    //player: UnoPlayer - the player who joined the game
    unoGame.on('playerjoined', player => {

    });

    //called whenver a game begins with a wild card as the first discard card and player left of the dealer needs
    //to pick a card they want to play
    //player: UnoPlayer - the player the needs to pick a card to play
    //action required: unoGame.wildSelection(player, selection (index of card to play in hand))
    unoGame.on('selectwildcolor', player => {

    });

    //called when the player left of the dealer has selected the color of the wild card and played a card
    //player: UnoPlayer - the player that has selected the first card color
    //selectedCard: UnoCard - the card that player has played on the wild card
    unoGame.on('firstcardcolorselected', (player, selectedCard) => {

    });

}