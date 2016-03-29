var map=L.map('map')
var mymarker;

if ("geolocation" in navigator) {
	console.log('Location found');
} else {
	prompt('Allow location access')
}

L.tileLayer('https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile', {
	attribution: 'Map data &copy; <a href="https://maps.google.com">Google</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
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

var serviceIcon = L.icon({
	iconUrl: "/images/shape.png",
	iconSize: [30, 30]
});



