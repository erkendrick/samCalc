import React, { useState } from 'react';
import { calculateAtmosphericProperties } from './AtmosphericCalculator.js';

function InputForm({ setResults }) {
  const [altitude, setAltitude] = useState('');

  const handleInputChange = (e) => {
    setAltitude(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = calculateAtmosphericProperties(Number(altitude));
    setResults(results);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Altitude (0 to 85000 meters):
        <input
          type="number"
          value={altitude}
          onChange={handleInputChange}
          min="0"
          max="85000"
        />
      <button type="submit">Calculate</button>
      </label>
    </form>
  );
}

export default InputForm;