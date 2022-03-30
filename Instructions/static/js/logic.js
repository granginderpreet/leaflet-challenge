function createMap(locations) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    var overlayMaps = {
      "EarthQuake": locations
    };
  
    // Create the map object with options.
    var map = L.map("map-id", {
      center: [40.73, -74.0059],
      zoom: 12,
      layers: [streetmap, locations]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
  
    // Pull the "stations" property from response.data.
    var metadata = response.metadata;
  
    // Initialize an array to hold bike markers.
    var markers = [];
  
    // Loop through the stations array.
    for (var index = 0; index < metadata.count; index++) {
      var loc = response.features[index].geometry.coordinates;
  
      // For each station, create a marker, and bind a popup with the station's name.
      var marker = L.marker([loc[0], loc[1]])
        .bindPopup("<h3>" + features[index].properties.mag +"seen at "+ features[index].properties.place "</h3>");
  
      // Add the marker to the bikeMarkers array.
      markers.push(marker);
    }
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(markers));
  }
  
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
  

