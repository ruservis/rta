var L = require('leaflet')
var leafletMap = require('leaflet-map')
 
var map = leafletMap()
L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i86knfo3/{z}/{x}/{y}.png')
  .addTo(map)
 
L.marker([12.164577.674989])
  .bindPopup('Null Island!')
  .addTo(map)