const express = require('express');
const socket = require('socket.io');

const app = express();

const port = process.env.PORT || 3000;
app.use(express.static('public'));


const server = app.listen(port, function () {
	console.log(`listening on: ${port}`);
})

const io = socket(server);
let clients = 0;
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
	clients++;
	socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
	io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});

	// Send a message to client after a timeout of 4seconds
	setTimeout(function () {	
		socket.send('Sent a message 4seconds after connection!');
	}, 4000);

	
	socket.on('clientEvent', function(data) {
		console.log(data);
	 });

	//Whenever someone disconnects this piece of code executed
	socket.on('disconnect', function () {
		clients--;
		io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
	 });
});
