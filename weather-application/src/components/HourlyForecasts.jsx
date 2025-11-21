import { useEffect, useState } from "react";
import ForecastIcons from "./ForecastIcons";
import axios from "axios";
import Loading from "./Loading";
import Error from "./Error";
import "../stylesheets/HourlyForecast.css";


function HourlyForecasts(){
  //Sets our houly forecasts, initially null
  const [forecastData, setForecastData] = useState(null);

  //Sets our loading state, initially false
  const [loading, setLoading] = useState(false);

  //Our default location, Dublin in this case
  const defaultLatitude = 53.35014;
  const defaultLongitude = -6.266155;
  const defaultLocation = "Dublin";
  
  //Our errors, initially empty string
  const [error, setError] = useState("");

  //Retrieve location data from localStorage
  let locationData = JSON.parse(localStorage.getItem("locationData"));
  console.log("Retrieved Location Data:", locationData);

  //If the location data is empty we set it to the default location and store it in our local storage
  if (!locationData || !locationData.latitude || !locationData.longitude || !locationData.location) {
    locationData = {
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      location: defaultLocation,
    };
    localStorage.setItem("locationData", JSON.stringify(locationData));
    console.log("Default location saved to localStorage:", locationData);
  }

  //Holds our location data from the inputed location
  const latitude = locationData.latitude;
  const longitude = locationData.longitude;
  const searchLocation = locationData.location;
  

  //Fetchs our hourly forecast
  const fetchHourlyForecast = async (latitude, longitude) => {
    //Error handling if there is not latitude or longitude
    if (!latitude || !longitude) {
      setError("Invalid location. Please try again.");
      return;
    }

    //Our API
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,weathercode,wind_speed_10m&timezone=auto`;

    //Tries to get a response from the API
    try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        //Sets our hourly data
        const hourlyData = response.data.hourly;
      
        //Gets the correct time
        const currentTimeISO = new Date().toISOString();

        //Starts the index at our current time
        const startIndex = hourlyData.time.findIndex((time) => time >= currentTimeISO);
        
        //Filters our data by using the slice function
        const filteredData = {
          time: hourlyData.time.slice(startIndex, startIndex + 24),
          temperature_2m: hourlyData.temperature_2m.slice(startIndex, startIndex + 24),
          precipitation_probability: hourlyData.precipitation_probability.slice(startIndex, startIndex + 24),
          precipitation: hourlyData.precipitation.slice(startIndex, startIndex + 24),
          weathercode: hourlyData.weathercode.slice(startIndex, startIndex + 24),
          wind_speed_10m: hourlyData.wind_speed_10m.slice(startIndex, startIndex + 24),
        };
        
      
        setForecastData(filteredData);
        setLoading(false);
        //Catches an error if it occurs and stops loading
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

  //Calls our hourly forecast function and requires the latitude and longitude in order to work
  useEffect(() => {
    fetchHourlyForecast(latitude, longitude);
  }, [latitude, longitude]);

  //Loading screen if loading true
  if (loading) {
    return <Loading />;
  }

  //Error screen, if it occurs
  if (error) {
    return <Error error={error} />;
  }

  //Returns our hourly weather information and calls our forecastIcon's component to format the information
  return (
          
      <div className="container">
        <div className="container-sm">
          <h1>Your Hourly Forecast for {searchLocation}</h1>
          <p>Shows hourly forecast data</p>
        </div>

        <div className="container-xl">
        <div className="row">
          {forecastData &&
            forecastData.time.map((time, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-2 mb-3">
                <div className="forecast-item rounded p-2 text-center h-100">
                  <ForecastIcons
                    time={time}
                    temperature={forecastData.temperature_2m[index]}
                    rain={forecastData.precipitation_probability[index]}
                    precipitationProbability={forecastData.precipitation_probability[index]}
                    precipitationAmount={forecastData.precipitation[index]}
                    weatherCode={forecastData.weathercode[index]}
                    wind={forecastData.wind_speed_10m[index]}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      </div>
    );

}
export default HourlyForecasts;