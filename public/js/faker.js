var isDriver = true;
var faker = true;
var socket = io();

map.locate({
    setView: true,
    maxZoom:25,
    
});

map.on('locationfound', onLocationFound);
map.on('click', onMapClick)
map.on('zoomend', _changeLocateMaxZoom);

function _changeLocateMaxZoom(e) {
    if (map._locateOptions) {
        map._locateOptions.maxZoom = map.getZoom();
    }
}

function onLocationFound(e) {
    map.setZoom(19)
     mymarker = L.Marker.movingMarker([
        e.latlng,
        e.latlng
    ],50, {
        icon: carIcon,
        autostart: true,
        setZoom: 25
    }).addTo(map);

     socket.emit('init', {
        isDriver: isDriver,
        latLong: e.latlng
    });

}

function onMapClick(e) {
    if (faker == true) {
     
        var loc = mymarker.getLatLng();
        var latLong = e.latlng;
        var angle = setangle(loc.lat, loc.lng, latLong.lat, latLong.lng)
        console.log(e.latlng)
        mymarker.setIconAngle(angle);
        mymarker.moveTo([e.latlng.lat, e.latlng.lng], 5000)
        socket.emit('locChanged', {
            latLong: [e.latlng.lat, e.latlng.lng]
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

function getLatLong(position) {
    return ([position.latitude, position.longitude])
}