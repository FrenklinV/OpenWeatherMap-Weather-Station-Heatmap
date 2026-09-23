//  API key
const API_KEY = "YOUR_OPENWEATHER_API_KEY_HERE";


// Create Leaflet map

const map = L.map("map");

// Basemap
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  { attribution: "Tiles © Esri" }
).addTo(map);

// Heatmap configuration

const heatmapConfig = {
  radius: 12,
  maxOpacity: 0.8,
  scaleRadius: false,
  useLocalExtrema: true,
  latField: "lat",
  lngField: "lng",
  valueField: "count"
};

// Heatmap layer
const heatmapLayer = new HeatmapOverlay(heatmapConfig);
map.addLayer(heatmapLayer);


// Get user location

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      map.setView([lat, lon], 9);
      loadStations(lat, lon);
    },
    () => {
      // Fallback: Castellón
      const lat = 39.9864;
      const lon = -0.0513;

      map.setView([lat, lon], 9);
      loadStations(lat, lon);
    }
  );
}

// Load weather stations

function loadStations(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=50&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      const heatmapData = {
        max: 1,
        data: data.list.map(station => ({
          lat: station.coord.lat,
          lng: station.coord.lon,
          count: 1
        }))
      };

      heatmapLayer.setData(heatmapData);
    })
    .catch(err => console.error("Weather API error:", err));
}


