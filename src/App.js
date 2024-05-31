import React, { useState } from 'react';
import InputForm from './InputForm';
import DisplayResults from './DisplayResults';
import './App.css';

function App() {
  const [results, setResults] = useState({
    temperature: null,
    pressure: null,
    density: null,
    speedOfSound: null
  });

  return (
    <div className="App-container">
      <h1>Atmospheric Calculator</h1>
      <InputForm setResults={setResults} />
      <DisplayResults results={results} />
    </div>
  );
}

export default App;
