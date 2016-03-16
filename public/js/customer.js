var map = L.map('map').setView([12.909022, 77.6376318], 15);

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
var lat = 12.909022,
	long1 = 77.6376318;
var mymarker = L.Marker.movingMarker([
	[lat, long1],
	[lat + 0.5, long1 + 0.5]
], [10000]).addTo(map);


id = navigator.geolocation.watchPosition(success, error, options);

function success(pos) {

	mymarker.moveTo([pos.coords.latitude, pos.coords.longitude], 10)
	L.circle([pos.coords.latitude, pos.coords.longitude], 180).addTo(map);

	mymarker.bindPopup('You are at lat:' + pos.coords.latitude + 'long:' + pos.coords.longitude)
	map.setView([pos.coords.latitude, pos.coords.longitude], 10)


}

function error(err) {
	console.log('ERROR ' + err.message);
}