import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
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
            setResults(results);
            const correspondingPoint = data.find(point => point.altitude === altitude);
            if (correspondingPoint) {
                setMarker(correspondingPoint);
            } else {
                setMarker(null);
            }
        }
    }, [altitude, setResults, data]);

    const handleMouseMove = (e) => {
        if (e && e.activePayload && e.activePayload.length > 0) {
            const { altitude: hoveredAltitude } = e.activePayload[0].payload;
            const results = calculateAtmosphericProperties(hoveredAltitude);
            setResults(results);
        }
    };

    const yTicks = atmosphericLayers.map(layer => layer.maxAltitude);

    return (
        <ResponsiveContainer width="66%" height={600} className="chart-container">
            <LineChart
                data={data}
                margin={{ top: 50, right: 30, left: 50, bottom: 10 }}
                onMouseMove={handleMouseMove}
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
                <Line type="monotone" dataKey="altitude" stroke="#8884d8" strokeWidth={5} dot={false} />
                {marker && (
                    <>
                        <ReferenceLine x={marker.temperature} stroke="red" strokeDasharray="3 3" />
                        <ReferenceLine y={marker.altitude} stroke="red" strokeDasharray="3 3" />
                    </>
                )}
                <text x="50%" y="20" textAnchor="middle" dominantBaseline="hanging" fontSize="18" fontWeight="bold">
                    Temperature [K] vs. Altitude [m]
                </text>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TemperaturePlot;
