var express = require('express');
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server);

var drivers = {};

app.use(express.static(__dirname + '/public'));

app.get('/customer', function(req, res) {
	res.sendFile(__dirname + '/views/customer.html');
});

app.get('/faker', function(req, res) {
	res.sendFile(__dirname + '/views/faker.html');
});

app.get('/driver', function(req, res) {
	res.sendFile(__dirname + '/views/drive.html');
});

io.on('connection', function(socket) {


	socket.on('init', function(data) {
		if (data.isDriver) {
			drivers[socket.id] = {
				id: socket.id,
				latLong: data.latLong
			};
			console.log("Driver Added at " + socket.id);
			socket.broadcast.to('customers').emit('driverAdded', drivers[socket.id]);
		} else {
			socket.join('customers');
			socket.emit('initDriverLoc', drivers);
		}
	});

	socket.on('locChanged', function(data) {
		drivers[socket.id] = {
			id: socket.id,
			latLong: data.latLong
		}
		/*console.log("Driver " + socket.id + " location changed.");
		console.log("Cords : " + data.latLong);*/
		socket.broadcast.emit('driverLocChanged', {
			id: socket.id,
			latLong: data.latLong
		})
	});

	socket.on('disconnect', function() {
		console.log("Driver disconnected at " + socket.id);
		socket.broadcast.to('customers').emit('driverRemoved', drivers[socket.id]);
		delete drivers[socket.id];
	});

});

server.listen(8080, function() {
	console.log('Server started at ' + (new Date().toLocaleString().substr(10, 12)));
});