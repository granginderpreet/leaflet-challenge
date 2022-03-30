function createMap(locations) {

    // Create the tile layer that will be the background of our map.
    var streetmap=  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
     map = L.map("map", {
    center: [40.73, -90.0059],
    zoom: 6,
     layers: [streetmap, locations]
  });

   locations.addTo(map);

    //Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
}


  // Define a markerSize() function that will give each city a different radius based on its population.
function markerSize(population) {
  return Math.sqrt(population) * 50;
}


  function createMarkers(response) {
  
    // Pull the "stations" property from response.data.
    var metadata = response.metadata;
  
    // Initialize an array to hold bike markers.
    var markers = [];
  
    // Loop through the stations array.
    for (var index = 0; index < metadata.count; index++) {
      var loc = response.features[index].geometry.coordinates;
      var mag = response.features[index].properties.mag;
      console.log( markerSize(response.features[index].properties.mag), response.features[index].properties.place)
      
      if (isNaN(mag) || isNaN(loc)) 
      {
        console.log("mag=",mag,"loc=",loc)
        continue;
      }
      // For each station, create a marker, and bind a popup with the station's name.
     var marker=L.circleMarker([loc[0],loc[1]],{
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
        // Setting our circle's radius to equal the output of our markerSize() function:
        // This will make our marker's size proportionate to its population.
       radius: 10*response.features[index].properties.mag}).bindPopup(`<h3> ${mag} seen at ${response.features[index].properties.place}</h3>`);
       
       markers.push(marker);
       console.log( markers)

     }
     createMap(L.layerGroup(markers));
    }
  var map;
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers)