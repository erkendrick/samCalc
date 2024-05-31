import React from 'react';

function DisplayResults({ results }) {
  const { temperature, pressure, density, speedOfSound } = results;
  
  return (
    <div>
      <p>Temperature: {temperature ? `${parseFloat(temperature).toFixed(3)} K` : '-'}</p>
      <p>Pressure: {pressure ? `${parseFloat(pressure).toFixed(3)} Pa` : '-'}</p>
      <p>Density: {density ? `${parseFloat(density).toFixed(3)} kg/m³` : '-'}</p>
      <p>Speed of Sound: {speedOfSound ? `${parseFloat(speedOfSound).toFixed(3)} m/s` : '-'}</p>
    </div>
  );
}

export default DisplayResults;
