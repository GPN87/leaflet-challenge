// //The Let MyMap bit
function createMap(earthquakes){
     let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

    let baseMaps = {
      "Street Map": street,
      "Topographical Map": topo
    };

    let overlayMaps = {
        "Earthquakes":earthquakes
    };

    let map = L.map('map',{
        center: [0,80],
        zoom: 3,
        layers:[street,earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'legend');
        let grades = [0, 100, 300, 500, 700];
        let colors = ['yellow', 'orange', 'red', 'maroon', 'darkred'];

    div.innerHTML += '<b>Depth</b><br>';
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);
}


function createMarkers(response){
    let features = response.features;
    console.log(features);
    let quakeCircles = [];
    let depthScale = d3.scaleLinear().domain([0, 700]).range(["yellow", "red"]);
    features.forEach(function(feature){
        let geometry = feature.geometry;
        let properties = feature.properties;
        let depth = geometry.coordinates[2]
        console.log(depth)
        let quakecircle = L.circle([geometry.coordinates[1],geometry.coordinates[0]],{
            color: depthScale(depth),
            fillColor:depthScale(depth),
            fillOpacity:0.75,
            radius: 7**properties.mag
        }).bindPopup(`<h4> Location: ${properties.place} </h4><hr> Magnitude: ${properties.mag} <br> Depth: ${depth}`);
        quakeCircles.push(quakecircle);
    })
    console.log(quakeCircles);
    createMap(L.layerGroup(quakeCircles));
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createMarkers);

