let map;
let markerGroup;
var geojsonData; // Variable to store the GeoJSON data

var countries = new Set();

function initMap() {
    map = L.map("map", {
        zoomControl: false,
    }).setView([20, 0], 3);
    markerGroup = L.featureGroup().addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    loadDataPoints();
}

function loadDataPoints() {
    fetch("accommodation.geojson")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            geojsonData = data;
            extractCountries(data);
            createCheckboxes();
            updateMarkers();
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });

}

function extractCountries(data) {
    data.features.forEach(feature => {
        if (feature.properties.country) {
            countries.add(feature.properties.country);
        }
    });
}

function createCheckboxes() {
    var container = document.getElementById('checkboxContainer');
    countries.forEach(country => {
        var button = document.createElement('button');
        button.innerHTML = country;
        button.addEventListener('click', () => setMapBounds(country));

        container.appendChild(button);
        container.appendChild(document.createElement('br'));
    });
}

function setMapBounds(country) {
    var selected = geojsonData.features.filter(feature => feature.properties.country === country);
    var selectedMarker = L.featureGroup(selected.map(feature => L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])));
    map.setMaxZoom(7);
    map.fitBounds(selectedMarker.getBounds());
    map.setMaxZoom(20);
}

function updateMarkers() {
    markerGroup.clearLayers(); // Clear existing markers

    L.geoJSON(geojsonData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`${feature.properties.name} - ${feature.properties.country}`).openPopup();
        }
    }).addTo(markerGroup);
}
