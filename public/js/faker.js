var id;
var map = L.map('map');
var socket = io();
var isDriver = true;
var added = false;
var mymarker;
var popup = L.popup();
var faker = true;

if ("geolocation" in navigator) {
    console.log('locfound');
} else {
    prompt('Allow location access')
}

L.tileLayer('https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile', {
    maxZoom: 20,
    attribution: 'Map data &copy; <a href="https://google.com">Google map</a> contributors, ',
}).addTo(map);

var carIcon = L.icon({
    iconUrl: "/images/mycar.png",
    iconSize: [30, 30]
});

map.locate({
    setView: true,
    maxZoom: 20,
    
});

var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000,
};


map.on('locationfound', onLocationFound);
map.on('click', onMapClick)
map.on('zoomend', _changeLocateMaxZoom);

function _changeLocateMaxZoom(e) {
    if (map._locateOptions) {
        map._locateOptions.maxZoom = map.getZoom();
    }
}

function onLocationFound(e) {
    map.setView([e.latlng.lat,e.latlng.lng],15)
     mymarker = L.Marker.movingMarker([
        e.latlng,
        e.latlng
    ], [50], {
        icon: carIcon,
        autostart: true,
        setZoom: 15
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
        mymarker.setIconAngle(angle);
        mymarker.moveTo([e.latlng.lat, e.latlng.lng], 3000)
        console.log('lat='+e.latlng.lat+'long'+e.latlng.lng)
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