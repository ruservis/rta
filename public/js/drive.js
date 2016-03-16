var myloc = [];
var id;
var map = L.map('map');
L.tileLayer('https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://google.com">Google map</a> contributors, ',
}).addTo(map);



var carIcon = L.icon({
    iconUrl: "/images/mycar.png",
    iconSize: [30, 30]
});

var lat = 12.909022,
    long1 = 77.6376318;
//movingmarker instance

var mymarker = L.Marker.movingMarker([
    [lat, long1],
    [lat + 0.5, long1 + 0.5]
], [10000], {
    icon: carIcon
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
var i=0;
function success(pos) {
  
    mymarker.moveTo([pos.coords.latitude, pos.coords.longitude], 10000)
    myloc.push({'latitude':pos.coords.latitude,'longitude':pos.coords.longitude});
    console.log(myloc[i++].latitude)
    mymarker.bindPopup('You are at lat:' + pos.coords.latitude + 'long:' + pos.coords.longitude)
    map.setView([pos.coords.latitude, pos.coords.longitude], 7)

}

function error(err) {
    console.log('ERROR ' + err.message);
}

id = navigator.geolocation.watchPosition(success, error, options);