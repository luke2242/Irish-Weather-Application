import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Error from "./components/Error";
import HourlyForecasts from "./components/HourlyForecasts";
import Map from "./pages/Map";
import WeatherWarnings from "./pages/WeatherWarnings";
import Updates from "./pages/Updates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//Sets up our react router and renders our header and footer on every page
function App() {

  // Initialises react query
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Error />} />
            <Route path="/hourly" element={<HourlyForecasts />} />
            <Route path="/map" element={<Map />} />
            <Route path="updates" element={<Updates />} />
            <Route path="weatherwarnings" element={<WeatherWarnings />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
            <footer>
        <p>
          This weather app only accepts locations within the Republic of
          Ireland.
        </p>
        <p>
          NOTE: This weather app is limited to a certain number of API calls per
          hour. If the App suddenly stops working, it means the API call limit
          has been reached.
        </p>
        <p>
          All Weather and Geocode data provided by{" "}
          <a href="https://open-meteo.com/">OpenMeteo</a>.
          Weather Warnings, Advisories and other weather data was provided by{" "}
          <a href="https://www.met.ie/">Met Eireann</a>.
        </p>
      </footer>
    </>
  );
}

export default App;
