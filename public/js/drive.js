var id;
var map = L.map('map');
var socket = io();
var isDriver = true;
var added = false;

L.tileLayer('https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://google.com">Google map</a> contributors, ',
}).addTo(map);

var carIcon = L.icon({
    iconUrl: "/images/mycar.png",
    iconSize: [30, 30]
});

var options = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 0,
};

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(init, error, options);
} else {
    alert("Geolocation is not supported by this browser.");
}

function init(position) {
    latLong = getLatLong(position);
    var marker = L.marker(latLong, {
        icon: carIcon
        }).addTo(map);
    if (!added)
        socket.emit('init', {
            latLong: latLong
        });
    id = navigator.geolocation.watchPosition(success, error, options);
}


/*var mymarker = L.Marker.movingMarker([
    [0, 0],
    [0, 0]
], [100], {
    icon: carIcon
}).addTo(map);*/

map.locate({
    setView: true,
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
});

function success(position) {
    /*mymarker.moveTo([pos.coords.latitude, pos.coords.longitude], 10000)
    mymarker.bindPopup('You are at lat:' + pos.coords.latitude + 'long:' + pos.coords.longitude)*/
    map.setView(latLong, 16)
    socket.emit('locChanged', {
        latLong: getLatLong(position)
    });
}

function error(err) {
    console.log('ERROR ' + err.message);
}

function getLatLong(position) {
    return ([position.coords.latitude, position.coords.longitude])
}