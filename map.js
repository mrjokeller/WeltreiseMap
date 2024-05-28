
let map;
let markerGroup;
var geojsonData; // Variable to store the GeoJSON data

var selectedCountries = new Set();
var selectedCategories = new Set();

var countries = new Set();

function initMap() {
    var mapbox_url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJqb2tlbGxlciIsImEiOiJjbHdweXQ3aWMyb2Q3MmptbTllNnphZHNqIn0.KHaYluQDTamL9J8chbu0wA';
    var mapbox_attribution = '© Mapbox © OpenStreetMap Contributors';
    var esri_url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    var esri_attribution = '© Esri © OpenStreetMap Contributors';
    var lyr_satellite = L.tileLayer(esri_url, { id: 'MapID', maxZoom: 20, tileSize: 512, zoomOffset: -1, attribution: esri_attribution });
    var lyr_streets = L.tileLayer(mapbox_url, { id: 'mapbox/streets-v12', maxZoom: 28, tileSize: 512, zoomOffset: -1, attribution: mapbox_attribution });

    map = L.map("map", {
        zoomControl: false,
    }).setView([20, 0], 3);
    markerGroup = L.featureGroup().addTo(map);
    /* L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 20,
    }).addTo(map); */
    lyr_streets.addTo(map);
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
            createCountryFilter();
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

function createCountryFilter() {
    var container = document.getElementById("countryButtonContainer");
    countries.forEach(country => {
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('checkbox-group');

        const checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('checkbox');

        const label = document.createElement('label');
        label.classList.add('checkbox-wrapper');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('checkbox-input');

        const checkboxTile = document.createElement('span');
        checkboxTile.classList.add('checkbox-tile');

        const checkboxLabel = document.createElement('span');
        checkboxLabel.classList.add('checkbox-label');
        checkboxLabel.textContent = country;

        const buttonExpand = document.createElement('button');
        buttonExpand.classList.add('button-expand');

        const svgIcon = document.createElement('i');
        svgIcon.classList.add('fa-solid', 'fa-expand');
        // Append SVG icon to button
        buttonExpand.appendChild(svgIcon);

        // Append label and button to checkbox tile
        checkboxTile.appendChild(checkboxLabel);
        checkboxTile.appendChild(buttonExpand);

        // Append input and checkbox tile to label
        label.appendChild(input);
        label.appendChild(checkboxTile);

        // Append label to checkbox div
        checkboxDiv.appendChild(label);

        // Append checkbox div to container
        fieldset.appendChild(checkboxDiv);

        // Append the container to the body or any other desired parent element
        container.appendChild(fieldset);
    })
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
            layer.bindPopup(`<b>${feature.properties.name} - ${feature.properties.country}</b>`).openPopup();
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