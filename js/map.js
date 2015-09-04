var makeMap = function(elID, data) {
  layer_MapBox = new L.tileLayer(
  'https://d.tiles.mapbox.com/v3/markbrough.n3kod47p/{z}/{x}/{y}.png',{
      maxZoom: 18, attribution: 'MapBox Streets'
  })
  var map = new L.Map(elID, {
      center: new L.LatLng(data[0].lat, data[0].long),
      zoom: 8,
      maxZoom: 10
  });
  console.log("Added map!");
  layer_MapBox.addTo(map);
  
  var latLongs = []
  
  $(data).each(function(i, l) {
    console.log("a location", l);
    var popupContent = getPopupContent(l);
    L.marker([l.lat, l.long]).addTo(map)
        .bindPopup(popupContent)
        .openPopup();
    latLongs.push(new L.LatLng(l.lat, l.long));
  });
  
  map.fitBounds(new L.LatLngBounds(latLongs));
  
  console.log("Added data!")
  
  map.scrollWheelZoom.disable();

  function getPopupContent(l) {
    var pc = "Company name: " + l.company_name + "<br />\
    Location name: " + l.location_name;
    return pc;
  }
}