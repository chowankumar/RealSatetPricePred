import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [locations, setLocations] = useState([]);
  const [sqft, setSqft] = useState(1000);
  const [bhk, setBhk] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [location, setLocation] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");

  useEffect(() => {
    // Fetch locations on page load
    axios.get("http://127.0.0.1:5000/get_location_names").then((response) => {
      if (response.data) {
        setLocations(response.data.locations || []);
      }
    });
  }, []);

  const handleEstimatePrice = () => {
    axios
      .post("http://127.0.0.1:5000/predict_home_price", {
        total_sqft: parseFloat(sqft),
        bhk: parseInt(bhk),
        bath: parseInt(bathrooms),
        location,
      })
      .then((response) => {
        if (response.data) {
          setEstimatedPrice(`${response.data.estimated_price} Lakh`);
        }
      })
      .catch((error) => {
        console.error("Error estimating price:", error);
      });
  };

  return (
    <div>
      <div className="img"></div>
      <div className="form">
        <h2>Area (Square Feet)</h2>
        <input
          className="area"
          type="text"
          value={sqft}
          onChange={(e) => setSqft(e.target.value)}
        />

        <h2>BHK</h2>
        <div className="switch-field">
          {[1, 2, 3, 4, 5].map((value) => (
            <React.Fragment key={value}>
              <input
                type="radio"
                id={`radio-bhk-${value}`}
                name="uiBHK"
                value={value}
                checked={bhk === value}
                onChange={() => setBhk(value)}
              />
              <label htmlFor={`radio-bhk-${value}`}>{value}</label>
            </React.Fragment>
          ))}
        </div>

        <h2>Bath</h2>
        <div className="switch-field">
          {[1, 2, 3, 4, 5].map((value) => (
            <React.Fragment key={value}>
              <input
                type="radio"
                id={`radio-bath-${value}`}
                name="uiBathrooms"
                value={value}
                checked={bathrooms === value}
                onChange={() => setBathrooms(value)}
              />
              <label htmlFor={`radio-bath-${value}`}>{value}</label>
            </React.Fragment>
          ))}
        </div>

        <h2>Location</h2>
        <select
          className="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="" disabled>
            Choose a Location
          </option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <button className="submit" onClick={handleEstimatePrice}>
          Estimate Price
        </button>

        {estimatedPrice && <div className="result"><h2>{estimatedPrice}</h2></div>}
      </div>
    </div>
  );
};

export default App;
