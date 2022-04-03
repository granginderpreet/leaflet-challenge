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
     var map = L.map("map", {
    center: [40.73, -110.0059],
    zoom: 4,
  
     layers: [streetmap, locations]
  });

   //locations.addTo(map);

    //Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
    {

      var legend = L.control({position: 'bottomleft'});
      legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10,0,1,5,10,20,50,100],
          labels = ['<strong>Depth (in km.) below the surface</strong>'],
          from, to;
        for (var i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];
          div.innerHTML +=
          labels.push(
            '<i class="circle" style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');
        console.log(div)
        return div;
      };
      legend.addTo(map);
    }
}


  // Define a markerSize() function that will give each city a different radius based on its population.
function markerSize(population) {
  return Math.sqrt(population) * 50;
}

function getColor(d) {
  // We have changed the Red color in legend to map the least depth since that can cause more damage 
  var mapScale = chroma.scale(['#FF0000','#bcf831'])
    .classes([-10,0,1,5,10,20,50,100]);
  return mapScale(d)
}

// Pull the "stations" property from response.data.

  function createMarkers(response) {
  

    var metadata = response.metadata;
  
    // Initialize an array to hold bike markers.
    var markers = [];
  
    // Loop through the stations array.
    for (var index = 0; index < metadata.count; index++) {
      var loc = response.features[index].geometry.coordinates;
      var mag = response.features[index].properties.mag;
    //  console.log( markerSize(response.features[index].properties.mag), response.features[index].properties.place)
      
      if (loc[2]< -10) 
      {
        console.log("mag=",mag,"depth outside our range",loc)
      }
      // For each station, create a marker, and bind a popup with the station's name.
     var marker=L.circleMarker([loc[1],loc[0]],{
        fillOpacity: 0.5,
        color: "black",
        weight:0.1,
        fillColor: getColor(loc[2]),
        // Setting our circle's radius to equal the output of our markerSize() function:
        // This will make our marker's size proportionate to its population.
       radius: 2*response.features[index].properties.mag}).bindPopup(`<h3> Magnitude ${mag} seen at ${response.features[index].properties.place} at ${loc[2]} km below earth surface </h3>`);
       
       markers.push(marker);
       //console.log( getColor(loc[2]))

     }
     createMap(L.layerGroup(markers));
    }
  var map;


  

  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers)