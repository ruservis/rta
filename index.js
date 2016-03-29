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

app.get('/serviceman', function(req, res) {
	res.sendFile(__dirname + '/views/serviceman.html');
});

io.on('connection', function(socket) {

	socket.on('init', function(data) {
		if (data.isDriver) {
			drivers[socket.id] = {
				id: socket.id,
				latLong: data.latLong

			};
			socket.isDriver = data.isDriver;
			console.log("Driver Added at " + socket.id);
			socket.broadcast.to('customers').emit('driverAdded', drivers[socket.id]);
		} else {
			socket.join('customers');
			socket.emit('initDriverLoc', drivers);

		}
	});

	socket.on('bookride', function(mymarker) {
		var near = 0,length, nr = 0;
		var at, id, key;
		at = Object.keys(drivers);
		length = Object.keys(drivers).length;
		id = at[0];
		var lat1 = mymarker.lat;
		var long1 = mymarker.lng;
		var lat2, long2;
		if (length == 0)
			id = 0;
		else if (length == 1) {
			id = at[0];
		} else {
			for (key in at) {
				console.log('id=' + at[key])
				lat2 = drivers[at[key]].latLong[0]
				long2 = drivers[at[key]].latLong[1]
				nr = distance(lat1, long1, lat2, long2);

				if (nr < near) {
					near = nr;
					id = key;
				}
			}
		}
		socket.emit('carid', id);
	});

	socket.on('locChanged', function(data) {
		drivers[socket.id] = {
			id: socket.id,
			latLong: data.latLong
		}

		socket.broadcast.emit('driverLocChanged', {
			id: socket.id,
			latLong: data.latLong
		})
	});

	socket.on('disconnect', function() {
		if (socket.isDriver) {
			console.log("Driver disconnected at " + socket.id);
			socket.broadcast.to('customers').emit('driverRemoved', drivers[socket.id]);
			delete drivers[socket.id];
		} else {
			console.log('Customer Disconnected at' + socket.id);
		}
	});
});

function distance(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2;

	return 12742 * Math.asin(Math.sqrt(a));
}

server.listen(8080, function() {
	console.log('Server started at ' + (new Date().toLocaleString().substr(10, 12)));
});