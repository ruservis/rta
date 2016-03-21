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

map.on('zoomend', _changeLocateMaxZoom);

function _changeLocateMaxZoom(e) {
    if (map._locateOptions) {
        map._locateOptions.maxZoom = map.getZoom();
    }
}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(init);
} else {
	prompt("Geolocation is not supported by this browser.");
}

function init(position) {
	latLong = getLatLong(position);
	mymarker = L.Marker.movingMarker([
        latLong,
        latLong
    ], 0, {        
        autostart: true,
        zoom:15
    }).addTo(map);
	socket.emit('init', {
		isDriver: isDriver,
		latLong: latLong
	});
	id = navigator.geolocation.watchPosition(success, error, options);
}


socket.on('initDriverLoc', function(drivers) {
	
	var myloc=mymarker.getLatLng();
	
var bounds = [[myloc.lat+0.0025,myloc.lng+0.0025],[myloc.lat+0.0025,myloc.lng-0.0025],[myloc.lat-0.0025,myloc.lng+0.0025],[myloc.lat-0.0025,myloc.lng-0.0025]];   
	_.each(drivers, function(driver) {
	
	/*	var rect = L.rectangle([bounds, {color: 'white', weight: 1}]).addTo(map);
	var m=rect.getBounds()
	if(m.contains(driver.latLong))*/
		markers[driver.id] = L.Marker.movingMarker([
			driver.latLong,
			driver.latLong
		], [5000], {
			icon: carIcon,
			autostart: true,
			zoom:15
		}).addTo(map);
	});
});

function check(drivers)
{
		_.each(drivers, function(driver) {
	markers[driver.id] = L.Marker.movingMarker([
			driver.latLong,
			driver.latLong
		], [5000], {
			icon: carIcon,
			autostart: true,
			zoom:15
		}).addTo(map);
	});
}
setInterval(check, 2000)
socket.on('driverLocChanged', function(data){
	
	console.log(data.id)
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