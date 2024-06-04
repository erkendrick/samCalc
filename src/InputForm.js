// InputForm.js
import React, { useState } from 'react';
import { calculateAtmosphericProperties } from './AtmosphericCalculator.js';

function InputForm({ setResults, setAltitude }) {
    const [inputAltitude, setInputAltitude] = useState('');

    const handleInputChange = (e) => {
        setInputAltitude(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const altitude = Number(inputAltitude);
        const results = calculateAtmosphericProperties(altitude);
        setResults(results);
        setAltitude(altitude);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Altitude (0 to 85000 meters):
                <input
                    type="number"
                    value={inputAltitude}
                    onChange={handleInputChange}
                    min="0"
                    max="85000"
                />
            </label>
            <button type="submit">Calculate</button>
        </form>
    );
}

export default InputForm;
