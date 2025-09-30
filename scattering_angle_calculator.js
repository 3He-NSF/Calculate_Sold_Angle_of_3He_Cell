class ScatteringAngleCalculator {
    constructor(cellLength = 80, cellWidth = 42, coilLength = 300, coilWidth = 200, detectorWidth = 256) {
        this.cellLength = cellLength;
        this.cellWidth = cellWidth;
        this.coilLength = coilLength;
        this.coilWidth = coilWidth;
        this.detectorWidth = detectorWidth;
    }

    calculateAngles(cellPositionX, sampleWidth) {
        // Calculate scattering angle from the sample (in radians)
        const scatteringangle = Math.atan((this.cellWidth/2 - sampleWidth/2) / (cellPositionX + this.cellLength/2));
        return {
            scatteringangle: scatteringangle
        };
    }

    calculateDetectorWidth(cellPositionX, detectorPositionX, sampleWidth) {
        // サンプル上端→セル右上端→検出器端
        const sampleEdgeX_top = 0;
        const sampleEdgeY_top = sampleWidth / 2;
        const cellEdgeX_top = cellPositionX + this.cellLength / 2;
        const cellEdgeY_top = this.cellWidth / 2;
        const theta_top = Math.atan2(cellEdgeY_top - sampleEdgeY_top, cellEdgeX_top - sampleEdgeX_top);
        const detectorEdgeY_top = sampleEdgeY_top + (detectorPositionX - sampleEdgeX_top) * Math.tan(theta_top);

        // サンプル下端→セル右下端→検出器端
        const sampleEdgeX_bottom = 0;
        const sampleEdgeY_bottom = -sampleWidth / 2;
        const cellEdgeX_bottom = cellPositionX + this.cellLength / 2;
        const cellEdgeY_bottom = -this.cellWidth / 2;
        const theta_2 = Math.atan2(cellEdgeY_bottom - sampleEdgeY_bottom, cellEdgeX_bottom - sampleEdgeX_bottom);
        const detectorEdgeY_2 = sampleEdgeY_bottom + (detectorPositionX - sampleEdgeX_bottom) * Math.tan(theta_2);

        // 検出器での幅
        return Math.abs(detectorEdgeY_top - detectorEdgeY_2);
    }

    plotCoverage(cellPositionX, cellPositionY, detectorPositionX, sampleWidth, showLegend = true) {
        const angles = this.calculateAngles(cellPositionX, sampleWidth);
        const detectorCoverage = this.calculateDetectorWidth(cellPositionX, detectorPositionX, sampleWidth);

        // Sample vertices
        const sampleVertices = [
            [0, -sampleWidth/2],
            [0, sampleWidth/2]
        ];

        // Cell vertices
        const cellVertices = [
            [cellPositionX - this.cellLength/2, cellPositionY - this.cellWidth/2],
            [cellPositionX + this.cellLength/2, cellPositionY - this.cellWidth/2],
            [cellPositionX + this.cellLength/2, cellPositionY + this.cellWidth/2],
            [cellPositionX - this.cellLength/2, cellPositionY + this.cellWidth/2],
            [cellPositionX - this.cellLength/2, cellPositionY - this.cellWidth/2]
        ];

        // Coil vertices
        const coilVertices = [
            [cellPositionX - this.coilLength/2, cellPositionY - this.coilWidth/2],
            [cellPositionX + this.coilLength/2, cellPositionY - this.coilWidth/2],
            [cellPositionX + this.coilLength/2, cellPositionY + this.coilWidth/2],
            [cellPositionX - this.coilLength/2, cellPositionY + this.coilWidth/2],
            [cellPositionX - this.coilLength/2, cellPositionY - this.coilWidth/2]
        ];

        // Detector vertices
        const detectorVertices = [
            [detectorPositionX, 0],
            [detectorPositionX + 1, 0],
            [detectorPositionX + 1, this.detectorWidth/2],
            [detectorPositionX, this.detectorWidth/2],
            [detectorPositionX, 0],
            [detectorPositionX, -this.detectorWidth/2],
            [detectorPositionX + 1, -this.detectorWidth/2],
            [detectorPositionX + 1, 0]
        ];

        // サンプル上端・下端
        const sampleEdgeX = 0;
        const sampleEdgeY = sampleWidth / 2;
        const sampleEdgeY_bottom = -sampleEdgeY;
        // セル右上端・右下端
        const cellEdgeX = cellPositionX + this.cellLength / 2;
        const cellEdgeY = cellPositionY + this.cellWidth / 2;
        const cellEdgeY_bottom = cellPositionY - this.cellWidth / 2;
        // 検出器端
        const detectorEdgeX = detectorPositionX;

        // Scattering Angle 1: サンプル上端→セル右上端→検出器端
        const theta1 = Math.atan2(cellEdgeY - sampleEdgeY, cellEdgeX - sampleEdgeX);
        const detectorEdgeY1 = sampleEdgeY + (detectorEdgeX - sampleEdgeX) * Math.tan(theta1);
        const scatteringLine = {
            x: [sampleEdgeX, cellEdgeX, detectorEdgeX],
            y: [sampleEdgeY, cellEdgeY, detectorEdgeY1],
            type: 'scatter',
            mode: 'lines',
            line: { dash: 'dot', color: 'red', width: 1 },
            name: 'Scattering Angle 1'
        };

        // Scattering Angle 2: サンプル下端→セル右下端→検出器端
        const theta2 = Math.atan2(cellEdgeY_bottom - sampleEdgeY_bottom, cellEdgeX - sampleEdgeX);
        const detectorEdgeY2 = sampleEdgeY_bottom + (detectorEdgeX - sampleEdgeX) * Math.tan(theta2);
        const scatteringLineBottomBottom = {
            x: [sampleEdgeX, cellEdgeX, detectorEdgeX],
            y: [sampleEdgeY_bottom, cellEdgeY_bottom, detectorEdgeY2],
            type: 'scatter',
            mode: 'lines',
            line: { dash: 'dot', color: 'red', width: 1 },
            name: 'Scattering Angle 2'
        };

        // Scattering Angle 3: サンプル上端→セル右下端→検出器端
        const theta3 = Math.atan2(cellEdgeY_bottom - sampleEdgeY, cellEdgeX - sampleEdgeX);
        const detectorEdgeY3 = sampleEdgeY + (detectorEdgeX - sampleEdgeX) * Math.tan(theta3);
        const scatteringLineBottom = {
            x: [sampleEdgeX, cellEdgeX, detectorEdgeX],
            y: [sampleEdgeY, cellEdgeY_bottom, detectorEdgeY3],
            type: 'scatter',
            mode: 'lines',
            line: { dash: 'dot', color: 'black', width: 1 },
            name: 'Scattering Angle 3'
        };

        // Scattering Angle 4: サンプル下端→セル右上端→検出器端
        const theta4 = Math.atan2(cellEdgeY - sampleEdgeY_bottom, cellEdgeX - sampleEdgeX);
        const detectorEdgeY4 = sampleEdgeY_bottom + (detectorEdgeX - sampleEdgeX) * Math.tan(theta4);
        const scatteringLineBottomTop = {
            x: [sampleEdgeX, cellEdgeX, detectorEdgeX],
            y: [sampleEdgeY_bottom, cellEdgeY, detectorEdgeY4],
            type: 'scatter',
            mode: 'lines',
            line: { dash: 'dot', color: 'black', width: 1 },
            name: 'Scattering Angle 4'
        };

        // Create plot data
        const data = [
            {
                x: sampleVertices.map(v => v[0]),
                y: sampleVertices.map(v => v[1]),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'purple', width: 2 },
                name: 'Sample',
                fill: 'toself',
                fillcolor: 'rgba(128,0,128,0.3)'
            },
            {
                x: cellVertices.map(v => v[0]),
                y: cellVertices.map(v => v[1]),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'blue', width: 2 },
                name: 'Cell',
                fill: 'none'
            },
            {
                x: coilVertices.map(v => v[0]),
                y: coilVertices.map(v => v[1]),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'green', width: 2 },
                name: 'Coil',
                fill: 'none'
            },
            {
                x: detectorVertices.map(v => v[0]),
                y: detectorVertices.map(v => v[1]),
                type: 'scatter',
                mode: 'lines',
                line: { color: 'red', width: 2 },
                name: 'Detector',
                fill: 'toself',
                fillcolor: 'rgba(255,0,0,0.3)'
            },
            scatteringLine,
            scatteringLineBottomBottom,
            scatteringLineBottom,
            scatteringLineBottomTop
        ];

        // Layout settings
        const layout = {
            title: {
                text: '',
                x: 0.02,
                y: 0.3,
                xanchor: 'left',
                yanchor: 'top'
            },
            xaxis: {
                title: 'X (mm)',
                range: [-50, detectorPositionX + 50],
                zeroline: true,
                gridcolor: 'lightgray'
            },
            yaxis: {
                title: 'Y (mm)',
                range: [-Math.max(this.detectorWidth/2, sampleWidth) - 50, Math.max(this.detectorWidth/2, sampleWidth) + 50],
                zeroline: true,
                gridcolor: 'lightgray'
            },
            showlegend: showLegend,
            legend: {
                x: 1,
                y: 1,
                xanchor: 'right',
                yanchor: 'top',
                draggable: true
            },
            margin: { t: 50, r: 120 },
            annotations: [
                {
                    x: 0,
                    y: Math.max(this.detectorWidth/2, sampleWidth) + 30,
                    xref: 'x',
                    yref: 'y',
                    text: `${cellPositionY > 0 ? 'Scattering Angle 1' : cellPositionY === 0 ? 'Scattering Angle' : 'Scattering Angle 2'}: ${cellPositionY === 0 ? '±' : ''}${((cellPositionY >= 0 ? theta1 : theta2) * 180 / Math.PI).toFixed(1)}°<br>Detector Coverage: ±${detectorCoverage.toFixed(1)/2}mm`,
                    showarrow: false,
                    font: {
                        size: 14,
                        color: 'black'
                    },
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    bordercolor: 'black',
                    borderwidth: 1,
                    borderpad: 4,
                    xanchor: 'left',
                    yanchor: 'top'
                }
            ]
        };

        // Draw plot
        const config = {
            editable: true,
            dragmode: 'pan'
        };
        Plotly.newPlot('plot', data, layout, config);
    }
}

// Set up event listeners
function setupEventListeners() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updatePlot);
        input.addEventListener('change', updatePlot);
    });
}

// Update plot
function updatePlot() {
    const calculator = new ScatteringAngleCalculator(
        parseFloat(document.getElementById('cellLength').value),
        parseFloat(document.getElementById('cellWidth').value),
        parseFloat(document.getElementById('coilLength').value),
        parseFloat(document.getElementById('coilWidth').value),
        parseFloat(document.getElementById('detectorWidth').value)
    );

    const sampleWidth = parseFloat(document.getElementById('sampleWidth').value);
    const cellPosition = parseFloat(document.getElementById('cellPosition').value);
    const cellPositionY = parseFloat(document.getElementById('cellPositionY').value);
    const detectorPosition = parseFloat(document.getElementById('detectorPosition').value);
    const showLegend = document.getElementById('showLegend').checked;

    calculator.plotCoverage(cellPosition, cellPositionY, detectorPosition, sampleWidth, showLegend);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updatePlot();
});