// Store our API endpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);
});

// Add legend information
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    mags = [1, 2, 3, 4, 5],
    labels = [],
    from, to;

  for (var i = 0; i <= mags.length; i++) {
    from = i;
    to = mags[i];

    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

// Create function to set color based on earthquake magnitude

function getColor(c)
{
  // x = Math.round(c);
  switch (Math.floor(c)) {
    case 0:
      return 'lightyellow';
    case 1:
      return "lime";
    case 2:
      return "green";
    case 3:
      return "yellow";
    case 4:
      return "darkorange";  
    default:
      return "red";
  }
}

// Create function to create circular features
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJson(earthquakeData,{
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag*5,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9})
        .bindPopup("<h3>" + "Location: " + feature.properties.place +
          "</h3><hr><p>" + "Date/Time: " + new Date (feature.properties.time) + "<br>" +
          "Magnitude: " + feature.properties.mag + "</p>");
  }
});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define base layer
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  })
  //GET NEW DARKMAP LAYER FROM MAPBOX
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  })

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light": lightmap,
    "Dark": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    //center: [ 34.052235, -118.243683],
    //center: [34.75, -111.87],
    center: [37.0745, 22.4303],
    zoom: 2,
    layers: [lightmap, earthquakes]
  });
    console.log(myMap);

//   Create a layer control
//   Pass in our baseMaps and overlayMaps
//   Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
   }).addTo(myMap);

  //Add legend to myMap
  legend.addTo(myMap);
}