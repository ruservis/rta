var isDriver = false;
var markers = {};
var inited = false;
var socket = io();
var isservice = false;
var send = {};
var key;
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

	socket.emit('initservice', {
		isservice: isservice,
		latLong: latLong
	});
	inited = true;
}

function success(pos) {
	if (!inited)
		init(pos)
	else
		mymarker.moveTo(getLatLong(pos), 5000)
}

function getLatLong(position) {
	return ([position.latitude, position.longitude])
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

socket.on('initservicerLoc', function(drivers) {

	_.each(drivers, function(driver) {

		markers[driver.id] = L.Marker.movingMarker([
			driver.latLong,
			driver.latLong
		], [0], {
			icon: serviceIcon,
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

socket.on('servicemanAdded', function(driver) {
	console.log("New driver joined.")
	markers[driver.id] = L.Marker.movingMarker([
		driver.latLong,
		driver.latLong
	], [0], {
		icon: serviceIcon,
		autostart: true,
		zoom: 15
	}).addTo(map);
});

socket.on('driverRemoved', function(driver) {
	console.log("driver left.")
	map.removeLayer(markers[driver.id])

});

socket.on('serviceRemoved', function(serviceman) {
	console.log("driver left.")
	map.removeLayer(markers[serviceman.id])

});

socket.on('driverLocChanged', function(data) {
	var loc = markers[data.id].getLatLng();
	var angle = setangle(loc.lat, loc.lng, data.latLong[0], data.latLong[1])
	markers[data.id].setIconAngle(angle)
	markers[data.id].moveTo(data.latLong, 5000)
});

socket.on('serviceLocChanged', function(data) {
	var loc = markers[data.id].getLatLng();
	var angle = setangle(loc.lat, loc.lng, data.latLong[0], data.latLong[1])
	markers[data.id].moveTo(data.latLong, 5000)
});

function nearby(data) {
	send[0] = mymarker.getLatLng();
	send[1] = data;
	console.log('send[0]=' + send[0] + 'send[1]=' + send[1])
	socket.emit('book', send);
}

socket.on('bookid', function(id) {

			if (id[0] == 0) {
				confirm("Not available")
			} else {
				var time = L.Routing.control({
					waypoints: [
						L.latLng(mymarker.getLatLng()),
						L.latLng(markers[id[0]].getLatLng())
					]
				});

				if (id[1] == 0)
					confirm('Your Ride has been booked');
				if (id[1] == 1)
					confirm('Your Service has been booked');

				for (key in markers) {
					if (markers[id[0]].getLatLng() != markers[key].getLatLng())
						map.removeLayer(markers[key]);
				}
					setTimeout(function() {
						markers[id[0]].bindPopup(time._routes[0].summary.totalTime + 'Seconds away').openPopup();
					}, 2000);
				}
			});

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