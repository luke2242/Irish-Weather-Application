import { useState } from "react";
//Components
import DisplayWeather from "../components/DisplayWeather";
import Loading from "../components/Loading";
import Error from "../components/Error";

import "../stylesheets/App.css";

//search query has been inputed
//Users can input a language in english or irish
function Home() {
  //Stores an error if it occurs
  const [error, setError] = useState("");

  //Our API data for OpenWeatherMap Geocode API
  const [geoData, setGeoData] = useState([]);

  //Will hold the latitude of the location the user inputs
  const [latitude, setLatitude] = useState("");

  //Will hold the longitude of the location the user inputs
  const [longitude, setLongitude] = useState("");

  //Checks if data is still loading, initially set to false
  const [loading, setLoading] = useState(false);

  //Allows user to find the weather in their current location
  //We will be using the latitude and longitude variables for this
  const [searchLocation, setSearchLocation] = useState("");

  //Fetches the latitude and longitude from the user's location search
  async function fetchLocation() {
    //Uses a literal string so that we can use our searchLocation variable within the link
    //This API can only fetch locations within The Republic of Ireland (as indicated by "IE")
    const GeocodeAPI = `https://geocoding-api.open-meteo.com/v1/search?name=${searchLocation}&count=10&language=en&format=json&countryCode=IE
    `;

    try {
      //Start loading while API request is happening
      setLoading(true);

      //Waits for a response from our API
      const response = await fetch(GeocodeAPI);

      //Stores our API data within a JSON
      const json = await response.json();

      console.log(response.status);

      //Throw an error if the API doesn't return results
      if (json.results.length === 0) throw new Error("No results found.");

      const firstElement = json.results[0];

      //Sets the latitude and longitude of our location returned for the search result
      setLongitude(firstElement.longitude);
      setLatitude(firstElement.latitude);

      //Stores our json API data in geoData
      setGeoData(json);
      setGeoData(json.results);

      localStorage.setItem(
        "locationData",
        JSON.stringify({
          latitude: firstElement.latitude,
          longitude: firstElement.longitude,
          location: searchLocation,
        })
      );
    } catch (error) {
      //Catches an error if it occurs
      setError(error.message);
    } finally {
      //stop loading regardless of success or failure
      setLoading(false);
    }
  }

  //Handles our button press when the user wants to submit their search query
  function handleSubmitLocation(e) {
    e.preventDefault();
    //If there is no location inputted we will not fetch our API
    if (searchLocation.trim() !== "") {
      fetchLocation();
    }
  }
  //Stores the inputted search location and handles our search bar functionality
  function handleSearchLocation(e) {
    setSearchLocation(e.target.value);
  }

  //While waiting for data
  if (loading) {
    return <Loading />;
  }

  //If there’s an error, show the error UI
  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <div className="container-sm">
        <h1>Upcoming updates:</h1>
        <ul>
          <li>UI overhaul</li>
          <li>Rainfall Radar rework</li>
          <li>Firebase Deployment</li>
          <li>Bug Fixes</li>
          <li>Code changes for better performance and optimisation</li>
        </ul>
        <br />
      </div>
      <div className="container text-center">
        <form onSubmit={handleSubmitLocation}>
          <div className="row align-items-center">
            <div className="col">
              <input
                type="text"
                placeholder="Enter Location..."
                value={searchLocation}
                onChange={handleSearchLocation}
                className="form-control"
              />
            </div>
            <div className="col-auto">
              {/* Bootstrap button made by using the following documentation:
                  https://getbootstrap.com/docs/5.3/components/buttons/ */}
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Displays the weather if data is available */}
      {geoData.length > 0 && (
        <div>
          <DisplayWeather
            longFromParent={longitude}
            latFromParent={latitude}
            locationFromParent={searchLocation}
          />
        </div>
      )}
    </>
  );
}

export default Home;
