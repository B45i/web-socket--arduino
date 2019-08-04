const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
	res.sendfile('index.html');
});


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

http.listen(port, function () {
	console.log(`listening on: ${port}`);
})