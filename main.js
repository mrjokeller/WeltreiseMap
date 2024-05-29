// main.js

import { initMap } from './map.js';
import { loadDataPoints } from './data.js';

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    loadDataPoints();
});

