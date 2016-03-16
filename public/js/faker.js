var map = L.map('map').setView([12.909022, 77.6376318], 15);
var popup = L.popup();
var lat = 12.909022,
    long1 = 77.6376318
var marker = [];
var carIcon = L.icon({
    iconUrl: "mycar.png",
    iconSize: [30, 30]
});
L.tileLayer('https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x={x}&y={y}&z={z}&s=Galile', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20
}).addTo(map);


var mymarker = L.Marker.movingMarker([
    [lat, long1],
    [lat + 1.5, long1 + 1.5]
], [1000], {
    icon: carIcon
}).addTo(map);
marker.push(mymarker)

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
         marker[0].bindPopup("Hola Amigo,You are here ").openPopup();
    marker[0].moveTo([e.latlng.lat, e.latlng.lng], 10000)

}
map.on('click', onMapClick)
map.locate({
    setView: true,
    maxZoom: 20
});
