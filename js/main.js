// main.js

import { initMap } from './js/map.js';
import { loadDataPoints } from './js/data.js';

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    loadDataPoints();
});

