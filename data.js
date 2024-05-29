import { updateMarkers } from './filter.js';
import { createFilterUI } from './ui.js';
import { updateSelectedCategories, updateSelectedCountries, filterByCountry } from './filter.js';

export let geojsonData;
export let countries = new Set();
export let categories = new Set();

export function loadDataPoints() {
    fetch("data.geojson")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            geojsonData = data;
            extractCountries()
            updateMarkers();
            createFilterUI("countryButtonContainer", countries, updateSelectedCountries, filterByCountry);
            createFilterUI("categoryButtonContainer", categories, updateSelectedCategories);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });
}

export function extractCountries() {
    console.log(geojsonData);
    geojsonData.features.forEach(feature => {
        if (feature.properties.country) {
            countries.add(feature.properties.country);
        }
        if (feature.properties.category) {
            categories.add(feature.properties.category);
        }
    });
}