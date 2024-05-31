export const constants = {
    g: 9.80665,  // gravitational acceleration (m/s^2)
    R_specific: 287.05, // specific gas constant for air (J/(kg·K))
    gamma: 1.4 // adiabatic index for air
};

export const atmosphericLayers = [
    {
        maxAltitude: 11000,
        temperature: (h) => 288.15 - 0.0065 * h,
        pressure: (h, T) => 101325 * Math.pow((1 - (0.0065 * h / 288.15)), 5.2558),
        density: (P, T) => P / (constants.R_specific * T)
    },
    {
        maxAltitude: 20000,
        temperature: () => 216.65,
        pressure: (h, T) => 22632.06 * Math.exp(-constants.g * (h - 11000) / (constants.R_specific * T)),
        density: (h, T) => 0.36391 * Math.exp(-constants.g * (h - 11000) / (constants.R_specific * T))
    },
    {
        maxAltitude: 32000,
        temperature: (h) => 216.65 + 0.001 * (h - 20000),
        pressure: (h, T) => 5474.89 * Math.pow((T / 216.65), (-constants.g / (constants.R_specific * 0.001))),
        density: (P, T) => P / (constants.R_specific * T)
    },
    {
        maxAltitude: 47000,
        temperature: (h) => 228.65 + 0.0028 * (h - 32000),
        pressure: (h, T) => 868.02 * Math.pow((T / 228.65), (-constants.g / (constants.R_specific * 0.0028))),
        density: (P, T) => P / (constants.R_specific * T)
    },
    {
        maxAltitude: 51000,
        temperature: () => 270.65,
        pressure: (h, T) => 110.906 * Math.exp(-constants.g * (h - 47000) / (constants.R_specific * T)),
        density: (P, T) => P / (constants.R_specific * T)
    },
    {
        maxAltitude: 71000,
        temperature: (h) => 270.65 - 0.0028 * (h - 51000),
        pressure: (h, T) => 66.9389 * Math.pow((T / 270.65), (-constants.g / (constants.R_specific * -0.0028))),
        density: (P, T) => P / (constants.R_specific * T)
    },
    {
        maxAltitude: 85000,
        temperature: (h) => 214.65 - 0.002 * (h - 71000),
        pressure: (h, T) => 3.95642 * Math.pow((T / 214.65), (-constants.g / (constants.R_specific * -0.002))),
        density: (P, T) => P / (constants.R_specific * T)
    }
];

export const selectLayer = (altitude) => {
    for (let layer of atmosphericLayers) {
        if (altitude <= layer.maxAltitude) {
            return layer;
        }
    }
    throw new Error('Altitude is above the maximum handled by this model.');
};

export const calculateAtmosphericProperties = (altitude) => {
    const layer = selectLayer(altitude);
    const temperature = layer.temperature(altitude);
    const pressure = layer.pressure(altitude, temperature);
    const density = layer.density(pressure, temperature);

    return {
        temperature,
        pressure,
        density,
        speedOfSound: Math.sqrt(constants.gamma * constants.R_specific * temperature)
    };
};