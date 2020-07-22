
// GeoJSON url
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// API Call
d3.json(baseURL, function(earthquakeData) {
    console.log(earthquakeData);

    //Create tile layers
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",     
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",     
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v9",
        accessToken: API_KEY
    });

    // Define tile layers as base maps
    var baseMaps = {
        Satellite: satellite,
        Grayscale: grayscale
    };
    
    // Create GeoJSON layer with earthquake bubble markers 
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {

            // Set color based on magnitude size
            var color = "";
            if (feature.properties.mag > 5) {
                color = "#ff0400";
            } else if (feature.properties.mag > 4) {
                color = "#ff5900";
            } else if (feature.properties.mag > 3) {
                color = "#ff9100";
            } else if (feature.properties.mag > 2) {
                color = "#ffd900";
            } else if (feature.properties.mag > 1) {
                color = "#eeff00";
            } else {
                color = "#bfff00";
            };
            // Set bubble marker radius on magnitude size
            var markers = {
                radius: feature.properties.mag * 3,
                fillOpacity: 0.75,
                color: "black",
                fillColor: color,
                weight: 0.5
            };
            // Add popup with extra data
            return L.circleMarker(latlng, markers)
                .bindPopup(`<h3>${feature.properties.place}</h3><hr/><p>Magnitude:${feature.properties.mag}</p><p>Time:${feature.properties.time}</p>`)  
        }
    });

    // Define earthquake markers as overlay map
    var overLayMaps = {
        Earthquakes: earthquakes
    };

    // Create map with initial layers
    var myMap = L.map('map', {
        center: [39.8283, -98.5795],
        zoom: 4,
        layers: [satellite, earthquakes]
    });


    // Create Legend ** not showing on map **
    // Create function to get colors for magnitude scale
    function getColor(d) {
        return d > 5 ? "#ff0400" :
               d > 4 ? "#ff5900" :
               d > 3 ? "#ff9100" :
               d > 2 ? "#ffd900" :
               d > 1 ? "#eeff00" :
               "#bfff00";                     
    }

    // set legend control on bottom left
    var legend = L.control({position: 'bottomleft'});

    // Create div element with 'info legend' class
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            scale = [0, 1, 2, 3, 4, 5]
            labels = [];
    
        // loop through our scale intervals and generate a label with a colored square for each interval
        for (var i = 0; i < scale.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(scale[i] + 1) + '"></i> ' +
                scale[i] + (scale[i + 1] ? '&ndash;' + scale[i + 1] + '<br>' : '+');
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };

    // Create layer control and pass in basemaps, overlaymap, and legend to map
    L.control.layers(baseMaps, overLayMaps, legend, {
        collapsed: false
    }).addTo(myMap);

  });


    
    