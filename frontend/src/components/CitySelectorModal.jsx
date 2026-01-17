import React, { useState, useRef, useEffect } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useAppContext } from "../../context/AppContext";

const popularCities = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];

const CitySelectorModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationError, setLocationError] = useState(null);
  const modalRef = useRef();

  const {  setSelectedCity } = useAppContext();

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=3e144cb25204405dac799093f6e4b6ba`
          );
          const data = await res.json();
          const city =
            data.results[0].components.city ||
            data.results[0].components.town ||
            data.results[0].components.village ||
            data.results[0].components.state_district ||
            "Unknown";
          setSelectedCity(city);
          onClose();
        } catch (err) {
          setLocationError("Failed to fetch city from coordinates.");
        }
      },
      () => {
        setLocationError("Permission denied or unavailable.");
      }
    );
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    onClose(); // Close the modal after selecting a city
  };

  const handleSubmit = () => {
    if (searchTerm.trim()) {
      handleCitySelect(searchTerm.trim());
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-6 w-[90%] sm:max-w-[80%] space-y-6"
        ref={modalRef}
      >
        <h2 className="text-2xl font-bold text-center">Choose Your City</h2>

        <div>
          <input
            type="text"
            placeholder="Search for a city..."
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 text-black focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={detectLocation}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 flex items-center gap-2 mx-auto"
          >
            <FaLocationCrosshairs /> Detect My Location
          </button>
          {locationError && (
            <p className="text-red-500 mt-2">{locationError}</p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Popular Cities
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularCities.map((city) => (
              <button
                key={city}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full"
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelectorModal;
