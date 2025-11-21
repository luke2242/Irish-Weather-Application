import { useState, useEffect } from "react";
import "../stylesheets/DisplayWeather.css";
import Loading from "./Loading";
import ForecastIcons from "./ForecastIcons";

function DisplayWeather(props) {
  //Sets current temperature
  const [currentTemp, setCurrentTemp] = useState(null);

  //Our API data for OpenMeteo Weather API
  const [data, setData] = useState([]);

  // Error Check for OpenMeteo Weather API
  const [error, setError] = useState(null);

  // Checks if data is still loading, initially set to false
  const [loading, setLoading] = useState(false);

  //Will check if it is raining, initially set to false
  const [isRaining, setIsRaining] = useState(false);

  //Stores our rain precipitation, initially null
  const [raining, setRaining] = useState(null);

  //Will check and store the hourly chance of rain, initially null
  const [rainChance, setRainChance] = useState(null);

  //Stores our wind gust speed, initially
  const [windGusts, setWindGust] = useState(null);

  //Stores our wind speed, initially null
  const [windSpeed, setWindSpeed] = useState(null);

  //Stores our cloud coverage percentage, initially null
  const [cloudCover, setCloudCover] = useState(null);

  //This state will allow us to check our current weather and change the css based on it
  const [weatherCondition, setWeatherCondition] = useState("normal");

  //Will store the value which checks if it is day or night from our API, initially null
  //Our API returns only 2 values for day and night which are 0(night) and 1(day), it acts similary to a boolean variable
  const [isDay, setIsDay] = useState(null);

  //Sets our daily forecast
  const [dailyForecast, setDailyForecast] = useState([]);

  useEffect(() => {
    /*Reference: https://youtu.be/YmpWOTT2qdw?si=kIrOpPKq5tfod13g
    There was an issue initially where the API was being called infinitely due to an issue with useEffect.
    This code fixes it by using a const for fetch weather which goes into an async arrow function*/
    const fetchWeather = async () => {
      const weatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${props.latFromParent}&longitude=${props.longFromParent}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=precipitation_probability,visibility&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,weathercode&timezone=auto`;

      try {
        setLoading(true);
        const response1 = await fetch(weatherAPI);
        const json1 = await response1.json();
        setCurrentTemp(json1.current.temperature_2m);
        setData(json1);
        setCloudCover(json1.current.cloud_cover);
        setWindGust(json1.current.wind_gusts_10m);
        setWindSpeed(json1.current.wind_speed_10m);
        setCloudCover(json1.current.cloud_cover);
        setIsDay(json1.current.is_day);
        setRaining(json1.current.rain);
        setRainChance(json1.hourly.precipitation_probability[0]);

        const today = new Date().toISOString().split("T")[0];
        const startIndex = json1.daily.time.findIndex((date) => date >= today);
        const filteredDailyForecast = {
          time: json1.daily.time.slice(startIndex),
          temperature_2m_max: json1.daily.temperature_2m_max.slice(startIndex),
          temperature_2m_min: json1.daily.temperature_2m_min.slice(startIndex),
          precipitation_sum: json1.daily.precipitation_sum.slice(startIndex),
          weathercode: json1.daily.weathercode.slice(startIndex),
        };

        setDailyForecast(filteredDailyForecast);

        if (json1.current.rain > 0) {
          setIsRaining(true);
        }

        if (json1.current.precipitation > 0) {
          setWeatherCondition("rain");
        } else if (json1.current.cloud_cover > 70) {
          setWeatherCondition("cloudy");
        } else if (json1.current.temperature_2m > 10) {
          setWeatherCondition("warm");
        } else if (json1.current.temperature_2m <= 10) {
          setWeatherCondition("cold");
        } else {
          setWeatherCondition("normal");
        }

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    // Fetch Weather will only be called if lat and long are valid
    /* This if statement also ensures that an infinite loop won't occur. If there is
    this code is removed it will keep calling the OpenMeteo API infinitely. Please do
    not remove this code*/
    if (props.latFromParent && props.longFromParent) {
      fetchWeather();
    }
  }, [props.latFromParent, props.longFromParent]);

  //Will change our colors based on the weather condition
  useEffect(() => {
    document.body.className = weatherCondition;

    //Reset the body class when the component unmounts
    return () => {
      document.body.className = "";
    };
  }, [weatherCondition]);

  if (loading) {
    return <Loading />;
  } 
  
  if (error) {
    return <h1 className="container-md">⚠️ An error has occured {error}</h1>;
  }
  
    return (
      <>
        <div className="container-sm">
          <h2>Current Weather in {props.locationFromParent}</h2>
          <br className="br" />
          <CheckCurrentTemp currentTempFromParent={currentTemp} />
          <br />
 
            {isRaining ? <h4>Raining outside🌧️</h4> : null} <h4>Precipitation:{" "}
            {raining}mm{" "}</h4>

          <h4>Chance of Rain {rainChance}% (Updated Hourly)</h4>
          <CheckCloudCover
            cloudCoverFromParent={cloudCover}
            isDayFromParent={isDay}
          />
          <br />
          <h4>Wind Speed: {Math.round(windSpeed)}km/h </h4>
          <h4>Wind Gusts: {Math.round(windGusts)}km/h</h4>
        </div>
        <br />
        <div className="container-sm">
          <h3>7-Day Forecast</h3>
          {dailyForecast.time?.map((date, index) => (
            <ForecastIcons
              key={index}
              date={date}
              minTemp={dailyForecast.temperature_2m_min[index]}
              maxTemp={dailyForecast.temperature_2m_max[index]}
              rain={dailyForecast.precipitation_sum[index]}
              weatherCode={dailyForecast.weathercode[index]}
            />
          ))}
        </div>
      </>
    );
}

//Checks if there is cloud coverage in the location
//Cloud coverage in OpenMeteo's API is measured by percentage
//In the function below there are 4 main checks for cloud coverage
function CheckCloudCover(props) {
  //Cloud coverage is higher than 70%
  if (props.cloudCoverFromParent > 70) {
    return <h3>Very cloudy ☁️</h3>;
    //Cloud coverage is higher than 50%
  } else if (props.cloudCoverFromParent > 50) {
    return <h3>Moderately cloudy ☁️</h3>;
    //Cloud coverage is higher 20% during daytime
  } else if (props.cloudCoverFromParent > 20 && props.isDayFromParent == 1) {
    return <h3>Slightly cloudy ⛅</h3>;
    //Cloud coverage is higher than 20% during nighttime
  } else if (props.cloudCoverFromParent > 20 && props.isDayFromParent == 0) {
    return <h3>Slightly cloudy ☁️</h3>;
    //Cloud coverage is greater than or equal to 0% during daytime
  } else if (props.cloudCoverFromParent >= 0 && props.isDayFromParent == 1) {
    return <h3>Clear skies ☀️</h3>;
    //Cloud coverage is greater than or equal to 0% during daytime
  } else if (props.cloudCoverFromParent >= 0 && props.isDayFromParent == 0) {
    return <h3>Clear skies 🌙</h3>;
    //Returns an error if cloud data is unavailable
  } else {
    //If data is unavailable for any reason, this will return. For example: our API calls may have ran out and our data won't display
    return (
      <h3>Unable to display current cloud data. Please try again soon.</h3>
    );
  }
}

//Checks the current temperature outside and returns information based on the current temp
function CheckCurrentTemp(props) {
  //Checks if current temperature is greater than 30
  if (props.currentTempFromParent > 30) {
    return (
      <>
        <h4>
          Current Temperature: {Math.round(props.currentTempFromParent)}°C
        </h4>
        <h4>Very hot outside ☀️. Please avoid staying out too long ⚠️</h4>
      </>
    );
    //Checks if currentTemp is greater than 20
  } else if (props.currentTempFromParent > 20) {
    return (
      <>
        <h4>
          Current Temperature: {Math.round(props.currentTempFromParent)}°C
        </h4>
        <h4>Warm outside ☀️</h4>;
      </>
    );
    //Checks if current temp is greater than 10
  } else if (props.currentTempFromParent > 10) {
    return (
      <>
        <h4>
          Current Temperature: {Math.round(props.currentTempFromParent)}°C
        </h4>
        <h4>Mild outside ☀️</h4>
      </>
    );
    //Checks if current temp is greater than 0
  } else if (props.currentTempFromParent > 0) {
    return (
      <>
        <h4>
          Current Temperature: {Math.round(props.currentTempFromParent)}°C
        </h4>
        <h4>Cold outside ❄️</h4>
      </>
    );
    //Checks if current temp is greater than -10
  } else if (props.currentTempFromParent > -10) {
    return (
      <>
        <h4>
          Current Temperature: {Math.round(props.currentTempFromParent)}°C
        </h4>
        <h4>Freezing outside ❄️. Watch out for ice if travelling ⚠️</h4>
      </>
    );
    //If data is unavailable for any reason, this will return. For example: our API calls may have ran out and our data won't display
  } else {
    return (
      <h4>
        Unable to display Current Temperature Data. Please Try again soon.
      </h4>
    );
  }
}

export default DisplayWeather;
