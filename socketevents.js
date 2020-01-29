const UnoPlayer = require('./game/unoplayer');

module.exports = (io, unoGame) => {

    io.on('connection', socket => {
        //CLIENT INITIATED EVENTS
        //a new player requests to join the game
        //playerName: string - the name of the new player
        socket.on('newplayer', playerName => {
            unoGame.addPlayer(new UnoPlayer(playerName));
        });

        //a player has selected to make a move
        //move - {type: 'card' or 'draw', card: number}
        socket.on('movemade', (playerName, move) => {
            unoGame.drawDecision(new UnoPlayer(player), move);
        });


        //SERVER INITIATED EVENTS
        //a new player has joined the game
        //player: UnoPlayer - player who joined
        unoGame.on('playerjoined', player => {
            //inform the other players that the player has joined
            io.emit('newplayer', player.playerID)
        });

        //the game has started
        unoGame.on('gamestarted', () => {
            //inform the other players that the game has started
            io.emit('gamestarted');
        });

        //there is a new top card
        //card: UnoCard
        unoGame.on('newtopcard', card => {
            //inform the other users what the new top card is
            io.emit('newtopcard', {name: card.name, color: card.color});
        });

        //a user needs to decide what move to make
        //player: UnoPlayer - the player that needs to move
        unoGame.on('moverequest', player => {
            //inform all the users that a move needs to be made and the respective player that it's their turn
            io.emit('moverequest', player.playerID);
        });

        //the player needs to decide if they want to play the card
        //player: UnoPlayer - the player that needs to decide
        //drawnCard: UnoCard - the card that was drawn
        unoGame.on('drawdecision', (player, drawnCard) => {
            //inform a player that they need to decide if they want to play a card
            io.emit('drawdecision', player.playerID, {name: drawnCard.name, color: drawnCard.color});
        });

        //somebody's turn was skipped
        //playerSkipped: UnoPlayer - the player whose turn was skipped
        unoGame.on('skipturn', playerSkipped => {
            //inform players that somebody's turn was skipped
            io.emit('skipturn', playerSkipped.playerID);
        });

        //the direction of play has changed
        //clockwise: boolean - the direction of play is clockwise
        unoGame.on('reverse', clockwise => {
            //inform the players that the direction of play has changed
            io.emit('reverse', clockwise);
        });

        //inform players that a user must draw cards (draw2, wildd4, etc)
        //player: UnoPlayer - the player that had to draw cards
        //numCards: number - the number of cards that the player had to draw
        unoGame.on('drawcards', (player, numCards) => {
            //inform players that somebody had to draw cards
            io.emit('drawcards', player.playerID, numCards);
        });

        //

    });
};