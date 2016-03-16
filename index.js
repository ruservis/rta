var express = require('express');
var app = express();
var io = require('socket.io')();


app.use(express.static(__dirname + '/public'));

app.get('/customer', function(req, res) {
	res.sendFile(__dirname + '/views/customer.html');
});

app.get('/driver', function(req, res) {
	res.sendFile(__dirname + '/views/drive.html');
});