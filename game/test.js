const UnoCard = require('./unocard');

const cards = [
    new UnoCard('wildd4'),
    new UnoCard('wild'),
    new UnoCard('skip', 'red'),
    new UnoCard('reverse', 'yellow'),
    new UnoCard('draw2', 'blue'),
    new UnoCard('5', 'red')
];


for(let card of cards) {
    console.log(`${card.color} ${card.name} ${card.pointValue}`);
}
