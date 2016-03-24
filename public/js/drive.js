var socket = io();
var isDriver = true;
var faker = false;
var inited = false;

map.locate({
    maxZoom: 15,
    watch: true,

});

map.on('locationfound', success);
map.on('click', onMapClick)
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
        icon: carIcon
    }).addTo(map);

    socket.emit('init', {
        isDriver: isDriver,
        latLong: latLong
    });
    inited = true;
}

function onMapClick(e) {
    if (faker == true) {

        var loc = mymarker.getLatLng();
        var latLong = e.latlng;
        var angle = setangle(loc.lat, loc.lng, latLong.lat, latLong.lng)
        mymarker.setIconAngle(angle);
        mymarker.moveTo([e.latlng.lat, e.latlng.lng], 3000)
        socket.emit('locChanged', {
            latLong: [e.latlng.lat, e.latlng.lng]
        });
    }
}

function success(position) {
    if (!inited)
        init(position)
    else {
        var loc = mymarker.getLatLng();
        var latLong = getLatLong(position)
        var angle = setangle(loc.lat, loc.lng, latLong[0], latLong[1])
        mymarker.setIconAngle(angle);
        mymarker.moveTo(latLong, 5000)
        socket.emit('locChanged', {
            latLong: latLong
        });
    }
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

function error(err) {
    console.log('ERROR ' + err.message);
}

function getLatLong(position) {
    return ([position.latitude, position.longitude])
}