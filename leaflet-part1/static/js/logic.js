let earthq = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform an API call to the earthquake API to get the information. 
// "fetching data" refers to the process of making an HTTP request to an external data source 
// (in this case, the USGS earthquake data API), receiving a response (the earthquake data in GeoJSON format), and then being able to work with that data in your code for further processing and visualization.
d3.json(earthq).then (function(data){
    console.log(data)

let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
  "Street Map": streetmap
};
// Add the streetmap layer to the map
let map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 3
    
  });


//   function chooseColor(borough)
  streetmap.addTo(map)

// Function to determine marker size based on magnitude
function calculateRadius(magnitude) {
  // Adjust the scaling factor as needed for marker size
  return magnitude * 5 +1;
}

// Function to determine marker color based on depth
function calculateColor(depth) {
  // Customize this function to define colors based on depth ranges
  // Example: Blue for shallow, yellow for moderate, red for deep
  if (depth < 10) return "#98EE00"; // Shallow (adjust color as needed)
  if (depth < 30) return "#D4EE00"; // Moderate (adjust color as needed)
  if (depth < 50) return "#EECC00";
  if (depth < 70) return "#EE9C00";
  if (depth < 90) return "#EA822C"
  if (depth > 90) return "#EA2C2C";
  
  
  // return "#e6550d"; // Deep (adjust color as needed)
}



// Create a GeoJSON layer for earthquake data with customized markers and popups. 
L.geoJson(data,{
  pointToLayer: function (feature, latlng) {
    // Extract earthquake properties
  const properties = feature.properties;

    // Create circle markers with size based on magnitude and color based on depth  
  return L.circleMarker(latlng);
}, 
style: function(feature){
    return { 
    //  function for radius of markers to change by magnitude
    radius:calculateRadius(feature.properties.mag),
    // fillcolor the progression to find the coordinates, through console. 
    fillColor: calculateColor(feature.geometry.coordinates[2]),
    color: calculateColor(feature.geometry.coordinates[2]),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}},
onEachFeature:function(feature,layer){layer.bindPopup(`
<h3>Earthquake Information</h3>
<p><strong>Location:</strong> ${feature.properties.place}</p>
<p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
<p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>`);
}

}).addTo(map);

// Add a legend to the map
const legend = L.control({ position: 'topright' });
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const depths = [-10,10,30,50,70,90]; // Adjust depth ranges as needed
    const colors = ["#98EE00","#D4EE00","#EECC00","#EE9C00","#EA822C","#EA2C2C"]; // Corresponding colors

    div.innerHTML += '<strong>Depth Legend</strong><br>';
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            (depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km'));
    }
    return div;
};
legend.addTo(map);

});