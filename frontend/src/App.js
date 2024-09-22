import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);

  // Options for the react-select dropdown
  const options = [
    { value: "alphabetic_values", label: "Alphabets" },
    { value: "numeric_values", label: "Numbers" },
    { value: "lowest_lowercase_alphabet", label: "Lowest Lowercase Alphabet" },
  ];

  // Handle textarea input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission and API call
  const handleSubmit = async () => {
    let inputData;
    try {
      // Validate and parse the JSON input
      inputData = JSON.parse(inputValue);
      if (
        !inputData ||
        typeof inputData !== "object" ||
        !Array.isArray(inputData.data)
      ) {
        throw new Error("Invalid format");
      }
      setError(null);
    } catch (err) {
      setError(
        'Invalid input format. Ensure the format is { "data": ["M", "1", "334", "4", "B"] }.'
      );
      setResponseData(null);
      return;
    }

    try {
      // Make API request to the backend
      const response = await axios.post(
        "https://sakshambotke-ra2111008020027.up.railway.app/bfhl", // Update API URL if needed
        inputData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponseData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError("Server error occurred.");
      setResponseData(null);
    }
  };

  // Filter the API response based on selected options
  const renderResponse = () => {
    if (!responseData) return null;

    const selectedKeys = selectedOptions.map((option) => option.value);
    const filteredResponse = Object.keys(responseData)
      .filter((key) => selectedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = responseData[key];
        return obj;
      }, {});

    return (
      <div className="w-full max-w-lg p-6 mt-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-center">Filtered Response</h3>
        {filteredResponse.numeric_values && (
          <p className="text-lg text-blue-600 mb-2">
            <strong>Numbers:</strong> {filteredResponse.numeric_values.join(", ")}
          </p>
        )}
        {filteredResponse.alphabetic_values && (
          <p className="text-lg text-blue-600 mb-2">
            <strong>Alphabets:</strong> {filteredResponse.alphabetic_values.join(", ")}
          </p>
        )}
        {filteredResponse.lowest_lowercase_alphabet && (
          <p className="text-lg text-blue-600">
            <strong>Lowest Lowercase Alphabet:</strong> {filteredResponse.lowest_lowercase_alphabet.join(", ")}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-400 to-blue-600 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          RA2111008020027 - Bajaj Fiserv Health Task
        </h1>
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          rows="6"
          placeholder='Enter JSON API input like {"data": ["A","B","C"]}'
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
        >
          Submit
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {responseData && (
          <>
            <div className="w-full mt-6">
              <Select
                options={options}
                isMulti
                onChange={(selected) => setSelectedOptions(selected)}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            {renderResponse()}
          </>
        )}
      </div>
      <footer className="mt-8 text-white text-sm">
        © 2024, Developed by Saksham Botke
      </footer>
    </div>
  );
};

export default App;
