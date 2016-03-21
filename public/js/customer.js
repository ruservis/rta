var map = L.map('map');
var socket = io();
var isDriver = false;
var markers = {};
var mymarker;
if ("geolocation" in navigator) {
	console.log('locfound');
} else {
	prompt('Allow location access')
}
L.tileLayer('https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 20
}).addTo(map);

map.locate({
	setView: true,
	maxZoom: 15,
	watch: true,
	enableHighAccuracy: true
});

var options = {
	enableHighAccuracy: false,
	timeout: 10000,
	maximumAge: 1000,

};

var carIcon = L.icon({
	iconUrl: "/images/mycar.png",
	iconSize: [30, 30]
});

var clientIcon = L.icon({
	iconUrl: "/images/marker2.png",
	iconSize: [15, 15]
});
map.on('zoomend', _changeLocateMaxZoom);

function _changeLocateMaxZoom(e) {
	if (map._locateOptions) {
		map._locateOptions.maxZoom = map.getZoom();
	}
}


navigator.geolocation.getCurrentPosition(init);


function init(position) {
	latLong = getLatLong(position);
	mymarker = L.Marker.movingMarker([
		latLong,
		latLong
	], 0, {
		autostart: true,
		zoom: 15,
		icon:clientIcon
	}).addTo(map);

	var circle = L.circle([position.lat, position.lng], 50, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(map);
	socket.emit('init', {
		isDriver: isDriver,
		latLong: latLong
	});
	id = navigator.geolocation.watchPosition(success, error, options);
}


socket.on('initDriverLoc', function(drivers) {

	_.each(drivers, function(driver) {

		markers[driver.id] = L.Marker.movingMarker([
			driver.latLong,
			driver.latLong
		], [5000], {
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
	], [5000], {
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

	markers[data.id].moveTo(data.latLong, 1000)
})

function success(pos) {

	//map.setView([pos.coords.latitude, pos.coords.longitude], 15)
	mymarker.moveTo([pos.coords.latitude, pos.coords.longitude], 10000)
}

function error(err) {
	console.log('ERROR ' + err.message);
}

function getLatLong(position) {
	return ([position.coords.latitude, position.coords.longitude])
}