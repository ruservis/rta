var map = L.map('map');
var socket = io();
var isDriver = false;
var markers = {};
var mymarker;
var inited = false;


if ("geolocation" in navigator) {
	console.log('Location found');
} else {
	prompt('Allow location access')
}
L.tileLayer('https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 20,
	minZoom: 5,
	worldCopyJump: false
}).addTo(map);

L.easyButton('fa-location-arrow', function(btn, map) {
	map.setView(mymarker.getLatLng(), 15)
}).addTo(map);

var carIcon = L.icon({
	iconUrl: "/images/mycar.png",
	iconSize: [30, 30]
});

var clientIcon = L.icon({
	iconUrl: "/images/client.png",
	iconSize: [15, 15]
});

map.locate({
	maxZoom: 15,
	watch: true,

});


map.on('locationfound', success);
map.on('zoomend', _changeLocateMaxZoom);

function _changeLocateMaxZoom(e) {
	if (map._locateOptions) {
		map._locateOptions.maxZoom = map.getZoom();
	}
}

function init(position) {
	latLong = getLatLong(position);
	map.setView(latLong, 15);
	mymarker = L.Marker.movingMarker([
		latLong,
		latLong
	], 0, {
		autostart: true,
		zoom: 15,
		icon: clientIcon
	}).addTo(map);

	socket.emit('init', {
		isDriver: isDriver,
		latLong: latLong
	});
	inited = true;
}

socket.on('initDriverLoc', function(drivers) {

	_.each(drivers, function(driver) {

		markers[driver.id] = L.Marker.movingMarker([
			driver.latLong,
			driver.latLong
		], [0], {
			icon: carIcon,
			autostart: true,
			zoom: 15
		}).addTo(map);
	});
});

socket.on('driverAdded', function(driver) {
	console.log("New driver joined.")
	markers[driver.id] = L.Marker.movingMarker([
		driver.latLong,
		driver.latLong
	], [0], {
		icon: carIcon,
		autostart: true,
		zoom: 15
	}).addTo(map);
});

socket.on('driverRemoved', function(driver) {
	console.log("driver left.")
	map.removeLayer(markers[driver.id])

});

socket.on('driverLocChanged', function(data) {
	var loc = mymarker.getLatLng();
	var angle = setangle(loc.lat, loc.lng, data.latLong[0], data.latLong[1])
	markers[data.id].setIconAngle(angle)
	markers[data.id].moveTo(data.latLong, 5000)
})

function success(pos) {
	if (!inited)
		init(pos)
	else {

		mymarker.moveTo(getLatLong(pos), 10000)
		console.log('here')
	}
}

function error(err) {
	console.log('ERROR ' + err.message);

}

function setangle(slat, slong, dlat, dlong) {

	var dLon = (dlong - slong);
	var y = Math.sin(dLon) * Math.cos(dlat);
	var x = Math.cos(slat) * Math.sin(dlat) - Math.sin(slat) * Math.cos(dlat) * Math.cos(dLon);
	angle1 = Math.atan2(y, x);
	angle1 = (180 * angle1) / 3.1454;
	angle1 = (angle1 + 360) % 360;
	return angle1;
}

function getLatLong(position) {
	return ([position.latitude, position.longitude])
}