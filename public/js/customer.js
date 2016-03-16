var map = L.map('map');
var socket = io();
var isDriver = false;
var markers = {};
var mymarker;

L.tileLayer('https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 20
}).addTo(map);

map.locate({
	setView: true,
	maxZoom: 18,
	watch: true,
	enableHighAccuracy: true,
});

var options = {
	enableHighAccuracy: true,
	timeout: 2000,
	maximumAge: 0,

};

var carIcon = L.icon({
    iconUrl: "/images/mycar.png",
    iconSize: [30, 30]
});

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(init);
} else {
	alert("Geolocation is not supported by this browser.");
}

function init(position) {
	latLong = getLatLong(position);
	mymarker = L.Marker.movingMarker([
        latLong,
        latLong
    ], [500], {        
        autostart: true
    }).addTo(map);
	socket.emit('init', {
		isDriver: isDriver,
		latLong: latLong
	});
	id = navigator.geolocation.watchPosition(success, error, options);
}

socket.on('initDriverLoc', function(drivers) {
	console.log(JSON.stringify(drivers, 3));
	var myloc=mymarker.getLatLng();
	
var bounds = [[myloc.lat+0.0025,myloc.lng+0.0025],[myloc.lat+0.0025,myloc.lng-0.0025],[myloc.lat-0.0025,myloc.lng+0.0025],[myloc.lat-0.0025,myloc.lng-0.0025]];   
	_.each(drivers, function(driver) {
		console.log(JSON.stringify(driver, 3))

	
	var rect = L.rectangle([bounds, {color: 'yellow', weight: 10}]).addTo(map);
	var m=rect.getBounds()
	if(m.contains(driver.latLong))
		markers[driver.id] = L.Marker.movingMarker([
			driver.latLong,
			driver.latLong
		], [500], {
			icon: carIcon,
			autostart: true
		}).addTo(map);
	});
});

socket.on('driverLocChanged', function(data){
	markers[data.id].moveTo(data.latLong, 1000)
})

function success(pos) {

	map.setView([pos.coords.latitude, pos.coords.longitude], 15)
	mymarker.moveTo([pos.coords.latitude, pos.coords.longitude], 10)
	mymarker.bindPopup('You are at lat:' + pos.coords.latitude + 'long:' + pos.coords.longitude)
}

function error(err) {
	console.log('ERROR ' + err.message);
}

function getLatLong(position) {
    return ([position.coords.latitude, position.coords.longitude])
}