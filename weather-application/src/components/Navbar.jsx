
import "../stylesheets/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="container-fluid">
          <h2 className="Header">Irish Weather Application</h2>
          <div>
            <Link to="/" className="navlink">
              Home
            </Link>
            {" "}
            <Link to="hourly" className="navlink">
              Hourly Forecasts
            </Link>
            {" "}
            <Link to="/map" className="navlink">
              Map
            </Link>
            {" "}
            <Link to="/updates" className="navlink">
              Updates
            </Link>
            {" "}
            <Link to="/weatherwarnings" className="navlink">
              Warnings
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
