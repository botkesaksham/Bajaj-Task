import React, { useState } from 'react';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    setError(null); // Reset any previous errors
    try {
      const data = JSON.parse(jsonInput); // Parse JSON input
      const res = await fetch('https://bajaj-task-sakshambotke-ra2111008020027.up.railway.app/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const result = await res.json();
      setResponse(result);
    } catch (error) {
      setError('Error: Unable to fetch data. Please check your input and try again.');
      console.error('Error:', error);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const renderResponse = () => {
    if (!response) return null;
    if (response.is_success) {
      switch (selectedOption) {
        case 'Alphabets':
          return <div>Alphabets: {response.alphabets.join(', ')}</div>;
        case 'Numbers':
          return <div>Numbers: {response.numbers.join(', ')}</div>;
        case 'Highest alphabet':
          return <div>Highest Alphabet: {response.highest_alphabet.join(', ')}</div>;
        default:
          return null;
      }
    } else {
      return <div>Error: {response.error}</div>;
    }
  };

  return (
    <div className="App">
      <h1>Bajaj Finserv Health Dev Challenge</h1>
      <textarea
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='Enter JSON data here'
      />
      <button onClick={handleSubmit}>Submit</button>
      <div>
        <label>
          <input
            type="radio"
            value="Alphabets"
            checked={selectedOption === 'Alphabets'}
            onChange={handleOptionChange}
          />
          Alphabets
        </label>
        <label>
          <input
            type="radio"
            value="Numbers"
            checked={selectedOption === 'Numbers'}
            onChange={handleOptionChange}
          />
          Numbers
        </label>
        <label>
          <input
            type="radio"
            value="Highest alphabet"
            checked={selectedOption === 'Highest alphabet'}
            onChange={handleOptionChange}
          />
          Highest alphabet
        </label>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {renderResponse()}
    </div>
  );
}

export default App;
