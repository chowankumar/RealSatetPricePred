import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [locations, setLocations] = useState([]);
  const [sqft, setSqft] = useState(1000);
  const [bhk, setBhk] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [location, setLocation] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");

  useEffect(() => {
    
    axios.get("http://127.0.0.1:8000/get_location_names").then((response) => {
      if (response.data) {
        setLocations(response.data.locations || []);
      }
    });
  }, []);

  const handleEstimatePrice = () => {
    axios
      .post("http://127.0.0.1:8000/predict_home_price", {
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
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-500 text-white p-4">
        <h1 className="text-3xl font-semibold">54 Malhani Real Estate Analyzer</h1>
      </nav>

      {/* Content */}
      <div className="flex justify-center items-center my-10">
        <div className="bg-white shadow-xl p-6 w-full max-w-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Enter Details</h2>
          
          <div className="mb-4">
            <label className="block text-lg">Area (Square Feet)</label>
            <input
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
              type="text"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg">BHK</label>
            <div className="flex space-x-4 mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <React.Fragment key={value}>
                  <input
                    type="radio"
                    id={`radio-bhk-${value}`}
                    name="uiBHK"
                    value={value}
                    checked={bhk === value}
                    onChange={() => setBhk(value)}
                    className="form-radio"
                  />
                  <label htmlFor={`radio-bhk-${value}`} className="text-lg">{value}</label>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-lg">Bathrooms</label>
            <div className="flex space-x-4 mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <React.Fragment key={value}>
                  <input
                    type="radio"
                    id={`radio-bath-${value}`}
                    name="uiBathrooms"
                    value={value}
                    checked={bathrooms === value}
                    onChange={() => setBathrooms(value)}
                    className="form-radio"
                  />
                  <label htmlFor={`radio-bath-${value}`} className="text-lg">{value}</label>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-lg">Location</label>
            <select
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
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
          </div>

          <button
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            onClick={handleEstimatePrice}
          >
            Estimate Price
          </button>

          {estimatedPrice && (
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold">{estimatedPrice}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
