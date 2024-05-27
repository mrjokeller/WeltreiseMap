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

    document.getElementById('searchField').addEventListener('keyup', search);

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
            createCountryButton();
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

function createCountryButton() {
    var container = document.getElementById('countryButtonContainer');
    countries.forEach(country => {
        var button = document.createElement('button');
        button.innerHTML = "• " + country;
        button.addEventListener('click', () => filterByCountry(country));
        button.style.cursor = "pointer";

        container.appendChild(button);
        container.appendChild(document.createElement('br'));
    });
}

function filterByCountry(country) {
    var selected = geojsonData.features.filter(feature => feature.properties.country === country);
    var selectedMarker = L.featureGroup(selected.map(feature => L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])));
    setMapBounds(selectedMarker);
}

function setMapBounds(marker) {
    map.setMaxZoom(9);
    map.fitBounds(marker.getBounds().pad(0.1));
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

function search() {
    var search = document.getElementById('searchField').value;
    if (search === "") {
        console.log('empty search');
        clearSearch();
        removeSearchResults();
        return;
    }
    console.log(search);
    var selected = geojsonData.features.filter(feature => feature.properties.name.toLowerCase().includes(search.toLowerCase()));
    var selectedMarker = L.featureGroup(selected.map(feature => L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])));
    displaySearchResults(selected);
    // setMapBounds(selectedMarker);
}

function displaySearchResults(results) {
    var container = document.getElementById('searchResultsContainer');
    container.innerHTML = ""; // Clear previous results

    var dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');

    results.slice(0, 10).forEach(result => {
        var link = document.createElement('button');
        link.innerHTML = result.properties.name;
        link.style.cursor = "pointer";
        link.addEventListener('click', () => {
            console.log(result);
            var selectedMarker = L.featureGroup([result].map(feature => L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])));
            setMapBounds(selectedMarker);
            removeSearchResults();
            autoFillSearchField(result.properties.name);
        });
        dropdownContent.appendChild(link);
    });

    container.appendChild(dropdownContent);
}

function clearSearch() {
    document.getElementById('searchField').value = "";
    map.setView([20, 0], 3);
}

function autoFillSearchField(value) {
    document.getElementById('searchField').value = value;
}

function removeSearchResults() {
    console.log('focus out');
    document.getElementById('searchResultsContainer').innerHTML = "";
}