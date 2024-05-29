// main.js

import { initMap } from './map.js';
import { createCountryFilter } from './ui.js';
import { loadDataPoints, extractCountries } from './data.js';

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    loadDataPoints();
});

