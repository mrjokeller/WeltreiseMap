// filter.js

import { markerGroup, setMapBounds } from './map.js';
import { geojsonData } from './data.js';
import { marker } from './ui.js';

export let selectedCountries = new Set();
export let selectedCategories = new Set();

export function updateMarkers() {
    markerGroup.clearLayers();
    const filteredData = geojsonData.features.filter(feature => {
        const countryMatch = selectedCountries.size === 0 || selectedCountries.has(feature.properties.country);
        const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(feature.properties.category);
        return countryMatch && categoryMatch;
    });
    L.geoJSON(filteredData, {
        pointToLayer: function (feature, latlng) {
            console.log("Creating marker for", feature);
            marker(feature.properties.category, latlng).addTo(markerGroup)
                .bindPopup(`<b>${feature.properties.name}</b>, ${feature.properties.country}`);
        }
    }).addTo(markerGroup);
}

export function updateSelectedCountries(checked, country) {
    if (checked) {
        selectedCountries.add(country);
    } else {
        selectedCountries.delete(country);
    }
    updateMarkers();
}

export function updateSelectedCategories(checked, category) {
    if (checked) {
        selectedCategories.add(category);
    } else {
        selectedCategories.delete(category);
    }
    updateMarkers();
}

export function filterByCountry(country) {
    const selected = geojsonData.features.filter(feature => feature.properties.country === country);
    const selectedMarker = L.featureGroup(selected.map(feature => L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])));
    setMapBounds(selectedMarker);
}
