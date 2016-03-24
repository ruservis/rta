var isDriver = false;
var markers = {};
var inited = false;
var socket = io();

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
	
	console.log('lat1'+loc.lat+'lng2='+loc.lng)
	console.log('lat='+data.latLong[0]+'lng='+data.latLong[1])
	console.log('angle='+angle)
	markers[data.id].setIconAngle(angle,{rotationOrigin:'bottom center'})
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

	var y = Math.sin(e(dlong - slong)) * Math.cos(e(dlat));
	var x = (Math.cos(e(slat)) * Math.sin(e(dlat)))- (Math.sin(e(slat)) * Math.cos(e(dlat)) * Math.cos(e(dlong - slong)));
	angle1 = Math.atan2(y, x);
	angle1 = 180*angle1/Math.PI;
	return angle1;
}
function e(a) {
        return (a * (Math.PI / 180));
    }

function getLatLong(position) {
	return ([position.latitude, position.longitude])
}