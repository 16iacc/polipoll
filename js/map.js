var map;
var makeMap = function(elID, data) {
  if (map != undefined) {
    map.remove();
  }

  layer_MapBox = new L.tileLayer(
  'https://d.tiles.mapbox.com/v3/markbrough.n3kod47p/{z}/{x}/{y}.png',{
      maxZoom: 18, attribution: 'MapBox Streets'
  })
  map = new L.Map(elID, {
      zoom: 8,
      maxZoom: 10
  });
  layer_MapBox.addTo(map);
  
  var latLongs = []
  
  $(data).each(function(i, l) {
    var popupContent = getPopupContent(l);
    L.marker([l.lat, l.long]).addTo(map)
        .bindPopup(popupContent)
        .openPopup();
    latLongs.push(new L.LatLng(l.lat, l.long));
  });
  
  map.fitBounds(new L.LatLngBounds(latLongs));
  
  map.scrollWheelZoom.disable();

  function getPopupContent(l) {
    var pc = "Company name: " + l.company_name + "<br />\
    Location name: " + l.location_name;
    return pc;
  }
}