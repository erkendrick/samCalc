import React, { useState } from 'react';
import InputForm from './InputForm';
import DisplayResults from './DisplayResults';
import TemperaturePlot from './TemperaturePlot';
import './App.css';

function App() {
    const [results, setResults] = useState({
        temperature: null,
        pressure: null,
        density: null,
        speedOfSound: null,
    });
    const [altitude, setAltitude] = useState(null);

    return (
        <div className="App-container">
            <h1>Standard Atmosphere Calculator</h1>
            <InputForm setResults={setResults} setAltitude={setAltitude} />
            <DisplayResults results={results} />
            <TemperaturePlot altitude={altitude} setResults={setResults} />
        </div>
    );
}

export default App;
