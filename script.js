let xScale;
let yScale;
let temperaturePlotCanvas;

const altitudes = [];
const temperatures = [];
const pressures = [];
const densities = [];
const speedsOfSound = [];

const cachedAltitudes = [];
const cachedTemperatures = [];
const cachedPressures = [];
const cachedDensities = [];
const cachedSpeedsOfSound = [];

const constants = {
    b0: {
        h0: 0,                  //Troposphere
        lapseRate: 0.0065,
        exponent: 5.2558,
        T0: 288.15,
        P0: 101325,
        rho0: 1.225
    },
    b1: {                      //Tropopause, isothermal zone
        h1: 11000,
        T1: 216.65,
        P1: 22632.06,
        rho1: 0.36391
    },
    b2: {                      //Stratosphere 
        exponent: 34.1626,
        lapseRate: 0.001,
        h2: 20000,
        T2: 216.65,
        P2: 5474.89,
        rho2: 0.08803
    },
    b3: {                     //Stratosphere 
        exponent: 12.2009,
        lapseRate: 0.0028,
        h3: 32000,
        T3: 228.65,
        P3: 868.019,
        rho3: 0.01322
    },
    b4: {                    //Stratopause, isothermal zone
        h4: 47000,
        T4: 270.65,
        P4: 110.906,
        rho4: 0.00143
    },
    b5: {                    //Mesosphere
        exponent: 12.2009,
        lapseRate: -0.0028,
        h5: 51000,
        T5: 270.65,
        P5: 66.9389,
        rho5: 0.00086
    },
    b6: {                    //Mesosphere
        exponent: 17.0813,
        lapseRate: -0.002,
        h6: 71000,
        T6: 214.65,
        P6: 3.95642,
        rho6: 0.000064
    },
    b7: {                   //Thermosphere
        h7: 85000,
        T7: 187.15,
    }
}

//UNIVERSAL CONSTANTS -- these never change with altitude
const GRAVITY_ACCELERATION = 9.80665; // meters / second^2
const SPECIFIC_GAS_CONSTANT = 287.05; // Joule / (kilogram * Kelvin)
const SPECIFIC_HEAT_RATIO = 1.4; // Assume dry air
//const MOLAR_MASS_AIR = 0.0289644; // kg / mol  

function b0Temperature(altitude) {
    return constants.b0.T0 - constants.b0.lapseRate * (altitude - constants.b0.h0);
}

function b1Temperature() {
    return constants.b1.T1;
}

function b2Temperature(altitude) {
    return constants.b2.T2 + constants.b2.lapseRate * (altitude - constants.b2.h2);
}

function b3Temperature(altitude) {
    return constants.b3.T3 + constants.b3.lapseRate * (altitude - constants.b3.h3);
}

function b4Temperature() {
    return constants.b4.T4;
}

function b5Temperature(altitude) {
    return constants.b5.T5 + constants.b5.lapseRate * (altitude - constants.b5.h5);
}

function b6Temperature(altitude) {
    return constants.b6.T6 + constants.b6.lapseRate * (altitude - constants.b6.h6);
}

function b0Pressure(altitude) {
    return constants.b0.P0 * Math.pow((1 - ((constants.b0.lapseRate * altitude) / constants.b0.T0)), constants.b0.exponent);
}

function b1Pressure(altitude) {
    return constants.b1.P1 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b1.h1)) / (SPECIFIC_GAS_CONSTANT * constants.b1.T1));
}

function b2Pressure(altitude) {
    return constants.b2.P2 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b2.h2)) / (SPECIFIC_GAS_CONSTANT * constants.b2.T2));
}

function b3Pressure(altitude) {
    return constants.b3.P3 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b3.h3)) / (SPECIFIC_GAS_CONSTANT * constants.b3.T3));
}

function b4Pressure(altitude) {
    return constants.b4.P4 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b4.h4)) / (SPECIFIC_GAS_CONSTANT * constants.b4.T4));
}

function b5Pressure(altitude) {
    return constants.b5.P5 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b5.h5)) / (SPECIFIC_GAS_CONSTANT * constants.b5.T5));
}

function b6Pressure(altitude) {
    return constants.b6.P6 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b6.h6)) / (SPECIFIC_GAS_CONSTANT * constants.b6.T6));
}

function b0Density(altitude) {
    return b0Pressure(altitude) / (SPECIFIC_GAS_CONSTANT * b0Temperature(altitude));
}

function b1Density(altitude) {
    return constants.b1.rho1 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b1.h1)) / (SPECIFIC_GAS_CONSTANT * constants.b1.T1));
}

function b2Density(altitude) {
    return constants.b2.rho2 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b2.h2)) / (SPECIFIC_GAS_CONSTANT * constants.b2.T2));
}

function b3Density(altitude) {
    return constants.b3.rho3 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b3.h3)) / (SPECIFIC_GAS_CONSTANT * constants.b3.T3));
}

function b4Density(altitude) {
    return constants.b4.rho4 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b4.h4)) / (SPECIFIC_GAS_CONSTANT * constants.b4.T4));
}

function b5Density(altitude) {
    return constants.b5.rho5 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b5.h5)) / (SPECIFIC_GAS_CONSTANT * constants.b5.T5));
}

function b6Density(altitude) {
    return constants.b6.rho6 * Math.exp(-(GRAVITY_ACCELERATION * (altitude - constants.b6.h6)) / (SPECIFIC_GAS_CONSTANT * constants.b6.T6));
}

function sonicSpeed(currentTemperature) {
    return Math.sqrt(SPECIFIC_HEAT_RATIO * SPECIFIC_GAS_CONSTANT * currentTemperature);
}

function calculateSAM(altitude) {
    altitudes.length = 0;
    temperatures.length = 0;
    pressures.length = 0;
    densities.length = 0;
    speedsOfSound.length = 0;

    const stepSize = 1;
    let currentAltitude = 0;

    while (currentAltitude <= altitude) {
        let currentTemperature, currentPressure, currentDensity, currentSpeedOfSound;

        switch (true) {
            case currentAltitude <= constants.b1.h1:
                currentTemperature = b0Temperature(currentAltitude);
                currentPressure = b0Pressure(currentAltitude);
                currentDensity = b0Density(currentAltitude);
                break;

            case currentAltitude <= constants.b2.h2:
                currentTemperature = b1Temperature(currentAltitude);
                currentPressure = b1Pressure(currentAltitude);
                currentDensity = b1Density(currentAltitude);
                break;

            case currentAltitude <= constants.b3.h3:
                currentTemperature = b2Temperature(currentAltitude);
                currentPressure = b2Pressure(currentAltitude);
                currentDensity = b2Density(currentAltitude);
                break;

            case currentAltitude <= constants.b4.h4:
                currentTemperature = b3Temperature(currentAltitude);
                currentPressure = b3Pressure(currentAltitude);
                currentDensity = b3Density(currentAltitude);
                break;

            case currentAltitude <= constants.b5.h5:
                currentTemperature = b4Temperature(currentAltitude);
                currentPressure = b4Pressure(currentAltitude);
                currentDensity = b4Density(currentAltitude);
                break;

            case currentAltitude <= constants.b6.h6:
                currentTemperature = b5Temperature(currentAltitude);
                currentPressure = b5Pressure(currentAltitude);
                currentDensity = b5Density(currentAltitude);
                break;

            case currentAltitude <= constants.b7.h7:
                currentTemperature = b6Temperature(currentAltitude);
                currentPressure = b6Pressure(currentAltitude);
                currentDensity = b6Density(currentAltitude);
                break;
        }
        currentSpeedOfSound = sonicSpeed(currentTemperature);

        altitudes.push(currentAltitude);
        temperatures.push(currentTemperature);
        pressures.push(currentPressure);
        densities.push(currentDensity);
        speedsOfSound.push(currentSpeedOfSound);

        currentAltitude += stepSize;
    }

    document.getElementById("temperature").textContent = temperatures[temperatures.length - 1].toPrecision(6);
    document.getElementById("pressure").textContent = pressures[pressures.length - 1].toPrecision(6);
    document.getElementById("density").textContent = densities[densities.length - 1].toFixed(4);
    document.getElementById("speedOfSound").textContent = speedsOfSound[speedsOfSound.length - 1].toPrecision(6);

}

document.addEventListener("DOMContentLoaded", function () {

    calculateSAM(constants.b7.h7);

    cachedAltitudes.push(...altitudes);
    cachedTemperatures.push(...temperatures);
    cachedPressures.push(...pressures);
    cachedDensities.push(...densities);
    cachedSpeedsOfSound.push(...speedsOfSound);

    drawStaticPlot(altitudes, temperatures, "temperaturePlot");
    document.getElementById("temperature").textContent = "";
    document.getElementById("pressure").textContent = "";
    document.getElementById("density").textContent = "";
    document.getElementById("speedOfSound").textContent = "";
   
    const calculateButton = document.getElementById("calculateButton");
    calculateButton.addEventListener("click", handleCalculateButtonClick);
    temperaturePlotCanvas = document.getElementById("temperaturePlot");

    
    temperaturePlotCanvas.addEventListener('mousemove', function (event) {
        handleMouseover(event, temperaturePlotCanvas, altitudes, temperatures);
    });
    temperaturePlotCanvas.addEventListener('click', function (event) {
        handleCanvasClick(event, temperaturePlotCanvas, altitudes);
    });
});

function handleMouseover(event, canvas) {
   
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    
    y = Math.max(0, Math.min(y, canvas.height));

    const minAltitude = Math.min(...cachedAltitudes);
    const maxAltitude = Math.max(...cachedAltitudes);
    const altitude = Math.round(minAltitude + (maxAltitude - minAltitude) * (1 - y / canvas.height));

    
    document.getElementById("altitude").value = altitude;

    const index = Math.round((altitude - minAltitude) / (maxAltitude - minAltitude) * (cachedTemperatures.length - 1));

    document.getElementById("temperature").textContent = cachedTemperatures[index].toPrecision(6);
    document.getElementById("pressure").textContent = cachedPressures[index].toPrecision(6);
    document.getElementById("density").textContent = cachedDensities[index].toFixed(4);
    document.getElementById("speedOfSound").textContent = cachedSpeedsOfSound[index].toPrecision(6);
}

function handleCalculateButtonClick() {
    const altitudeInput = document.getElementById("altitude");
    const altitude = parseFloat(altitudeInput.value);

    if (isNaN(altitude) || altitude < 0 || altitude > constants.b7.h7) {
        alert("Altitude input must be in thermosphere range -- 0 to 85000 meters");
        return;
    }

    calculateSAM(altitude);

    const temperaturePlotCanvas = document.getElementById("temperaturePlot");

    const temperature = parseFloat(document.getElementById("temperature").textContent);
    if (isNaN(temperature)) {
        console.error("Invalid temperature value.");
        return;
    }

    drawRedMarker(temperaturePlotCanvas, temperature, altitude);
}

function drawStaticPlot(altitudes, temperatures, canvasId) {

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "blue";
    
    const maxAltitude = Math.max(...altitudes);
    const minAltitude = Math.min(...altitudes);
    const maxTemperature = Math.max(...temperatures);
    const minTemperature = Math.min(...temperatures);

    const xScale = canvas.width / (maxTemperature - minTemperature);
    const yScale = canvas.height / (maxAltitude - minAltitude);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 2; 
   
    altitudes.forEach((altitude, index) => {

        const x = (temperatures[index] - minTemperature) * xScale;
        const y = canvas.height - (altitude - minAltitude) * yScale;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();
    return {xScale, yScale};
}

function drawRedMarker(canvas, temperature, altitude) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStaticPlot(cachedAltitudes, cachedTemperatures, "temperaturePlot");

    const { xScale, yScale } = drawStaticPlot(cachedAltitudes, cachedTemperatures, "temperaturePlot");
    const x = (temperature - Math.min(...cachedTemperatures)) * xScale;
    const y = canvas.height - (altitude - Math.min(...cachedAltitudes)) * yScale;

    const lineLength = 20;
    const lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(x - lineLength / 2, y);
    ctx.lineTo(x + lineLength / 2, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y - lineLength / 2);
    ctx.lineTo(x, y + lineLength / 2);
    ctx.stroke();
}

function handleCanvasClick(event, canvas, altitudes) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    y = Math.max(0, Math.min(y, canvas.height));

    const minAltitude = Math.min(...cachedAltitudes);
    const maxAltitude = Math.max(...cachedAltitudes);
    const altitude = Math.round(minAltitude + (maxAltitude - minAltitude) * (1 - y / canvas.height));

    document.getElementById("altitude").value = altitude;
    const index = Math.round((altitude - minAltitude) / (maxAltitude - minAltitude) * (cachedTemperatures.length - 1));
    document.getElementById("temperature").textContent = cachedTemperatures[index].toPrecision(6);
    document.getElementById("pressure").textContent = cachedPressures[index].toPrecision(6);
    document.getElementById("density").textContent = cachedDensities[index].toFixed(4);
    document.getElementById("speedOfSound").textContent = cachedSpeedsOfSound[index].toPrecision(6);

    const temperature = parseFloat(document.getElementById("temperature").textContent);
    if (isNaN(temperature)) {
        console.error("Invalid temperature value.");
        return;
    }

    drawRedMarker(canvas, temperature, altitude);
}
