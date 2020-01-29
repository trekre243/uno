const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const UnoGame = require('./game/unogame');

app.use(express.static(__dirname + '/public/dist/public'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//an instance of the actual uno game
const unoGame = new UnoGame();

require('./socketevents')(io, unoGame);




server.listen(8000, () => console.log('Server started on port 8000'));