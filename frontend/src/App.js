import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      let inputData;
      try {
        inputData = JSON.parse(inputValue);
      } catch {
        inputData = { data: inputValue.split(",").map((item) => item.trim()) };
      }

      const response = await axios.post(
        "https://bajaj-task-sakshambotke-ra2111008020027.up.railway.app/bfhl",
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
      setError("Invalid input or server error");
      setResponseData(null);
    }
  };

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
      <div className="w-full max-w-md p-4 mt-4 bg-gray-100 rounded">
        <h3 className="font-bold">Filtered Response</h3>
        {filteredResponse.numbers && (
          <p>Numbers: {filteredResponse.numbers.join(",")}</p>
        )}
        {filteredResponse.alphabets && (
          <p>Alphabets: {filteredResponse.alphabets.join(",")}</p>
        )}
        {filteredResponse.highest_alphabet && (
          <p>Highest Alphabet: {filteredResponse.highest_alphabet.join(",")}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="mb-4 text-4xl font-bold">RA2111008020027</h1>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        rows="10"
        cols="50"
        placeholder='Enter JSON API INPUT like {"data": ["A","B","C"]}'
        className="w-full max-w-md p-2 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="w-full max-w-md px-4 py-2 mt-4 text-white bg-blue-500 hover:bg-blue-700 rounded"
      >
        Submit
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {responseData && (
        <>
          <div className="w-full max-w-md mt-4">
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
      <div className="w-full max-w-md border-t-4 border-blue-500 mt-4"></div>
    </div>
  );
};

export default App;
