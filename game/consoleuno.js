'use strict';

const UnoGame = require('./unogame');
const UnoPlayer = require('./unoplayer');
const readline = require('readline');

const unoGame = new UnoGame();

let topCard;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

unoGame.on('gamestarted', () => {
    console.log('Game has started.');
});

unoGame.on('newtopcard', card => {
    topCard = card;
    console.log('New top card:', `${card.color} ${card.name}`);
});

unoGame.on('moverequest', player => {
    console.log("It's is your turn", player.playerID);
    console.log(`Top card: ${topCard.color} ${topCard.name}`);
    console.log('Your cards:')
    for(let i = 0; i < player.hand.cards.length; i++) {
        console.log(`(${i}) ${player.hand.cards[i].color} ${player.hand.cards[i].name}`);
    }
    console.log(`(${player.hand.cards.length}) Draw new card`);
    rl.question('What is your selection? ', selection => {
        selection = Number(selection);
        if(selection == player.hand.cards.length) {
            unoGame.playerTurn(player, {type: 'draw'});
        } else {
            unoGame.playerTurn(player, {type: 'card', card: selection});
        }
    });
});

unoGame.on('drawdecision', (player, drawnCard) => {
    console.log(`Top card: ${topCard.color} ${topCard.name}`);
    console.log(`You have drawn: ${drawnCard.color} ${drawnCard.name}`);
    rl.question('Do you wish to play the card? (y/n)', selection => {
        if(selection == 'y') {
            unoGame.drawDecision(player, true);
        } else {
            unoGame.drawDecision(player, false);
        }
    });
});

unoGame.on('skipturn', playerSkipped => {
    console.log(`${playerSkipped.playerID}'s turn will be skipped`);
});

unoGame.on('reverse', clockwise => {
    if(clockwise) {
        console.log('Now playing clockwise.');
    } else {
        console.log('Now playing counterclockwise.');
    }
});

unoGame.on('drawcards', (player, numCards) => {
    console.log(`${player.playerID} draws ${numCards} cards`);
});

unoGame.on('deckreset', () => {
    console.log('Deck out of cards. Taking cards from discard pile');
});

unoGame.on('declareuno', player => {
    console.log(`${this.player.playerID} yells UNO!!`);
});

unoGame.on('roundwin', (player, points) => {
    console.log(`${player.playerID} has the round and earned ${points} points!`);
});

unoGame.on('gamewin', player => {
    console.log(`${player.playerID} has won the game.`);
});

unoGame.on('newround', () => {
    console.log('A new round has begun.');
});

unoGame.on('insufficientplayers', numPlayers => {
    console.log(`There is only ${numPlayers} player.`);
});

unoGame.on('toomanyplayers', () => {
    console.log('Too many players! Maximum number of players is four.');
});

unoGame.on('addplayertostartedgame', () => {
    console.log('Attempted to add players to a game that has already started.');
});

unoGame.on('invalidcardselection', (player, selectedCard) => {
    console.log(`${player.playerID} attempted to use a ${selectedCard.color} ${selectedCard.name}`);
    console.log('This is an invalid selection');
    console.log(`The current top card is ${topCard.color} ${topCard.name}`);

});

unoGame.on('playerjoined', player => {
    console.log(`${player.playerID} has joined the game.`)
});

unoGame.on('selectwildcolor', player => {
    console.log('The first card is a wild');
    console.log(`${player.playerID} must select first card to play`)
    for(let i = 0; i < player.hand.cards.length; i++) {
        let card = players.hand.cards[i];
        console.log(`${i} ${card.color} ${card.name}`);
    }
    rl.question(`Which card do you want to play?`, selection => {
        unoGame.wildSelection(player, selection);
    });
});

unoGame.on('firstcardcolorselected', (player, selectedCard) => {
    console.log(`${player.playerID} has chosen the first card color to be ${selectedCard.color}`);
    console.log(`${player.playerID} is playing a ${selectedCard.color} ${selectedCard.name}`);
});

unoGame.addPlayer(new UnoPlayer('Trevor'), new UnoPlayer('Steve'), new UnoPlayer('Jon'));

unoGame.begin();