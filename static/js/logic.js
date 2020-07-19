

var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(baseURL, function(earthquakeData) {
    console.log(earthquakeData);

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

    var baseMaps = {
        Satellite: satellite,
        Grayscale: grayscale
    };
        
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
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
            var markers = {
                radius: feature.properties.mag * 3,
                fillOpacity: 0.75,
                color: "black",
                fillColor: color,
                weight: 0.5
            };
            return L.circleMarker(latlng, markers)
                .bindPopup(`<h3>${feature.properties.place}</h3><hr/><p>Magnitude:${feature.properties.mag}</p><p>Time:${feature.properties.time}</p>`)  
        }
    });

    var overLayMaps = {
        // FaultLines: faultLines,
        Earthquakes: earthquakes
    };

    var myMap = L.map('map', {
        center: [39.8283, -98.5795],
        zoom: 4,
        layers: [satellite, earthquakes]
    });


    //Legend NOT WORKING
    var legend = L.control({ position:'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')

        var legendInfo = {
            legendColors: ["#bfff00", "#eeff00", "#ffd900", "#ff9100", "#ff5900", "#ff0400"],
            legendLabels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']
        }

        for (i = 0; i < legendInfo; i++) {
            div.innerHTML = `<div><h3>Magnitude</h3><br></div><div class="labels"><li style="background-color:${legendColors[i]}"></li></div>`
        }
      return div
    }

    L.control.layers(baseMaps, overLayMaps, legend).addTo(myMap);

  });
  


