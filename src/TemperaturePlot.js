import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { selectLayer, calculateAtmosphericProperties, atmosphericLayers } from './AtmosphericCalculator';

const TemperaturePlot = ({ altitude, setResults }) => {
    const [data, setData] = useState([]);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        const generateData = () => {
            const data = [];
            for (let i = 0; i <= 85000; i += 100) {
                const layer = selectLayer(i);
                const temperature = layer.temperature(i);
                if (!isNaN(temperature)) {
                    data.push({
                        altitude: i,
                        temperature,
                    });
                }
            }
            return data;
        };
        setData(generateData());
    }, []);

    useEffect(() => {
        if (altitude !== null) {
            const results = calculateAtmosphericProperties(altitude);
            setMarker({ altitude, temperature: results.temperature });
            setResults(results);
        }
    }, [altitude, setResults]);

    const handleMouseMove = (e) => {
      if (e && e.chartY !== undefined) {
          const yCoord = e.chartY;
          const chartHeight = e.chartHeight || 600;
          const yValue = (1 - yCoord / chartHeight) * 85000;
          const clampedYValue = Math.max(0, Math.min(yValue, 85000));
          const closestAltitude = Math.round(clampedYValue / 100) * 100;
          const results = calculateAtmosphericProperties(closestAltitude);
          setResults(results);
          setMarker({ altitude: closestAltitude, temperature: results.temperature });
      }
  };

    const yTicks = atmosphericLayers.map(layer => layer.maxAltitude);

    return (
        <ResponsiveContainer width="66%" height={600} className="chart-container">
            <LineChart
                data={data}
                onMouseMove={handleMouseMove}
                margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    dataKey="temperature"
                    name="Temperature"
                    unit="K"
                    domain={['dataMin', 'dataMax']}
                />
                <YAxis
                    type="number"
                    dataKey="altitude"
                    name="Altitude"
                    unit="m"
                    domain={[0, 85000]}
                    ticks={yTicks}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="altitude" stroke="#8884d8" strokeWidth={5} dot={false} />
                {marker && (
                    <ReferenceDot x={marker.temperature} y={marker.altitude} r={5} fill="red" stroke="none" />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TemperaturePlot;
