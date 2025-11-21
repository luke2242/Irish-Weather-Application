import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import "../stylesheets/Map.css";

// Move the locations array outside the component
const locations = [
  { name: "Galway", lat: 53.2707, lon: -9.0568 },
  { name: "Offaly", lat: 53.2734, lon: -7.4906 },
  { name: "Dublin", lat: 53.3498, lon: -6.2603 },
  { name: "Cork", lat: 51.8985, lon: -8.4756 },
  { name: "Kerry", lat: 52.1545, lon: -9.5669 },
  { name: "Waterford", lat: 52.2573, lon: -7.1115 },
  { name: "Sligo", lat: 54.2776, lon: -8.4715 },
  { name: "Cavan", lat: 53.9899, lon: -7.3635 },
];

function Map() {
  const [weatherData, setWeatherData] = useState([]);

  // Fetch weather data for all locations
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Will store the locations in localStorgae to ensure that they're no called everytime on refresh
        const cachedData = JSON.parse(localStorage.getItem("weatherData")) || {};
        // Gets our current time
        const now = new Date().getTime();

        // Our promises for each loaction
        const promises = locations.map(async (location) => {
          const cacheKey = `${location.name}`;
          const cachedLocationData = cachedData[cacheKey];

          // Check if cached data exists and is less than 1 hour old
          // This ensures that it will update hourly
          if (cachedLocationData && now - cachedLocationData.timestamp < 3600000) {
            return cachedLocationData.data;
          }

          // Fetch new data if no valid cache exists
          const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&timezone=auto`
          );

          // Save the new data to the cache
          const newData = {
            // We spread our new weather data and update it
            ...location,
            weather: response.data.current_weather,
          };
          // Checks if data needs to be updated and if we need to make a new API call
          cachedData[cacheKey] = { data: newData, timestamp: now };
          return newData;
        });

        // We await our promises
        const data = await Promise.all(promises);
        // And set the new weather data
        setWeatherData(data);

        // Update the cache in localStorage
        localStorage.setItem("weatherData", JSON.stringify(cachedData));
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  // Weather icons mapping
  const weatherIcons = {
    0: "☀️", // Clear sky
    1: "🌤️", // Mainly clear
    2: "⛅", // Partly cloudy
    3: "☁️", // Overcast
    45: "🌫️", // Fog
    51: "🌦️", // Drizzle
    61: "🌧️", // Rain
    80: "🌧️", // Showers
    95: "⛈️", // Thunderstorm
  };

  return (
    <>
      <div className="container-sm">
        <h1>Your Weather Map</h1>
        <p>Updates Hourly</p>
      </div>
      <div className="container-sm">
        <MapContainer
          center={[53.4494762, -7.5029786]}
          zoom={7}
          className="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {weatherData.map((location) => (
            <Marker key={location.name} position={[location.lat, location.lon]}>
              <Popup>
                <h4>{location.name}</h4>
                <p>
                  {weatherIcons[location.weather.weathercode] || "❓"}{" "}
                  {Math.round(location.weather.temperature)}°C
                </p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}

export default Map;