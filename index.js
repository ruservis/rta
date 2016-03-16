var express = require('express');
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/customer', function(req, res) {
	res.sendFile(__dirname + '/views/customer.html');
});

app.get('/driver', function(req, res) {
	res.sendFile(__dirname + '/views/drive.html');
});

server.listen(8080, function() {
	console.log('Server started at ' + (new Date().toLocaleString().substr(10, 12)));
});
