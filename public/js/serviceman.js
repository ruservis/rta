var socket = io();
var isservice = true;
var faker = false;
var inited = false;

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
        icon: serviceIcon
    }).addTo(map);

    socket.emit('initservice', {
        isservice: isservice,
        latLong: latLong
    });
    inited = true;
}

function success(position) {
    if (!inited)
        init(position)
    else {
        var loc = mymarker.getLatLng();
        var latLong = getLatLong(position)
        mymarker.moveTo(latLong, 5000)
        socket.emit('servicelocChanged', {
            latLong: latLong
        });
    }
}

socket.on('servicepath',function(id){
L.Routing.control({
                    waypoints: [
                        L.latLng(mymarker.getLatLng()),
                          L.latLng(id.lat,id.lng)
                    ],
                     createMarker: function() { return null; } 
                }).addTo(map);
});

function error(err) {
    console.log('ERROR ' + err.message);
}

function getLatLong(position) {
    return ([position.latitude, position.longitude])
}