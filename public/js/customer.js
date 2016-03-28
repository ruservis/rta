var isDriver = false;
var markers = {};
var inited = false;
var socket = io();

map.locate({
	maxZoom: 15,
	watch: true,
	enableHighAccuracy: true
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
	console.log(position)
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
	var loc = markers[data.id].getLatLng();
	var angle = setangle(loc.lat, loc.lng, data.latLong[0], data.latLong[1])
	markers[data.id].setIconAngle(angle)
	markers[data.id].moveTo(data.latLong, 5000)
})

function success(pos) {
	if (!inited)
		init(pos)
	else {

		mymarker.moveTo(getLatLong(pos), 5000)
	}
}

function error(err) {
	console.log('ERROR ' + err.message);

}

function setangle(slat, slong, dlat, dlong) {

	var y = Math.sin((dlong - slong)) * Math.cos((dlat));
	var x = (Math.cos((slat)) * Math.sin((dlat))) - (Math.sin((slat)) * Math.cos((dlat)) * Math.cos((dlong - slong)));
	angle1 = Math.atan2(y, x);
	angle1 = 180 * angle1 / Math.PI;
	return angle1;
}

function getLatLong(position) {
	return ([position.latitude, position.longitude])
}