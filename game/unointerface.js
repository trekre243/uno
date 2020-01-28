module.exports = unoGame => {
    //game has started
    unoGame.on('gamestarted', () => {

    });

    //it is a players turn to play
    unoGame.on('moverequest', player => {
        //needs to call playerTurn function to make move
    });

    //player needs to decide if they want to play card
    unoGame.on('drawdecision', (player, card) => {
        //needs to call drawDecision function to make move
    });
}