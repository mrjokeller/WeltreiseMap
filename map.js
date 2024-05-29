// map.js

export let map;
export let markerGroup;

export function initMap() {
    const mapbox_url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJqb2tlbGxlciIsImEiOiJjbHdweXQ3aWMyb2Q3MmptbTllNnphZHNqIn0.KHaYluQDTamL9J8chbu0wA';
    const mapbox_attribution = '© Mapbox © OpenStreetMap Contributors';
    const lyr_streets = L.tileLayer(mapbox_url, { id: 'mapbox/streets-v12', maxZoom: 28, tileSize: 512, zoomOffset: -1, attribution: mapbox_attribution });

    map = L.map("map", { zoomControl: false }).setView([20, 0], 3);
    markerGroup = L.featureGroup().addTo(map);
    lyr_streets.addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
}

export function setMapBounds(marker) {
    map.setMaxZoom(9);
    map.fitBounds(marker.getBounds().pad(0.1));
    map.setMaxZoom(20);
}
