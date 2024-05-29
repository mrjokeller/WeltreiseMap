// ui.js

import { geojsonData } from './data.js';

export function createFilterUI(containerId, items, updateSelectedItems, filterAction) {
    const container = document.getElementById(containerId);
    items.forEach(item => {
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('checkbox-group');

        const checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('checkbox');

        const label = document.createElement('label');
        label.classList.add('checkbox-wrapper');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('checkbox-input');
        input.addEventListener('change', () => updateSelectedItems(input.checked, item));

        const checkboxTile = document.createElement('span');
        checkboxTile.classList.add('checkbox-tile');

        const checkboxLabel = document.createElement('span');
        checkboxLabel.classList.add('checkbox-label');
        checkboxLabel.textContent = item.charAt(0).toUpperCase() + item.slice(1);

        checkboxTile.appendChild(checkboxLabel);

        if (filterAction) {
            const buttonExpand = document.createElement('button');
            buttonExpand.classList.add('button-expand');
            buttonExpand.addEventListener('click', () => filterAction(item));

            const svgIcon = document.createElement('i');
            svgIcon.classList.add('fa-solid', 'fa-expand');
            buttonExpand.appendChild(svgIcon);

            checkboxTile.appendChild(buttonExpand);
        }

        label.appendChild(input);
        label.appendChild(checkboxTile);
        checkboxDiv.appendChild(label);
        fieldset.appendChild(checkboxDiv);
        container.appendChild(fieldset);
    });
}

export function search() {
    const search = document.getElementById('searchField').value;
    if (search === "") {
        console.log('empty search');
        clearSearch();
        removeSearchResults();
        return;
    }
    console.log(search);
    const selected = geojsonData.features.filter(feature => feature.properties.name.toLowerCase().includes(search.toLowerCase()));
    displaySearchResults(selected);
}

export function displaySearchResults(results) {
    const container = document.getElementById('searchResultsContainer');
    container.innerHTML = "";

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');

    results.slice(0, 10).forEach(result => {
        const link = document.createElement('button');
        link.innerHTML = result.properties.name;
        link.style.cursor = "pointer";
        link.addEventListener('click', () => {
            console.log(result);
            const selectedMarker = L.featureGroup([result].map(feature => L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])));
            setMapBounds(selectedMarker);
            removeSearchResults();
            autoFillSearchField(result.properties.name);
        });
        dropdownContent.appendChild(link);
    });

    container.appendChild(dropdownContent);
}

export function clearSearch() {
    document.getElementById('searchField').value = "";
    map.setView([20, 0], 3);
}

export function autoFillSearchField(value) {
    document.getElementById('searchField').value = value;
}

export function removeSearchResults() {
    console.log('focus out');
    document.getElementById('searchResultsContainer').innerHTML = "";
}
