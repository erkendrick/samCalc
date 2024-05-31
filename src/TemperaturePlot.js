import React, { useEffect, useRef } from 'react';

function TemperaturePlot({ altitude }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      
    }
  }, [altitude]);

  return (
    <div className="canvasContainer">
      <div className="yAxis">Altitude (m)</div>
      <div className="altitude-range-high">85 km</div>
      <div className="altitude-range-low">sea level</div>
      <canvas ref={canvasRef} width="300" height="400"></canvas>
      <div className="xAxis">Temperature (K)</div>
    </div>
  );
}

export default TemperaturePlot;